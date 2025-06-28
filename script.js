const directory = "components"

fetch(`${directory}/navbar.html`) // sends a get request (like requests.get() in python)
.then(res => res.text()) // waits for the response then extracts the raw HTML as text
.then(data => {
    document.getElementById("navbar-placeholder").innerHTML = data; // injects the content into where the element navbar-placeholder is

    const currentPage = window.location.pathname.split("/").pop(); // gets only the ending (e.g. map.html without the start of the filename path)
    const navLinks = document.querySelectorAll("#navbar-placeholder a.nav-link"); // selecting all anchor tags that have the class nav-link inside the navbar placeholder element that I created
    navLinks.forEach(link => { // like a for loop
    if (link.getAttribute("href") === currentPage) {
        link.classList.add("active");
        } // adds the active class to the link to highlight that you are currently on the page
    });

})
.catch(err => console.error("Navbar load failed:", err));

// Load Footer
fetch(`${directory}/footer.html`)
.then(res => res.text())
.then(data => {
    document.getElementById("footer-placeholder").innerHTML = data;
})
.catch(err => console.error("Footer load failed:", err));
