import { switchNote, library, note, setCurrNote } from "./note_utils";
import tippy from "tippy.js";
import { list, tabs } from "./important_stuff/dom_refs";
import { showList, hideList } from "./list_utils";
import { delContextMenu } from "./context_menu";
import { eid } from "./dom_utils";
import { allowSingleRedo } from "./palettes/notif_palette";

export {
  savedWS,
  makeTabInDom,
  switchTab,
  createWorkspace,
  closeTab,
  editTabText,
  silentReset
};

const savedWS = new Set(JSON.parse(localStorage.getItem("/workspace"))) || [];
window.savedWS = savedWS
const tabMap = new Map();

// Things you can do with tabs
// 1. Close the tab
// 2. Close the tab and then immediately reopen it (refresh)
// 3. Close the tab and then immediately switch to a different notebook
// 4. Silently delete the notebook from memory without closing the tab (unless it is the currently open notebook, then it will refresh the tab)
// 5. switchAsFallBack can be used If the tab fails to close, it will switch to the notebook that was supposed to be closed.

async function silentReset(noteName, saveState = false) {
  if (note && note.name === noteName) {
    await closeTab(noteName, {
      refresh: true,
      saveState,
    });
  } else if (library.get(noteName)) {
    // silently reset the notebook
    library.delete(noteName);
  }
}

async function closeTab(name, settings, switchAsFallBack = false) {
  try {
    await tabMap.get(name).close(settings);
  } catch (err) {
    if (switchAsFallBack) {
      switchNote(name);
    }
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

  // the close tab handles everything for closing a notebook. Unlike makeTabInDom, which is just for creating a tab in the DOM. switchNote is what is used for opening a note.
  // Close tab takes in an options object. This object allows for you to either:
  //  1. Close and them immediately reopen the tab
  //  2. Close and then immediately switch to a different notebook
  // The big reason for this is so when you create a child, copy, or rename a notebook, it will deal with notebooks in memory that have the same name but were not saved. It will close the unsaved notebook and open the newly saved one, even if
  // the unsaved notebook was the one that was currently open.
  async close({ refresh = false, goto = null, page = null, saveState = false } = {}) {
    // these must stay up here so that we properly switch tabs after closing one
    savedWS.delete(this.name);
    localStorage.setItem("/workspace", JSON.stringify(Array.from(savedWS)));
    tabMap.delete(this.name);
    //
    
    const book = library.get(this.name);
    const pg = book ? book.pgN : 0;
    let undoState = book
      ? {
          content: [...book.content],
          aceSessions: [...book.aceSessions],
        }
      : null;
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
      // set the note to null so the switchNote function switches back to the current note.
      // if we didn't do this, the switchNote would immediately return (on a refresh with no goto) because at this point the note is technically open.
      setCurrNote(null);
      await switchNote(goto ? goto : this.name, page !== null ? page : pg, refresh);
      if (undoState && saveState) {
        // since refreshing a tab is almost always associated with a large change in notebook data, we also save the undo state.
        allowSingleRedo(this.name, undoState);
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
function makeTabInDom(txt, shouldOpen) {
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

  const div = document.createElement("button");
  div.tabIndex = 0;
  const tabName = document.createElement("span");
  tabName.classList.add("tabName");
  tabName.innerText = txt;
  div.appendChild(tabName);

  const exitButton = document.createElement("button");
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
  Array.from(savedWS).forEach((noteName) => makeTabInDom(noteName));
  list.style.width = localStorage.getItem("/listSize") || "350px";
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
