const imageDirectory = "assets/items_and_areas";
const textsDirectory = "item_texts";
const targetAreas = {
	"short": "shortTextArea",
	"medium": "mediumTextArea",
	"long": "longTextArea"
};
const shortOnly = ["short"];
const timeOut = 200;


let items = [];
let narratives = [];
let currentSelection = [];
let currentNarrative = "";
let currentValue = "";

let allTextDurations = [];
let currentTextDurations = [];

let areas = [];
let selectedArea = localStorage.getItem("selectedArea");

let currentItemIndex = "";
let currentItemImage = 0;
let currentHollowKnightAreaImage = 0;

let currentTone = "";
let currentCompetency = "";

let languageButtonCreated = false;
let contentButtonCreated = false;
let selectedAreaFound = false;


function arraysEqual(arr1, arr2) {
	if (arr1.length !== arr2.length) return false;
		return arr1.every((value, index) => value === arr2[index]);
}

// ∞ parameters (event, function to run)
document.addEventListener("DOMContentLoaded", async function() { 
	fetch('data/data.json')
	.then(response => response.json())
	.then(data => {	
		items = data.items
		areas = data.areas;

		narratives = data.meta.narratives;
		currentNarrative = data.meta.startNarrative;
		currentValue = data.meta.startValue;

		allTextDurations = data.meta.allTextDurations;
		currentTextDurations = data.meta.allTextDurations;

		currentCompetency = data.meta.defaultCompetency;
		currentTone = data.meta.defaultTone;

		prepareNarratives(currentNarrative)
	})
	
});

function prepareNarratives(narrativeType) {
	if (selectedArea && !selectedAreaFound) {
		selectedArea = localStorage.getItem("selectedArea");
		localStorage.removeItem("selectedArea");
		currentValue = JSON.parse(selectedArea);
		selectedAreaFound = true;
	}

	if (narrativeType === "Chronological") {
		currentSelection = items.sort((itemA, itemB) => itemA.yearId - itemB.yearId);

	} else if (narrativeType === "Hollow Knight") {
		currentSelection = items.sort((itemA, itemB) => {
			const areaA = itemA.metadata.hollowKnightArea;
			const areaB = itemB.metadata.hollowKnightArea;
			const areaOrderA = areas[areaA].areaNumber;
			const areaOrderB = areas[areaB].areaNumber;
			return areaOrderA - areaOrderB;
		});
	}; 

	// ! not done here yet...
	findIndex: { 
		for (let index = 0; index < currentSelection.length; index++) {
			if (currentSelection[index].metadata.hollowKnightArea === currentValue) {
				currentItemIndex = index;
				break findIndex;
			}
		}
	}
	if (currentItemIndex === -1) {
		currentItemIndex = 0;
	}; 

	getItemInformation();
}

function getItemInformation() {
	clearItemText();
	getItemMetadata();
	getItemImages();
	getItemNarrativeText();
	getItemBodyText();
	getNavigationElements();
}

function resetBodyText() {
	clearItemBodyText();
	getItemBodyText();
}

function clearItemText() {
	clearNarrativeText();
	clearItemBodyText();
}

function clearNarrativeText() {
	document.getElementById("narrativeArea").replaceChildren();
}

function clearItemBodyText() {
	Object.values(targetAreas).forEach(id => {
		const textArea = document.getElementById(id);
		if (textArea) {
			textArea.innerHTML = "";
		}
	});
}

function getItemNarrativeText() { 
	if (!contentButtonCreated) {
		changeTextContent();
	}
	if (!languageButtonCreated) {
		changeTextLanguage();
	}
	let item = currentSelection[currentItemIndex];
	let itemNarrativeBridge = `${textsDirectory}/narrative_bridges.html`;

	fetch(itemNarrativeBridge)
	.then(response => response.text())
	.then(htmlText => {
		const tempDiv = document.createElement("div");
		tempDiv.innerHTML = htmlText;

		const historicalNarrative = tempDiv.querySelector(`.${item.areaId}-historical-text`);
		const hollowKnightNarrative = tempDiv.querySelector(`.${item.areaId}-hollow-knight-text`);

		if (currentNarrative === "Chronological") {
			document.getElementById("narrativeArea").appendChild(historicalNarrative);
		} else if (currentNarrative === "Hollow Knight") {
			document.getElementById("narrativeArea").appendChild(hollowKnightNarrative);
		} else {
			console.warn("There is no narrative text specified for this item");
		}

	});
}

function getItemBodyText() {
	let item = currentSelection[currentItemIndex];
	let itemTextFile = `${textsDirectory}/${currentTone}_${currentCompetency}/${item.itemText}`;

	fetch(itemTextFile)
	.then(response => response.text())
	.then(htmlText => {
		const tempDiv = document.createElement("div");
		tempDiv.innerHTML = htmlText;

		const shortText = tempDiv.querySelector("#shortText");
		const mediumText = tempDiv.querySelector("#mediumText");
		const longText = tempDiv.querySelector("#longText");

		const textMap = {
			"short": shortText,
			"medium": mediumText,
			"long": longText
		};

		const numberOfTextsIncluded = currentTextDurations.length - 1;

		currentTextDurations.forEach((textDuration, i) => {
			if (i <= numberOfTextsIncluded) {
				const textArea = document.getElementById(targetAreas[textDuration]);
				const text = textMap[textDuration]
				if (textArea && text) {
					textArea.appendChild(text);
				}
			}
		});
	})
	.catch(err => {
		console.error("Error loading content:", err);
	});
}

function getItemMetadata() {
	let item = currentSelection[currentItemIndex];
	let itemMetadata = item.metadata;

	for (const [metadataAttribute, value] of Object.entries(itemMetadata)) {
		if (metadataAttribute === "year" || metadataAttribute == "hollowKnightArea") {
			const container = document.getElementById(metadataAttribute);
			container.innerHTML = ""; 
			const link = document.createElement("a");
			link.href = "#";
			link.textContent = value;
			link.onclick = () => switchNarratives(metadataAttribute, itemMetadata.hollowKnightArea);
			container.appendChild(link);
		} else {
			document.getElementById(metadataAttribute).innerHTML = value;
		}
		
	}
}
function transitionToImage(alternateImage) {
	let item = currentSelection[currentItemIndex];
	itemImageArea.style.opacity = "0";

	setTimeout(() => {
		itemImageArea.src = alternateImage;
		itemImageArea.style.opacity = "1";
	}, timeOut);
}



function getItemImages() {
	let item = currentSelection[currentItemIndex];
	let itemImageArea = document.getElementById("itemImageArea");
	let hollowKnightImageArea = document.getElementById("hollowKnightImageArea");

	itemImageArea.src = imageDirectory + "/" + item.itemImages[currentItemImage];
	itemImageArea.alt = item.metadata.fullName;
	itemImageArea.style.transition = "opacity 0.4s ease, transform 0.4s ease"

	hollowKnightImageArea.src = imageDirectory + "/" + item.hollowKnightImages[currentHollowKnightAreaImage];
	hollowKnightImageArea.alt = item.metadata.hollowKnightArea;

	let itemImage = itemImageArea.src;
	let itemQRCode = `assets/qr_codes/${items[currentItemIndex].qrCodeImage}`;

	itemImageArea.addEventListener("mouseenter", () => {
		itemImageArea.style.transform = "scale(1.05)";
		itemImageArea.style.backgroundColor = "white";
		itemImageArea.style.backgroundSize = "cover";
		itemImageArea.style.backgroundPosition = "center";
		transitionToImage(itemQRCode);
	});

	itemImageArea.addEventListener("mouseleave", () => {
		itemImageArea.style.transform = "scale(1)";
		itemImageArea.style.backgroundColor = "";
		transitionToImage(itemImage);
		setTimeout(() => {
			currentItemImage = (currentItemImage === 0) ? 1 : 0;
			itemImageArea.src = imageDirectory + "/" + item.itemImages[currentItemImage];
		}, timeOut)
	});

	hollowKnightImageArea.onclick = () => {
		hollowKnightImageArea.style.transition = "opacity 0.4s ease, transform 0.4s ease";

		hollowKnightImageArea.style.opacity = "0.5";
		hollowKnightImageArea.style.transform = "scale(0.95)";

		setTimeout(() => {
			currentHollowKnightAreaImage = (currentHollowKnightAreaImage === 0) ? 1 : 0;
			hollowKnightImageArea.src = imageDirectory + "/" + item.hollowKnightImages[currentHollowKnightAreaImage];
			hollowKnightImageArea.style.opacity = "1";
			hollowKnightImageArea.style.transform = "scale(1)";
		}, timeOut); 
	};
}

function getNavigationElements() {
	let previousButtonMetadata;
	let nextButtonMetadata;

	let metadataAttribute;
	let currentItemMetadata = currentSelection[currentItemIndex].metadata;

	let additionalPreviousCharacters = "";
	let additionalNextCharacters = "";

	if (currentNarrative === "Chronological") {
		metadataAttribute = "year";
		document.getElementById("narrativeItem").innerHTML = `Year: ${currentItemMetadata[metadataAttribute]}`
	} else if (currentNarrative === "Hollow Knight") {
		metadataAttribute = "hollowKnightArea";
		additionalPreviousCharacters = areas[currentItemMetadata.hollowKnightArea].previousDirection;
		additionalNextCharacters = areas[currentItemMetadata.hollowKnightArea].nextDirection;
		document.getElementById("narrativeItem").innerHTML = `Area: ${currentItemMetadata[metadataAttribute]}`
	} else {
		console.warn("There are no buttons specified");
	}

	let previousButton = document.getElementById("previousButton");
	let nextButton = document.getElementById("nextButton");
	document.getElementById("cardTitle").innerHTML = currentSelection[currentItemIndex].shortName

	if (currentItemIndex > 0) {
		previousButton.disabled = false;
		previousButtonMetadata = currentSelection[currentItemIndex - 1].metadata[metadataAttribute];
		previousButton.innerHTML = previousButtonMetadata + " " + additionalPreviousCharacters;
		previousButton.onclick = () => {
			currentItemIndex = currentItemIndex - 1;
			getItemInformation();
		}
		previousButton.style.visibility = "visible";
	} else {
		previousButton.disabled = true;
		previousButton.style.visibility = "hidden";
	}

	if (currentItemIndex < currentSelection.length - 1) {
		nextButton.disabled = false;
		nextButtonMetadata = currentSelection[currentItemIndex + 1].metadata[metadataAttribute];
		nextButton.innerHTML = nextButtonMetadata + " " + additionalNextCharacters;
		nextButton.onclick = () => {
			currentItemIndex = currentItemIndex + 1;
			getItemInformation();
		}
		nextButton.style.visibility = "visible";
	} else {
		nextButton.disabled = true;
		nextButton.style.visibility = "hidden";
	}

	changeButtonContent();
}

function switchNarratives(metadataAttribute, value) {
	let narrativeSwitch = false;

	if (metadataAttribute === "year" && currentNarrative === "Hollow Knight") {
		currentNarrative = "Chronological";
		narrativeSwitch = true;
	} else if (metadataAttribute === "hollowKnightArea" && currentNarrative === "Chronological") {
		currentNarrative = "Hollow Knight";
		narrativeSwitch = true;
	}

	if (narrativeSwitch) {
		currentValue = value;
		clearItemText();
		prepareNarratives(currentNarrative);
	}
}

function showMore() {
	allTextDurations = ["short", "medium", "long"];
	if (!arraysEqual(allTextDurations, currentTextDurations)) {
		document.getElementById("showMore").disabled = false;
		for (let i = 0; i < allTextDurations.length; i++) {
			if (currentTextDurations.includes(allTextDurations[i]) && !currentTextDurations.includes(allTextDurations[i + 1])) {
				currentTextDurations.push(allTextDurations[i + 1]);
				break;
			}
		}
		resetBodyText();
		changeButtonContent();
	}
}

function showLess() {
	if (!arraysEqual(shortOnly, currentTextDurations)) {
		for (let i = allTextDurations.length - 1; i > 0; i--) {
			if (currentTextDurations.includes(allTextDurations[i]) && currentTextDurations.includes(allTextDurations[i - 1])) {
				const indexToRemove = currentTextDurations.indexOf(allTextDurations[i]);
				if (indexToRemove !== -1) {
					currentTextDurations.splice(indexToRemove, 1);
				}
				break;
			}
		}
		resetBodyText();
		changeButtonContent();
	}
}

function changeButtonContent() {
	allTextDurations = ["short", "medium", "long"];
	if (arraysEqual(shortOnly, currentTextDurations)) {
		document.getElementById("showLess").disabled = true;
	} else if (arraysEqual(allTextDurations, currentTextDurations)) {
		document.getElementById("showMore").disabled = true;
	} else {
		document.getElementById("showLess").disabled = false;
		document.getElementById("showMore").disabled = false;
	}
}

function changeTextContent() {
	if (contentButtonCreated) {
		if (currentCompetency === "introductory") {
			currentCompetency = "advanced";
			document.getElementById("contentDifficulty").innerHTML = "Decrease content difficulty";
			resetBodyText();
		} else if (currentCompetency === "advanced") {
			currentCompetency = "introductory";
			document.getElementById("contentDifficulty").innerHTML = "Increase content difficulty";
			resetBodyText();
		} 
	} else {
		document.getElementById("contentDifficulty").innerHTML = "Decrease content difficulty";
		contentButtonCreated = true;
	}
}

function changeTextLanguage() {
	if (languageButtonCreated) {
		if (currentTone === "young_audiences") {
			currentTone = "adults";
			document.getElementById("languageDifficulty").innerHTML = "Decrease language difficulty";
			resetBodyText();
		} else if (currentTone === "adults") {
			currentTone = "young_audiences";
			document.getElementById("languageDifficulty").innerHTML = "Increase language difficulty";
			resetBodyText();
		}
	} else {
		document.getElementById("languageDifficulty").innerHTML = "Decrease language difficulty";
		languageButtonCreated = true;
	}
}

document.addEventListener("DOMContentLoaded", () => {

})


// // ∞ some sort of image gallery, and a way to switch between images
// document.addEventListener("DOMContentLoaded", () => {
//   // Your current item data - replace this with dynamic loading
// //   const currentItem = {
// //     itemImages: ["dirtmouth_I1.jpg", "dirtmouth_I2.jpg"],
// //     hollowKnightImages: ["dirtmouth_A1.jpg", "dirtmouth_A2.jpg"]
// //   };

//   let itemImageIndex = 0;
//   let hkImageIndex = 0;

//   const itemImageArea = document.getElementById("itemImageArea");
//   const hollowKnightImageArea = document.getElementById("hollowKnightImageArea");

//   const itemImageDots = document.getElementById("itemImageDots");
//   const hollowKnightImageDots = document.getElementById("hollowKnightImageDots");

//   function createDots(container, count, activeIndex, onClick) {
//     container.innerHTML = ""; // clear previous dots
//     for (let i = 0; i < count; i++) {
//       const dot = document.createElement("span");
//       dot.classList.toggle("active", i === activeIndex);
//       dot.addEventListener("click", () => onClick(i));
//       container.appendChild(dot);
//     }
//   }

//   function showItemImage(index) {
//     if (index < 0) index = currentItem.itemImages.length - 1;
//     if (index >= currentItem.itemImages.length) index = 0;
//     itemImageIndex = index;
//     itemImageArea.src = currentItem.itemImages[itemImageIndex];
//     itemImageArea.alt = `Item Image ${itemImageIndex + 1}`;
//     createDots(itemImageDots, currentItem.itemImages.length, itemImageIndex, showItemImage);
//   }

//   function showHKImage(index) {
//     if (index < 0) index = currentItem.hollowKnightImages.length - 1;
//     if (index >= currentItem.hollowKnightImages.length) index = 0;
//     hkImageIndex = index;
//     hollowKnightImageArea.src = currentItem.hollowKnightImages[hkImageIndex];
//     hollowKnightImageArea.alt = `Hollow Knight Image ${hkImageIndex + 1}`;
//     createDots(hollowKnightImageDots, currentItem.hollowKnightImages.length, hkImageIndex, showHKImage);
//   }

//   showItemImage(0);
//   showHKImage(0);
// });
