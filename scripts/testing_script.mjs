// to complete

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

for (let objectNumber = 1; objectNumber <= allItems.length; objectNumber++) {
    let itemImage = allItems[objectNumber - 1].itemImages[0]
    let hollowKnightImage = allItems[objectNumber - 1].hollowKnightImages[0]
    console.log(itemImage)
    console.log(hollowKnightImage)
}

// console.log(jsonData);