const componentDirectory = "components";
const stylesheetsDirectory = "stylesheets";

async function loadComponent(fileName, placeholderId) { // for loading essential HTML content into each placeholder
	try {
		const response = await fetch(`${componentDirectory}/${fileName}`);
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}
		const htmlContent = await response.text();
		document.getElementById(placeholderId).innerHTML = htmlContent; // injects the HTML content here
	} catch (error) {
		console.error(`Error loading ${fileName}:`, error);
		true
	}
}

async function loadNavbar() {
	await loadComponent("navbar.html", "navbar");

	const currentPage = window.location.pathname.split("/").pop();  // gets only the ending (e.g. map.html without the start of the filename path)
	const navLinks = document.querySelectorAll("#navbar a.nav-link");

	navLinks.forEach(link => {
		const linkHref = link.getAttribute("href");
		if (linkHref === currentPage) {
			link.classList.add("active"); // adds the active class to the highlight that you are currently on
		}
	});
}

async function loadFooter() {
	await loadComponent("footer.html", "footer");
}

document.addEventListener("DOMContentLoaded", async () => { // loads the header and the footer on DOMContentLoaded
	await loadNavbar();
	await loadFooter();
}); 