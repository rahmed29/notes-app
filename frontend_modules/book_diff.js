import { createPopupWindow, closePopupWindow } from "./popup";
import { contextMenu, delContextMenu } from "./context_menu";
import { mainContainer } from "../main";
import { note } from "./note_utils";
import { jumpToDesiredPage } from "./dom_formatting";

export { showBookDiffPopup };

function getDiff(one, other) {
  let span = null;

  const diff = Diff.diffChars(one, other);
  const fragment = document.createDocumentFragment();

  diff.forEach((part) => {
    const [bgColor, textColor] = part.added
      ? ["#33ff96", "black"]
      : part.removed
      ? ["#ff5e5e", "black"]
      : ["rgba(0,0,0,0)", ""];
    span = document.createElement("span");
    span.style.background = bgColor;
    span.style.color = textColor;
    span.appendChild(document.createTextNode(part.value));
    fragment.appendChild(span);
  });
  return fragment;
}

function showBookDiffPopup() {
  const bookDiffContent = createPopupWindow();
  const timesToRepeat = Math.max(note.dbSave.length, note.content.length);
  const missingPage =
    timesToRepeat === note.dbSave.length ? note.dbSave : note.content;
  const [bgColor, textColor] =
    timesToRepeat === note.dbSave.length
      ? ["#ff5e5e", "black"]
      : ["#33ff96", "black"];
  for (let i = 0, n = timesToRepeat; i < n; i++) {
    const pageDiff = document.createElement("div");
    const h2 = document.createElement("h2");
    h2.innerText = `Page ${i + 1}`;
    h2.addEventListener("click", function () {
      this.scrollIntoView();
    });
    h2.addEventListener("contextmenu", (e) => {
      contextMenu(e, [
        {
          text: `Go to Page ${i + 1}`,
          click: () => {
            jumpToDesiredPage(i);
            closePopupWindow();
            delContextMenu();
          },
          appearance: "ios",
        },
      ]);
    });
    pageDiff.appendChild(h2);
    pageDiff.classList.add("pageDiff");
    try {
      pageDiff.appendChild(getDiff(note.dbSave[i], note.content[i]));
    } catch (err) {
      const fragment = document.createDocumentFragment();
      const span = document.createElement("span");
      span.style.background = bgColor;
      span.style.color = textColor;
      span.appendChild(document.createTextNode(missingPage[i]));
      fragment.appendChild(span);
      pageDiff.appendChild(fragment);
    }
    bookDiffContent.appendChild(pageDiff);
  }
}
