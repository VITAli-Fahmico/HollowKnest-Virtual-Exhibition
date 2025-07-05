// to complete

// load image for each...

// gets the image for each area... uses :
// img src="" alt=""
// itemImages[0]
// hollowKnightImages[0]
// add alt as well...

/* document.addEventListener("DOMContentLoaded", async function(event) {
    const response = await fetch("data.json");
    const data = await response.json();
}); */

// const response = await fetch('data/data.json');
// const data = await response.json();
// console.log(data);

// <!-- ← → ↔ ↑ ↓ , ↕ , ↖ ↗ ↘ ↙ -->
// before objects are implemented, one needs to tested on its own for layout purposes


import { readFile } from 'fs/promises';

const jsonString = await readFile('data/data.json', 'utf-8'); // change to await fetch("data/data.json");
const allData = JSON.parse(jsonString); // change to await response.json()
const allItems = allData.items

// let currentItem = ""

for (let itemNumber = 1; itemNumber <= allItems.length; itemNumber++) {
    let item = allItems[itemNumber - 1]
    let itemImage = item.itemImages[0]
    let hollowKnightImage = item.hollowKnightImages[0]
    // let area = document.getElementById("myShape")

    console.log(item.areaId)
    console.log(itemImage)
    console.log(hollowKnightImage)
}

// console.log(jsonData);