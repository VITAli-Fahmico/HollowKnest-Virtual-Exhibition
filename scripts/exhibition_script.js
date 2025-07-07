const imageDirectory = "assets";
const textsDirectory = "item_texts";
const targetAreas = {
	"short": "shortTextArea",
	"medium": "mediumTextArea",
	"long": "longTextArea"
};


let items = [];
let narratives = [];
let currentSelection = [];
let currentNarrative = "";
let currentValue = "";
let currentTextDurations = [];
let currentSort = "";
let areas = [];

let tone = "";
let competency = "";

// runs the function when ready (i.e. everything inside the brackets)

// the event listener in this case is attached to the ENTIRE document
// ∞ parameters (event, function to run)
document.addEventListener("DOMContentLoaded", async function() { 
	fetch('data/data.json')
	.then(response => response.json())
	.then(data => {	
		items = data.items
		let startWith = data.meta.startWith;
		// let item = items[startWith]

		narratives = data.meta.narratives;
		currentNarrative = data.meta.startNarrative;
		currentValue = data.meta.startValue;
		currentTextDurations = data.meta.startTextDurations;
		areas = data.areas;

		currentCompetency = data.meta.defaultCompetency;
		currentTone = data.meta.defaultTone;

		prepareNarratives(currentNarrative)
	})
});

// & IF and else for starting items
// if the narrative is historical: start with year 1
// If the narrative is HK, start with area 1

// ! function : prepare narratives
// show information

function prepareNarratives(narrativeType) {
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
	let itemIndex = currentSelection.findIndex(item => {item[narrativeType] == currentSort})
	if (itemIndex == -1) {
		itemIndex = 0
	}; // test if it works....
	getItemInformation(itemIndex);
}

function getItemInformation(itemIndex) {
	getItemImages(itemIndex);
	getItemMetadata(itemIndex);
	getItemText(itemIndex);
	getNavigationElements(itemIndex);
}

function getItemText(itemIndex) { 
	let item = currentSelection[itemIndex];
	const itemTextFile = `${textsDirectory}/${currentTone}_${currentCompetency}/${item.itemText}`;

	fetch(itemTextFile)
	.then(res => res.text())
	.then(htmlText => {
		const tempDiv = document.createElement("div");
		tempDiv.innerHTML = htmlText;

		const historicalNarrative = tempDiv.querySelector("#historicalNarrative");
		const hollowKnightNarrative = tempDiv.querySelector("#hollowKnightNarrative");
		const shortText = tempDiv.querySelector("#shortText");
		const mediumText = tempDiv.querySelector("#mediumText");
		const longText = tempDiv.querySelector("#longText");

		if (currentNarrative === "Chronological") {
			document.getElementById("historicalNarrativeArea").appendChild(historicalNarrative);
		} else if (currentNarrative === "Hollow Knight") {
			document.getElementById("hollowKnightNarrativeArea").appendChild(hollowKnightNarrative);
		} else {
			console.warn("There is no narrative text specified for this item");
		}

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
// when show more is clicked, the text duration is reduced....

function getItemMetadata(itemIndex) {
	const itemMetadata = currentSelection[itemIndex].metadata;
	for (const [metadataAttribute, value] of Object.entries(itemMetadata)) {
		document.getElementById(metadataAttribute).innerHTML = value;
	}
}

function getItemImages(itemIndex) { // temporarily just one
	console.log(currentSelection) // ! fix issue!!! with HK narratives
	let item = currentSelection[itemIndex];
	let itemImageArea = document.getElementById("itemImageArea");
	let hollowKnightImageArea = document.getElementById("hollowKnightImageArea");
	itemImageArea.src = imageDirectory + "/" + item.itemImages[0];
	hollowKnightImageArea.src = imageDirectory + "/" + item.hollowKnightImages[0];
}

function getNavigationElements(itemIndex) {
	let previousButtonDisabled;
	let previousButtonMetadata;
	let nextButtonDisabled;
	let nextButtonMetadata;

	let metadataAttribute;
	let currentItemMetadata = currentSelection[itemIndex].metadata;

	if (currentNarrative === "Chronological") {
		metadataAttribute = "year";
		document.getElementById("narrativeItem").innerHTML = `Year: ${currentItemMetadata[metadataAttribute]}`
	} else if (currentNarrative === "Hollow Knight") {
		metadataAttribute = "hollowKnightArea";
		document.getElementById("narrativeItem").innerHTML = `Hollow Knight area: ${currentItemMetadata[metadataAttribute]}`
	} else {
		console.warn("There are no buttons specified");
	}

	if (itemIndex > 0) {
		previousButtonDisabled = false;
		previousButtonMetadata = currentSelection[itemIndex - 1].metadata[metadataAttribute];
	} else {
		previousButtonDisabled = true;
		previousButtonMetadata = "--";
	}

	if (itemIndex < currentSelection.length - 1) {
		nextButtonDisabled = false;
		nextButtonMetadata = currentSelection[itemIndex + 1].metadata[metadataAttribute];
	} else {
		nextButtonDisabled = true
		nextButtonMetadata = "--"
	}

	document.getElementById("previousButton").disabled = previousButtonDisabled;
	document.getElementById("nextButton").disabled = nextButtonDisabled;

	document.getElementById("previousButton").innerHTML = previousButtonMetadata;
	document.getElementById("nextButton").innerHTML = nextButtonMetadata;

	document.getElementById("cardTitle").innerHTML = currentSelection[itemIndex].shortName
}



// ! function : show information 
// utility functions for showing content should be run in here

// ! function : short text
// ∞ use fetch (or make a function that is responsible for retrieving text)
// shows only the small text
// hides the medium and large texts
// ! make sure to put d-none on elements with a given class

// ! function : medium text
// ∞ use fetch
// shows the small and medium texts
// hides the large text

// ! function : large text
// ∞ use fetch
// shows all texts

// ! function : create metadata tables
// iterate through each item

// ! function : create appropriate navigation buttons (e.g. for forgotten crossroads, there is dirtmouth (L) and greenpath (R))
// create conditions for the first and last areas

// ! function : switching narratives

// ! functions : show, hide, and something for adding inner content:
// ...

// ?? other stuff for later
// ∞ some sort of image gallery, and a way to switch between images
// ∞ a way to choose text to show and hide
// perhaps a good way to do this is by having short, medium, and long classes attached to each div within a file