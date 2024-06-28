import { switchNote, library, note, setCurrNote } from "./note_utils";
import tippy from "tippy.js";
import { list, tabs } from "../main";
import { showList, hideList } from "./list_utils";
import { delContextMenu } from "./context_menu";
import { eid } from "./dom_utils";
import { allowSingleRedo } from "./palettes/notif_palette";

export {
  savedWS,
  createTab,
  switchTab,
  createWorkspace,
  closeTab,
  editTabText,
};

const savedWS = new Set(JSON.parse(localStorage.getItem("/workspace"))) || [];
const tabMap = new Map();

async function closeTab(name, refresh) {
  try {
    await tabMap.get(name).close(refresh);
  } catch (err) {
    console.log(err);
  }
}

function editTabText(name, text) {
  try {
    tabMap.get(name).editText(text);
  } catch (err) {
    console.log(err);
  }
}

function closeTabHandler(e) {
  delContextMenu();
  const compare = this.className.includes("tabExit") ? 1 : e.button;
  if (compare === 1) {
    e.stopPropagation();
    e.preventDefault();
    closeTab(this.getAttribute("data-bookname"));
  }
}

class Tab {
  constructor(name, tabRef, tippy) {
    this.name = name;
    this.tabRef = tabRef;
    this.tippy = tippy;
  }

  async close(refresh) {
    savedWS.delete(this.name);
    localStorage.setItem("/workspace", JSON.stringify(Array.from(savedWS)));
    tabMap.delete(this.name);
    const book = library.get(this.name);
    const temp = this.name;
    const pg = book ? book.pgN : 0;
    let undoState
    book ? undoState = {
        content: [...book.content],
        aceSessions: [...book.aceSessions],
      } : null
    library.delete(this.name);

    // remove DOM stuff
    this.tippy.destroy();
    this.tabRef.removeEventListener("click", switchTab);
    this.tabRef.removeEventListener("mouseup", closeTabHandler);
    this.tabRef.children[1].removeEventListener("click", closeTabHandler);
    this.tabRef.remove();

    // finish up
    if (!savedWS.size && !refresh) {
      await switchNote("home");
    } else if (note && this.name === note.name && !refresh) {
      await switchNote(Array.from(savedWS)[Array.from(savedWS).length - 1]);
    }

    // reload tab
    if (refresh) {
      setCurrNote(null);
      await switchNote(temp, pg);
      if (undoState) {
        allowSingleRedo(this.name, undoState)
      }
    }
  }

  editText(text) {
    this.tabRef.firstChild.innerText = text;
    document.title = text;
  }

  select() {
    this.tabRef.classList.add("openTab");
    tabMap.forEach((value, key) => {
      if (key != this.name) {
        value.tabRef.classList.remove("openTab");
      }
    });
  }
}

// create a tab element
function createTab(txt, shouldOpen) {
  if (tabMap.get(txt)) {
    tabMap.get(txt).select();
    return;
  }

  function addCloseTab(ele, isExitButton) {
    if (isExitButton) {
      ele.addEventListener("click", closeTabHandler);
    } else {
      ele.addEventListener("click", switchTab);
      ele.addEventListener("mouseup", closeTabHandler);
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
  tabMap.set(
    txt,
    new Tab(
      txt,
      div,
      tippy([div], {
        theme: "dark",
        animation: "shift-toward-subtle",
        placement: "bottom-end",
        content: txt,
        arrow: false,
      })[0]
    )
  );

  if (shouldOpen) {
    tabMap.get(txt).select();
  }
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

function switchTab() {
  if (this.className.includes("reference") && eid("fcAlert")) {
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
