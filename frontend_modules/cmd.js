import { mainContainer } from "../main";
import { editor } from "../main";
import { eid, attemptRemoval } from "./dom_utils";
import { closePopupWindow } from "./popup";

export { createPalette, closePalette };

function handleKeys(e) {
  if (e.key === "Enter") {
    e.preventDefault();
    document.getElementsByClassName("selected")[0].click();
  } else if (e.key === "Escape") {
    closePalette();
  } else if (
    e.key === "ArrowUp" &&
    finderNode &&
    finderNode.previousElementSibling
  ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    finderNode.classList.remove("selected");
    finderNode = finderNode.previousElementSibling;
    finderNode.classList.add("selected");
    finderNode.scrollIntoView();
  } else if (
    e.key === "ArrowDown" &&
    finderNode &&
    finderNode.nextElementSibling
  ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    finderNode.classList.remove("selected");
    finderNode = finderNode.nextElementSibling;
    finderNode.classList.add("selected");
    finderNode.scrollIntoView();
  }
}

let finderNode = null;

function closePalette() {
  attemptRemoval([eid("paletteContainer")]);
  finderNode = null;
  document.removeEventListener("keydown", handleKeys);
}

// 1. placeholder text
// 2. a search function handler. This search function handler gets a couple params passed into it: the results section of the palette & the search term
// 3. an optional function to run when the palette is created
function createPalette(placeholder, searchHandler, init) {
  function resetFinder() {
    if (!results.firstChild) {
      results.innerHTML = "&nbsp;<br>&nbsp;&nbsp;No results<br>&nbsp;";
      finderNode = null;
    } else {
      finderNode = results.firstChild;
      if (finderNode) {
        finderNode.classList.add("selected");
      }
    }
  }

  closePalette();
  closePopupWindow();
  const modalContainer = document.createElement("div");
  modalContainer.id = "paletteContainer";
  modalContainer.addEventListener("click", closePalette);
  editor.session.on("change", closePalette);
  const modal = document.createElement("div");
  modal.addEventListener("click", (e) => e.stopPropagation());
  modal.classList.add("powerSearch");

  const results = document.createElement("div");
  results.classList.add("results");

  if (init) {
    init(results);
    resetFinder();
  }

  const searchBar = document.createElement("input");
  searchBar.placeholder = placeholder;
  searchBar.addEventListener("input", function () {
    searchHandler(results, this.value);
    resetFinder();
  });
  document.addEventListener("keydown", handleKeys);

  modal.appendChild(searchBar);
  modal.appendChild(results);
  modalContainer.appendChild(modal);
  mainContainer.after(modalContainer);
  searchBar.focus();
}
