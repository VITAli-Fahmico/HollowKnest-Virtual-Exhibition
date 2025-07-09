const themes = {
    earlyModern: "early-modern.css",
    twentiethCenturyFirstHalf: "twentieth-century-1.css",
    twentiethCenturySecondHalf: "twentieth-century-2.css",
    futuristic: "futuristic.css"
};

document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme") || "futuristic.css";
    console.log(`Theme reloaded: ${savedTheme}`)
    setTheme(savedTheme);
});

function setTheme(themeName) {
    const existingLink = document.getElementById("theme-link");

    // Remove old theme if it exists
    if (existingLink) {
        existingLink.remove();
    }

    if (themes[themeName]) {
        const themePath = stylesheetsDirectory + "/" + themes[themeName];
        const newLink = document.createElement("link");
        newLink.id = "theme-link";
        newLink.rel = "stylesheet";
        newLink.href = themePath;

        document.head.appendChild(newLink);

        localStorage.setItem("theme", themeName); // store the name, not path
        console.log(`Theme applied: ${themeName}`);
    } else {
        console.warn(`Theme "${themeName}" does not exist.`);
    }
}