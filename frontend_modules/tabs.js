import { switchNote } from "./note_utils";
import tippy from "tippy.js";
import { tabs } from "./important_stuff/dom_refs";
import { delContextMenu } from "./context_menu";
import { allowSingleRedo } from "./palettes/notif_palette";
import { note } from "./data/note";
import library from "./data/library";
import { changeSettings, getSetting } from "./important_stuff/settings";

export { savedWS, makeTabInDom, switchTab, closeTab, editTabText, silentReset };

const savedWS = new Set(getSetting("workspace", []));
const tabMap = new Map();

// Things you can do with tabs and real uses
// 1. Close the tab - closing
// 2. Close the tab and then immediately reopen it (refresh) - honestly, we usually just opt for variations of this like the ones below
// 3. Close the tab and then immediately switch to a different notebook - opening notebook when only the home tab is open
// 4. Silently delete the notebook from memory without closing the tab (unless it is the currently open notebook, then it will close the tab according to your settings) - updating Your-Uploads when a new image is uploaded
// 5. switchAsFallBack can be used If the tab fails to close, it will switch to the notebook that was supposed to be closed. - renaming, creating child (close possible notebook with the new name but unsaved and open the newly renamed notebook)

async function silentReset(noteName, settings) {
  if (note && note.name === noteName) {
    await closeTab(noteName, settings);
  } else if (library.get(noteName)) {
    library.delete(noteName);
  }
}

async function closeTab(name, settings = { switchAsFallBack: false }) {
  if (network.isOffline) {
    return;
  }
  try {
    await tabMap.get(name).close(settings);
  } catch (err) {
    if (settings.switchAsFallBack) {
      switchNote(name);
    }
    console.log(err);
  }
}

function editTabText(name, text, perm = false) {
  try {
    tabMap.get(name).editText(text, perm);
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
    this.alteredText = false;
  }

  // the close tab handles everything for closing a notebook. Unlike makeTabInDom, which is just for creating a tab in the DOM. switchNote is what is used for opening a note.
  // The big reason for this is so when you create a child, copy, or rename a notebook, it will deal with notebooks in memory that have the same name but were not saved.
  async close(
    {
      refresh = false,
      goto = undefined,
      page = undefined,
      props = undefined,
      saveState = false,
      state = null,
    } = {
      refresh: false,
      goto: undefined,
      page: undefined,
      props: undefined,
      saveState: false,
      state: null,
    },
  ) {
    // these must stay up here so that we properly switch tabs after closing one
    savedWS.delete(this.name);
    changeSettings("workspace", Array.from(savedWS));
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
      await switchNote(goto ? goto : this.name, {
        refresher: refresh,
        page: page !== undefined ? page : pg,
        props,
        state,
      });
      if (undoState && saveState) {
        // since refreshing a tab is almost always associated with a large change in notebook data, we also save the undo state.
        allowSingleRedo(this.name, undoState);
      }
    }
  }

  editText(text, perm = false) {
    if (!this.alteredText || perm) {
      this.alteredText = perm;
      this.tabRef.firstChild.innerText = text;
      this.tippy.setContent(text);
      document.title = text;
    }
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
function makeTabInDom(name, shouldOpen = false) {
  // should open just adds the openTab class to the tab
  if (tabMap.get(name) && shouldOpen) {
    tabMap.get(name).select();
    return;
  } else if (tabMap.get(name)) {
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
  tabName.innerText = name;
  div.appendChild(tabName);

  const exitButton = document.createElement("button");
  exitButton.setAttribute("data-bookname", name);
  exitButton.classList.add("tabExit");
  exitButton.innerText = "+";
  addCloseTab(exitButton, true);
  div.appendChild(exitButton);

  div.classList.add("tab");
  div.id = `book__${name}`;
  div.setAttribute("data-bookname", name);
  addCloseTab(div, false);
  tabMap.set(
    name,
    new Tab(
      name,
      div,
      tippy([div], {
        theme: "dark",
        animation: "shift-toward-subtle",
        placement: "bottom-end",
        content: name,
        arrow: false,
      })[0],
    ),
  );

  if (shouldOpen) {
    tabMap.get(name).select();
  }
  tabs.prepend(div);
  savedWS.add(name);
  changeSettings("workspace", Array.from(savedWS));
}

// Used by the tabs themselves and other links that open notebooks
function switchTab(e) {
  // Doing this cause on mobile we only use this function on references and references must be double clicked to be opened
  // we want to stop the double click from bubbling up to the body because double clicking the body changes page
  // I don't know for sure if we need this but whatever
  // If you ever use switchTab somewhere else on mobile you might want to come up with a better solution
  if (window.isOnMobile) {
    e.stopPropagation();
  }
  if (this.hasAttribute("data-page")) {
    switchNote(this.getAttribute("data-bookname"), {
      page: parseInt(this.getAttribute("data-page")),
      props: this.getAttribute("data-props"),
    });
  } else {
    switchNote(this.getAttribute("data-bookname"), {
      props: this.getAttribute("data-props"),
    });
  }
}
