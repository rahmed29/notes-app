import { createPopupWindow } from "./popup";
import { contextMenu, delContextMenu } from "./context_menu";
import { mainContainer } from "../main";
import { note } from "./note_utils";
import { jumpToDesiredPage } from "./dom_formatting";

export { showBookDiffPopup };

// book diff popup
function getDiff(one, other) {
  let span = null;

  const diff = Diff.diffChars(one, other);
  const fragment = document.createDocumentFragment();

  diff.forEach((part) => {
    const color = part.added
      ? ["#33ff96", "black"]
      : part.removed
      ? ["#ff5e5e", "black"]
      : ["rgba(0,0,0,0)", ""];
    span = document.createElement("span");
    span.style.background = color[0];
    span.style.color = color[1];
    span.appendChild(document.createTextNode(part.value));
    fragment.appendChild(span);
  });
  return fragment;
}

function showBookDiffPopup() {
  const { bookDiffPopup, bookDiffContent } = createPopupWindow();
  const timesToRepeat =
    note.dbSave.length > note.content.length
      ? note.dbSave.length
      : note.content.length;
  const missingPage =
    timesToRepeat === note.dbSave.length ? note.dbSave : note.content;
  const colorIndicator =
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
      contextMenu(
        e,
        [
          {
            text: `Go to Page ${i + 1}`,
            click: () => {
              jumpToDesiredPage(i);
              closePopupWindow();
              delContextMenu();
            },
            appearance: "ios",
          },
        ],
        [`${e.clientX}px`, `${e.clientY}px`]
      );
    });
    pageDiff.appendChild(h2);
    pageDiff.classList.add("pageDiff");
    try {
      pageDiff.appendChild(getDiff(note.dbSave[i], note.content[i]));
    } catch (err) {
      const fragment = document.createDocumentFragment();
      const span = document.createElement("span");
      span.style.background = colorIndicator[0];
      span.style.color = colorIndicator[1];
      span.appendChild(document.createTextNode(missingPage[i]));
      fragment.appendChild(span);
      pageDiff.appendChild(fragment);
    }
    bookDiffContent.appendChild(pageDiff);
  }
  mainContainer.after(bookDiffPopup);
}
