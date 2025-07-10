const componentDirectory = "components";
const stylesheetsDirectory = "stylesheets";

function selectArea(selectedArea) {
	localStorage.setItem("selectedArea", JSON.stringify(selectedArea));
	window.location.href = "exhibition.html";
}

async function loadComponent(fileName, placeholderId, backgroundClass) { // for loading essential HTML content into each placeholder
	try {
		const response = await fetch(`${componentDirectory}/${fileName}`);
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}
		const htmlContent = await response.text();
		document.getElementById(placeholderId).innerHTML = htmlContent; // injects the HTML content here

		const component = document.querySelector("#" + placeholderId); // for getting rid of the temporary background
      	if (component) {
        	component.classList.remove(backgroundClass);
      	}
	} catch (error) {
		console.error(`Error loading ${fileName}:`, error);
		true
	}
}

async function loadNavbar() {
	await loadComponent("navbar.html", "navbar", "navbar-background");

	const currentPage = window.location.pathname.split("/").pop();  // gets only the ending (e.g. map.html without the start of the filename path)
	const navLinks = document.querySelectorAll("#navbar a.nav-link");

	navLinks.forEach(link => {
		const linkHref = link.getAttribute("href");
		if (linkHref === currentPage) {
			link.classList.add("active"); // adds the active class to the highlight that you are currently on the page
		} // 
	});
}

async function loadFooter() {
	await loadComponent("footer.html", "footer", "footer-background");
}

// ! if on the exhibition page

document.addEventListener("DOMContentLoaded", async () => { // loads the header and the footer on DOMContentLoaded
	await loadNavbar();
	await loadFooter();
	// await loadExhibitionPreview()
}); 

