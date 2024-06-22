import DOMPurify from "dompurify";
import { note } from "./note_utils";
import { jumpToDesiredPage } from "./dom_formatting";
import { closePalette, createPalette } from "./cmd";

export { showSearch };

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

    return `<span class = 'leftFade'>${before}</span><mark>${subStr}</mark><span class = 'rightFade'>${after}</span>`;
  }

  createPalette("Search for text within this notebook...", (results, text) => {
    while (results.firstChild) {
      results.firstChild.remove();
    }
    if (!text) {
      return;
    }
    for (let i = 0, n = note.content.length; i < n; i++) {
      const result = findSubstringWithContext(note.content[i], text);
      if (result) {
        const item = document.createElement("div");
        item.setAttribute("data-page", i);
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
          closePalette();
        });
        results.appendChild(item);
      }
    }
  });
}
