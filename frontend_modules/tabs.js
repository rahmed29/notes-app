import { savedWS, switchNote, library, note } from "./note_utils";
import tippy from "tippy.js";
import { list } from "../main";
import { showList, hideList } from "./list_utils";
import { delContextMenu } from "./context_menu";

export { createTab, switchTab, createWorkspace, closeTab };

let tabTippys = new Map();

function closeTab(e) {
  delContextMenu();
  const compare = this.className.includes("tabExit") ? 1 : e.button;
  if (compare === 1) {
    e.stopPropagation();
    e.preventDefault();
    const temp = this.getAttribute("data-bookname");
    library.delete(temp);
    tabTippys.get(temp).destroy();
    tabTippys.delete(temp);
    savedWS.delete(temp);
    localStorage.setItem("/workspace", JSON.stringify(Array.from(savedWS)));
    this.removeEventListener("click", switchTab);
    this.removeEventListener("mouseup", closeTab);
    if (this.className.includes("tabExit")) {
      this.parentElement.remove();
    } else {
      this.remove();
    }
    if (!savedWS.size) {
      switchNote("home");
    } else if (note && temp === note.name) {
      switchNote(Array.from(savedWS)[Array.from(savedWS).length - 1]);
    }
  }
}

// create a tab element
function createTab(txt, shouldOpen) {
  function addCloseTab(ele, isExitButton) {
    if (isExitButton) {
      ele.addEventListener("click", closeTab);
    } else {
      ele.addEventListener("click", switchTab);
      ele.addEventListener("mouseup", closeTab);
    }
  }

  const div = document.createElement("div");
  const tabName = document.createElement("span");
  tabName.classList.add("tabName");
  tabName.innerText = txt;
  div.appendChild(tabName);

  const exitButton = document.createElement("span");
  exitButton.setAttribute("data-bookname", txt);
  exitButton.classList.add("tabExit");
  exitButton.innerText = "+";
  addCloseTab(exitButton, true);
  div.appendChild(exitButton);

  div.classList.add("tab");
  if (shouldOpen) {
    div.classList.add("openTab");
  }
  div.id = `book__${txt}`;
  div.setAttribute("data-bookname", txt);
  addCloseTab(div, false);
  tabTippys.set(
    txt,
    tippy([div], {
      theme: "dark",
      animation: "shift-toward-subtle",
      placement: "bottom-end",
      content: txt,
      arrow: false,
    })[0]
  );
  tabs.prepend(div);
}

// loading workspace from last session
function createWorkspace() {
  Array.from(savedWS).forEach((noteName) => createTab(noteName));
  list.style.width = `${parseInt(localStorage.getItem("/listSize") || 300)}px`;
  if (localStorage.getItem("/listShown") === "false") {
    hideList();
  } else {
    showList();
  }
}

// for tabs
function switchTab() {
  if (
    this.className.includes("reference") &&
    document.getElementById("fcAlert")
  ) {
    return;
  }
  if (this.hasAttribute("data-page")) {
    switchNote(
      this.getAttribute("data-bookname"),
      parseInt(this.getAttribute("data-page"))
    );
  } else {
    switchNote(this.getAttribute("data-bookname"));
  }
}
