import { createPopupWindow, closePopupWindow } from "./popup";
import { contextMenu, delContextMenu } from "../context_menu";
import { note } from "../note_utils";
import { jumpToDesiredPage } from "../dom_formatting";
import { appendText } from "../dom_utils";

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

function showBookDiffPopup(content = note.content, dbSave = note.dbSave) {
  const bookDiffContent = createPopupWindow();
  const timesToRepeat = Math.max(dbSave.length, content.length);
  const missingPage = timesToRepeat === dbSave.length ? dbSave : content;
  const [bgColor, textColor] =
    timesToRepeat === dbSave.length
      ? ["#ff5e5e", "black"]
      : ["#33ff96", "black"];
  for (let i = 0, n = timesToRepeat; i < n; i++) {
    const pageDiff = document.createElement("div");
    const h2 = document.createElement("h2");
    h2.innerHTML = `Page ${i + 1}`;
    if (i === 0) {
      appendText(
        h2,
        "Your notebook <span style = 'background: #33ff96; color: black;'>&nbsp;includes&nbsp;</span> or <span style = 'background: #ff5e5e; color: black;'>&nbsp;excludes&nbsp;</span>",
        0.6
      );
    }
    h2.addEventListener("click", h2.scrollIntoView);
    h2.addEventListener("contextmenu", (e) => {
      contextMenu(e, [
        {
          text: `Go to Page ${i + 1}`,
          click: () => {
            jumpToDesiredPage(i);
            closePopupWindow();
            delContextMenu();
          },
        },
      ]);
    });
    pageDiff.appendChild(h2);
    pageDiff.classList.add("pageDiff");
    try {
      pageDiff.appendChild(getDiff(dbSave[i], content[i]));
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
