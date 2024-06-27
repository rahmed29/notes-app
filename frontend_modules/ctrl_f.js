import { note } from "./note_utils";
import { jumpToDesiredPage } from "./dom_formatting";
import { createPalette, render_p } from "./cmd";

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
    const commands = note.content.reduce((arr, e, i) => {
      let str = findSubstringWithContext(e, text);
      if (str) {
        arr.push({
          name: str,
          icon: `Page ${i + 1}`,
          handler: () => jumpToDesiredPage(i),
        });
      }
      return arr;
    }, []);
    render_p(2, commands, results);
  });
}
