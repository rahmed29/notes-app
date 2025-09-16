import { mainContainer } from "../important_stuff/dom_refs";
import { eid, attemptRemoval, setInnerHTML, appendText } from "../dom_utils";
import { editor } from "../important_stuff/editor";
import { globalPopupClose } from "../mediators/popup_closers";

export { createPalette, closePalette, beginAsyncPal, asyncPalette };

let finderNode;
let async_pal_incoming = false;

function beginAsyncPal() {
  async_pal_incoming = true;
}

function asyncPalette(placeholder, searchHandler, init, showNoResults = true) {
  if (async_pal_incoming) {
    async_pal_incoming = false;
    createPalette(placeholder, searchHandler, init, showNoResults);
  }
}

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
  async_pal_incoming = false;
  attemptRemoval([eid("paletteContainer")]);
  finderNode = null;
  document.removeEventListener("keydown", handleKeys);
}

function filter_p(arr, text) {
  text = text.replaceAll(" nad ", " and ");
  text = text.replaceAll("nad ", "and ");
  text = text.replaceAll(" nad", " and");
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
    // a populator populates the children when the item is clicked
    if (cmd.populator) {
      item.addEventListener("click", async () => {
        beginAsyncPal();
        const children = await cmd.populator();
        if (children) {
          asyncPalette(
            "Search...",
            (results, text, render, filter) => {
              render(
                cmd.populatorV ?? version,
                filter(children, text),
                results,
              );
            },
            (results) => {
              render_p(cmd.populatorV ?? version, children, results);
            },
          );
        } else {
          closePalette();
        }
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
          },
        );
      });
    } else {
      item.addEventListener("click", () => {
        closePalette();
        if (cmd.handler) {
          cmd.handler();
        }
      });
    }
    item.classList.add("item");
    // version 1 is just text
    if (version === 1) {
      const span = document.createElement("span");
      span.innerText = cmd.name;
      item.appendChild(span);
      if (cmd.info) {
        appendText(
          span,
          `<mark style = 'padding: 3px; border-radius: 3px; background'>${cmd.info}</mark>`,
          0.8,
        );
      }
    } else {
      // version 2 is centered text with an left aligned 'icon'. The icon can be any HTML, also the main text can be any HTML in this version.
      const h3 = document.createElement("h3");
      setInnerHTML(h3, cmd.icon);
      item.appendChild(h3);
      const finder = document.createElement("div");
      finder.classList.add("finder");
      setInnerHTML(finder, cmd.name);
      if (cmd.info) {
        appendText(item, cmd.info, 0.5);
      }
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
  if (async_pal_incoming) {
    return;
  }
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
