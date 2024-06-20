import DOMPurify from "dompurify";
import { mainContainer } from "../main";
import { note } from "./note_utils";
import { closePopupWindow } from "./popup";
import { jumpToDesiredPage } from "./dom_formatting";
import { editor } from "../main";

export { showSearch, resetFinder };

let finderNode = null;

function resetFinder() {
  finderNode = null;
  document.removeEventListener("keydown", handleKeys)
}

function handleKeys(e) {
  if (e.key === "Enter") {
    jumpToDesiredPage(
      parseInt(
        document.getElementsByClassName("selected")[0].getAttribute("data-page")
      )
    );
    closePopupWindow();
  } else if (e.key === "Escape") {
    closePopupWindow();
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
  }
}

function showSearch() {
  function findSubstringWithContext(mainStr, subStr) {
    const cAmount = 30 - subStr.length;
    // mainStr = removeMD(mainStr)
    const index = mainStr.toLowerCase().indexOf(subStr.toLowerCase());
    if (index === -1) {
      return null;
    }

    const start = Math.max(0, index - cAmount);
    const end = Math.min(mainStr.length, index + subStr.length + cAmount);

    const before = mainStr.slice(start, index);
    const after = mainStr.slice(index + subStr.length, end);

    return `${before}<mark>${subStr}</mark>${after}`;
  }
  closePopupWindow();
  const modalContainer = document.createElement("div");
  modalContainer.id = "popupModal";
  modalContainer.addEventListener("click", closePopupWindow);
  editor.session.on("change", closePopupWindow);
  const modal = document.createElement("div");
  modal.addEventListener("click", (e) => e.stopPropagation());
  modal.classList.add("powerSearch");

  const results = document.createElement("div");
  results.classList.add("results");

  const searchBar = document.createElement("input");
  searchBar.placeholder = "Search for some text within this notebook...";
  document.addEventListener("keydown", handleKeys);

  let found;
  searchBar.addEventListener("input", function () {
    while (results.firstChild) {
      results.firstChild.remove();
    }
    found = false;
    if (!this.value) {
      return;
    }
    for (let i = 0, n = note.content.length; i < n; i++) {
      const result = findSubstringWithContext(note.content[i], this.value);
      if (result) {
        const item = document.createElement("div");
        item.setAttribute("data-page", i);
        if (!found) {
          finderNode = item;
          finderNode.classList.add("selected");
          found = true;
        }
        item.classList.add("item");
        const h3 = document.createElement("h3");
        h3.innerText = `Page ${i + 1}`;
        item.appendChild(h3);
        const finder = document.createElement("div");
        finder.classList.add("finder");
        finder.classList.add("fading-box");
        finder.innerHTML = DOMPurify.sanitize(result);
        item.appendChild(finder);
        item.addEventListener("click", () => {
          jumpToDesiredPage(i);
          closePopupWindow();
        });
        results.appendChild(item);
      }
    }
  });
  modal.appendChild(searchBar);
  modal.appendChild(results);
  modalContainer.appendChild(modal);
  mainContainer.after(modalContainer);
  searchBar.focus();
}
