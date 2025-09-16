import { note } from "../data/note";
import { jumpToDesiredPage } from "../dom_formatting";
import { createPalette } from "./cmd";
import { previewContent } from "../important_stuff/dom_refs";
import { editor } from "../important_stuff/editor";
import { removeMD } from "../../shared_modules/removeMD";

export { showSearch };

function showSearch(shift = false) {
  if (!shift) {
    return;
  }
  function findSubstringWithContext(mainStr, subStr) {
    const cAmount = 30 - subStr.length;
    // mainStr = removeMD(mainStr)
    const index = mainStr.toLowerCase().indexOf(subStr.toLowerCase());
    if (index === -1) {
      return null;
    }

    const start = Math.max(0, index - cAmount);
    const end = Math.min(mainStr.length, index + subStr.length + cAmount);

    const before = mainStr.substring(start, index);
    const after = mainStr.substring(index + subStr.length, end);

    const middle = mainStr.substring(index, index + subStr.length);

    return `<span class = 'leftFade'>${before}</span><mark>${middle}</mark><span class = 'rightFade'>${after}</span>`;
  }

  createPalette(
    "Search for text within this notebook...",
    (results, text, render) => {
      const commands = note.content.reduce((arr, e, i) => {
        let str = findSubstringWithContext(e, text);
        if (str) {
          arr.push({
            name: str,
            icon: `Page ${i + 1}`,
            handler: () => {
              jumpToDesiredPage(i);
              findStringOnPage(removeMD(text));
            },
          });
        }
        return arr;
      }, []);
      render(2, commands, results);
    },
    null,
    false,
  );
}

function findStringOnPage(text) {
  editor.gotoLine(0, 0);
  editor.find(text);
  editor.focus();
  for (const node of previewContent.children) {
    // text content because we want the text as it is in HTML markup
    if (node.textContent.toLowerCase().includes(text.toLowerCase())) {
      // we're not doing a event listener that removes the class on animation end because if the user kept changing view mode the animation would never register as ended
      node.classList.add("normalFlash");
      setTimeout(() => {
        node.classList.remove("normalFlash");
      }, 1000);
      node.scrollIntoView({ block: "center" });
      break;
    }
  }
}
