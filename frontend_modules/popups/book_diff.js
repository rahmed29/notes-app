import { createPopupWindow, closePopupWindow } from "./popup";
import { contextMenu, delContextMenu } from "../context_menu";
import { jumpToDesiredPage } from "../dom_formatting";
import { appendText } from "../dom_utils";
import { note } from "../data/note";

export { showBookDiffPopup };

function getDiff(dbSave, content) {
  let span = null;
  const diff = window.Diff.diffChars(dbSave, content);
  const fragment = document.createDocumentFragment();

  function createSpan(value, bgColor, textColor, allowHTML) {
    span = document.createElement("span");
    span.style.background = bgColor;
    span.style.color = textColor;
    if (allowHTML) {
      span.innerHTML = value;
    } else {
      span.innerText = value;
    }
    return span;
  }

  if (!dbSave && !content) {
    fragment.appendChild(
      createSpan("<i><b>Empty Page</b></i>", "rgba(0,0,0,0)", "", true),
    );
    return fragment;
  }

  diff.forEach((part) => {
    const [bgColor, textColor] = part.added
      ? ["#33ff96", "black"]
      : part.removed
        ? ["#ff5e5e", "black"]
        : ["rgba(0,0,0,0)", ""];
    fragment.appendChild(createSpan(part.value, bgColor, textColor));
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
    const pageDiff = document.createElement("pre");
    const h2 = document.createElement("h2");
    h2.innerHTML = `Page ${i + 1}`;
    if (i === 0) {
      appendText(
        h2,
        "Local notebook <span style = 'background: #33ff96; color: black;'>&nbsp;includes&nbsp;</span> or <span style = 'background: #ff5e5e; color: black;'>&nbsp;excludes&nbsp;</span>",
        0.6,
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
      console.log(err);
      const fragment = document.createDocumentFragment();
      const span = document.createElement("span");
      span.style.background = bgColor;
      span.style.color = textColor;
      if (missingPage[i]) {
        span.innerText = missingPage[i];
      } else {
        span.innerHTML = "<i><b>Empty Page</b></i>";
      }
      fragment.appendChild(span);
      pageDiff.appendChild(fragment);
    }
    bookDiffContent.appendChild(pageDiff);
  }
}
