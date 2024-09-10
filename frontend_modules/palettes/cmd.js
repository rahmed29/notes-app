import { mainContainer } from "../important_stuff/dom_refs";
import { eid, attemptRemoval, setInnerHTML } from "../dom_utils";
import { editor } from "../important_stuff/editor";
import { globalPopupClose } from "../mediators/popup_closers";

export { createPalette, closePalette };

let finderNode;

function handleKeys(e) {
  if (e.key === "Enter" && finderNode) {
    e.preventDefault();
    finderNode.click();
  } else if (e.key === "Escape") {
    closePalette();
  } else if (
    (e.key === "ArrowUp" || (e.key === "Tab" && e.shiftKey)) &&
    finderNode &&
    finderNode.previousElementSibling
  ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    finderNode.classList.remove("selected");
    finderNode = finderNode.previousElementSibling;
    finderNode.classList.add("selected");
    finderNode.scrollIntoView({ block: "center" });
  } else if (
    (e.key === "ArrowDown" || (e.key === "Tab" && !e.shiftKey)) &&
    finderNode &&
    finderNode.nextElementSibling
  ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    finderNode.classList.remove("selected");
    finderNode = finderNode.nextElementSibling;
    finderNode.classList.add("selected");
    finderNode.scrollIntoView({ block: "center" });
  } else if (e.key === "Tab" || e.key === "ArrowUp" || e.key === "ArrowDown") {
    e.preventDefault();
  }
}

function closePalette() {
  attemptRemoval([eid("paletteContainer")]);
  finderNode = null;
  document.removeEventListener("keydown", handleKeys);
}

function filter_p(arr, text) {
  const response = [];
  const lowPrio = [];
  for (const e of arr) {
    if (e.name.toLowerCase().includes(text.toLowerCase())) {
      response.push(e);
    } else if (
      e.searchTerm &&
      e.searchTerm.toLowerCase().includes(text.toLowerCase())
    ) {
      lowPrio.push(e);
    }
  }
  return response.concat(lowPrio);
}

async function render_p(version, arr, results) {
  while (results.firstChild) {
    results.firstChild.remove();
  }
  for (const cmd of arr) {
    const item = document.createElement("div");
    // a populater populates the children when the item is clicked
    if (cmd.populater) {
      item.addEventListener("click", async () => {
        const children = await cmd.populater();
        createPalette(
          "Search...",
          (results, text, render, filter) => {
            render(version, filter(children, text), results);
          },
          (results) => {
            render_p(version, children, results);
          }
        );
      });
    } else if (cmd.children) {
      item.addEventListener("click", () => {
        createPalette(
          "Search...",
          (results, text, render, filter) => {
            render(version, filter(cmd.children, text), results);
          },
          (results, render) => {
            render(version, cmd.children, results);
          }
        );
      });
    } else {
      item.addEventListener("click", () => {
        closePalette();
        cmd.handler();
      });
    }
    item.classList.add("item");
    // version 1 is just text
    if (version === 1) {
      item.innerText = cmd.name;
    } else {
      // version 2 is centered text with an left aligned 'icon'. The icon can be anything including HTML.
      const h3 = document.createElement("h3");
      setInnerHTML(h3, cmd.icon);
      item.appendChild(h3);
      const finder = document.createElement("div");
      finder.classList.add("finder");
      setInnerHTML(finder, cmd.name);
      item.appendChild(finder);
    }
    results.appendChild(item);
  }
}

// 1. placeholder text
// 2. a search function handler. This search function handler gets a couple params passed into it: the results section of the palette, the search term, the render function and the filter function
// 3. an optional function to run when the palette is created
// 4. an optional boolean to show "No results" when the search bar is empty
function createPalette(placeholder, searchHandler, init, showNoResults = true) {
  function resetFinder() {
    if (!results.firstChild && showNoResults) {
      results.innerHTML = "&nbsp;<br>&nbsp;&nbsp;No results<br>&nbsp;";
      finderNode = null;
    } else if (results.firstChild) {
      finderNode = results.firstChild;
      if (finderNode) {
        finderNode.classList.add("selected");
      }
    }
  }
  globalPopupClose();
  closePalette();
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
    init(results, render_p, filter_p);
    resetFinder();
  }

  const searchBar = document.createElement("input");
  searchBar.autocomplete = "off";
  searchBar.placeholder = placeholder;
  searchBar.addEventListener("input", () => {
    if (!searchBar.value) {
      if (init) {
        init(results, render_p);
        resetFinder();
      } else {
        while (results.firstChild) {
          results.firstChild.remove();
        }
      }
      return; // don't run the search handler if the search bar is empty
    }
    searchHandler(results, searchBar.value, render_p, filter_p);
    resetFinder();
  });
  document.addEventListener("keydown", handleKeys);

  modal.appendChild(searchBar);
  modal.appendChild(results);
  modalContainer.appendChild(modal);
  mainContainer.after(modalContainer);
  searchBar.focus();
}
