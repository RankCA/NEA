// Declarations
const landingpage = document.getElementById("LandingPage");
const loginpage = document.getElementById("LogIn");
const createaccountpage = document.getElementById("CreateAccount");
const mainmenu = document.getElementById("MainMenu");
const solodisplaypage = document.getElementById("SoloDisplay");

const pages = [landingpage, createaccountpage, loginpage, mainmenu, solodisplaypage];

// adminnav events
document.getElementById("adminnav1").addEventListener("click", () => setadminnav(0));
document.getElementById("adminnav2").addEventListener("click", () => setadminnav(1));
document.getElementById("adminnav3").addEventListener("click", () => setadminnav(2));
document.getElementById("adminnav4").addEventListener("click", () => setadminnav(3));
document.getElementById("adminnav6").addEventListener("click", () => setadminnav(4));

function setadminnav(pageIndex) {
  // hide every page
  pages.forEach(page => {
    if (page) page.classList.add("hidden-section");
  });
  
  // show chosen page
  if (pages[pageIndex]) {
    pages[pageIndex].classList.remove("hidden-section");
  }
}