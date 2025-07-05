// to complete

// load image for each...

// gets the image for each area... uses :
// img src="" alt=""
// itemImages[0]
// hollowKnightImages[0]
// add alt as well...

document.addEventListener("DOMContentLoaded", async function(event) {
    const response = await fetch("data.json");
    const data = await response.json();
    const allItems = data.items

for (let objectNumber = 1; objectNumber <= allItems.length; objectNumber++) {
    let itemImage = allItems[0].itemImages[0]
    let hollowKnightImage = allItems[0].hollowKnightImages[0]
}

});

