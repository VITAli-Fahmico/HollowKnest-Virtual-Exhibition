const imageDirectory = "assets/items_and_areas";

document.addEventListener("DOMContentLoaded", async function(event) {
    const response = await fetch("data/data.json");
    const data = await response.json();
    const allItems = data.items;

    for (let itemNumber = 1; itemNumber <= allItems.length; itemNumber++) {
        let item = allItems[itemNumber - 1];
        let itemImage = `url('${imageDirectory + "/" + item.itemImages[0]}')`;
        let hollowKnightImage = `url('${imageDirectory + "/" + item.hollowKnightImages[0]}')`;

        styleImage(item.areaId, hollowKnightImage, itemImage);
    }
});

function styleImage(className, hollowKnightImage, itemImage) {
    const style = document.createElement("style");

    style.innerHTML = `
    .${className} {
        background-image: ${hollowKnightImage}; 
        background-color: rgb(0, 0, 0, 0.5);
        background-blend-mode: multiply;
        background-size: cover;       
        background-position: center;
    }
    
    .${className}-text:hover {
        background-image: ${itemImage}; 
        background-color: rgb(0, 0, 0, 0.5);
        background-blend-mode: multiply;
        background-size: cover;       
        background-position: center;
    }`;
    document.head.appendChild(style);
}