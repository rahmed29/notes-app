import { mainContainer } from "../../main";
import { editor } from "../../main";
import { eid, attemptRemoval } from "../dom_utils";
import { closePopupWindow } from "../popups/popup";

export { createPalette, closePalette, render_p };

function handleKeys(e) {
  if (e.key === "Enter" && finderNode) {
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

function render_p(version, arr, results) {
  while (results.firstChild) {
    results.firstChild.remove();
  }
  arr.forEach((cmd) => {
    const item = document.createElement("div");
    if (cmd.children) {
      item.addEventListener("click", () => {
        createPalette(
          "Search...",
          (results, text) => {
            render_p(
              version,
              cmd.children.filter((e) =>
                e.name.toLowerCase().includes(text.toLowerCase())
              ),
              results
            );
          },
          (results, text) => {
            render_p(version, cmd.children, results);
          }
        );
      });
    } else {
      item.addEventListener("click", () => {
        cmd.handler();
        closePalette();
      });
    }
    item.classList.add("item");
    // version 1 is just text
    if (version === 1) {
      item.innerText = cmd.name;
    } else {
      // version 2 is centered text with an left aligned 'icon'. The icon can be anything including HTML.
      const h3 = document.createElement("h3");
      h3.innerHTML = cmd.icon;
      item.appendChild(h3);
      const finder = document.createElement("div");
      finder.classList.add("finder");
      finder.innerHTML = DOMPurify.sanitize(`${cmd.name}`);
      item.appendChild(finder);
    }
    results.appendChild(item);
  });
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
