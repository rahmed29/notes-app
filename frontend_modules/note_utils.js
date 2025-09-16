import { removeDropped, renameDropped, updateList } from "./list_utils";
import { accents, syncStatus, jumpToDesiredPage } from "./dom_formatting";
import { savedWS, closeTab, makeTabInDom, silentReset } from "./tabs";
import { decryptMsg, encryptMsg, checkKey } from "./encryption";
import { filterFlashcards, renameFlashcards } from "./data/flashcard_data";
import { validNoteName } from "../shared_modules/validNoteName";
import { allowSingleRedo, youDeleted } from "./palettes/notif_palette";
import { editor } from "./important_stuff/editor";
import { reserved } from "./data/reserved_notes";
import { note, setCurrNote } from "./data/note";
import library from "./data/library";
import getAnyBookContent from "./get_book_content";
import { autosavingEnabled } from "./autosave";
import { changeSettings, getSetting } from "./important_stuff/settings";
import { arraysAreEqual, updateLtdArr } from "./data_utils";
import localforage from "localforage";
import notes_api from "./important_stuff/api";

export {
  switchNote,
  forceUpdateNotes,
  deletePage,
  saveNoteBookToDb,
  deleteNoteBookFromDb,
  renameNote,
};

let switching = false;

// the main function driving the "game loop". Handles all the switching between notes.
// refresher lets us know if we're refreshing. If we are, we shouldn't close the home tab like we usually do when it's the only tab open
async function switchNote(
  noteName,
  { page = undefined, refresher = false, props = "", state = null } = {
    page: undefined,
    refresher: false,
    props: "",
    state: null,
  },
) {
  // if we're already switching, return
  if (switching) {
    return;
  }
  // make sure page is a number
  if (typeof page !== "number" && !isNaN(parseInt(page))) {
    page = parseInt(page);
  } else if (typeof page !== "number") {
    page = undefined;
  }
  // make sure props is an array
  // Props will get passed to the beforeOpens and afterOpens functions, as well as accents
  if (props && !Array.isArray(props)) {
    props = [props];
  } else if (!props) {
    props = [];
  }
  // This is when refreshing a tab. It stops the switch note function from doing nothing because of switching to the same note.
  // Basically just set it to null so it internally it is switching from something, when visually it's not.
  // Read more about refreshing notes in the tabs.js file.
  if (refresher) {
    setCurrNote(null);
  }
  // if nothing needs to change, return
  if (note && noteName === note.name && page === note.pgN) {
    return;
  }
  // if note name is invalid, go home
  if (!validNoteName.test(noteName)) {
    notyf.error("Invalid note name");
    if (!note) {
      switchNote("home");
    }
    return;
  }
  // if we just want to change the page, we can do that
  if (note && note.name === noteName && page !== undefined) {
    jumpToDesiredPage(page);
    return;
  }
  // if only the home tab is open, close it and then open the desired note (unless we are refreshing)
  if (
    savedWS.size === 1 &&
    savedWS.has("home") &&
    noteName !== "home" &&
    !refresher
  ) {
    closeTab("home", {
      refresh: true,
      goto: noteName,
      page,
      props: props,
    });
    return;
  }
  // If network is offline, do nothing
  if (network.isOffline) {
    return;
  }
  // None of the above, begin switching
  switching = true;
  let data = undefined;
  // Get note from library if possible
  data = (await getAnyBookContent(noteName, "_data")) || {
    name: noteName,
    content: [""],
    children: [],
    parents: [],
    saved: false,
    isEncrypted: false,
    isPublic: false,
  };
  // Fix beforeOpens to be arrays
  if (
    data.reservedData &&
    data.reservedData.beforeOpen &&
    !Array.isArray(data.reservedData.beforeOpen)
  ) {
    data.reservedData.beforeOpen = [data.reservedData.beforeOpen];
  }
  if (
    data.reservedData &&
    data.reservedData.afterOpen &&
    !Array.isArray(data.reservedData.afterOpen)
  ) {
    data.reservedData.afterOpen = [data.reservedData.afterOpen];
  }
  // Decrypt notebook if encrypted
  try {
    if (data.isEncrypted && data.password === undefined) {
      data.password =
        prompt(`Enter your password for notebook: ${noteName}`) || undefined;
      // user closed prompt or entered nothing.
      if (data.password == undefined) {
        switching = false;
        switchNote("home");
        return;
      }
      if (checkKey(data.content[0], data.password)) {
        data.content = data.content.map((cipher) =>
          decryptMsg(cipher, data.password),
        );
        document.body.classList.add("isEncrypted");
      } else {
        notyf.error("Incorrect Password");
        switching = false;
        switchNote("home");
        return;
      }
    } else if (data.isEncrypted) {
      // data.content = data.content.map((cipher) => decryptMsg(cipher, data.password))
      document.body.classList.add("isEncrypted");
    } else {
      document.body.classList.remove("isEncrypted");
    }
  } catch (err) {
    switching = false;
    switchNote("home");
    notyf.error("Something went wrong. Try again in a second");
    return;
  }
  // Execute beforeOpens
  if (data.reservedData && data.reservedData.beforeOpen) {
    for (const func of data.reservedData.beforeOpen) {
      func(...props);
    }
  }
  if (!reserved(noteName)) {
    changeSettings(
      "recents",
      updateLtdArr(getSetting("recents", []), noteName),
    );
  }
  // Start building the note object
  setCurrNote({});
  note.name = noteName.replaceAll("/", "");
  note.isEncrypted = data.isEncrypted || false;
  // if the local data is newer than the data from the database, use the local data
  if (data.saved === undefined || data.saved) {
    // whether the note is saved to the database
    note.saved = true;
  } else {
    note.saved = false;
  }
  let localData = await localforage.getItem(noteName);
  let content;
  // If local data is newer, use it, else use the data from the database and make local data eligible for restoration
  if (note.isEncrypted) {
    content = data.content;
  } else if (!note.isEncrypted && localData && note.saved) {
    if (localData.timestamp > data.date) {
      content = localData.content;
    } else {
      content = data.content;
      if (!arraysAreEqual(localData.content, data.content)) {
        const undoState = {
          content: [...localData.content],
          aceSessions: [],
        };
        allowSingleRedo(noteName, undoState);
      }
    }
  } else if (localData) {
    content = localData.content;
  } else {
    content = data.content;
  }
  // Fix page if needed
  if (page === undefined && data.pgN !== undefined) {
    page = data.pgN;
  } else if (page !== undefined && (page >= content.length || page < 0)) {
    page = data.content.length - 1;
  } else if (page === undefined) {
    page = 0;
  }
  // Set attrs
  note.content = content;
  note.aceSessions = data.aceSessions || [];
  // if a custom state was supplied (restoring notebook) use that instead.

  note.pgN = page;
  note.password = note.isEncrypted ? data.password : undefined;
  note.dbSave = data.dbSave || [...data.content];
  note.date = data.date;
  note.reservedData = data.reservedData || null;
  // note.beforeOpen = data.beforeOpen || null;
  // note.afterOpen = data.afterOpen || null;
  note.isPublic = data.isPublic || false;
  if (state) {
    for (const [key, value] of Object.entries(state)) {
      note[key] = value;
    }
  }
  // Setup stuff in DOM
  makeTabInDom(note.name, true);
  if (reserved(note.name)) {
    document.getElementById("newPage").style.display = "none";
    toolBar.classList.add("homeToolBar");
    if (note.reservedData && note.reservedData.reservedButPageNavAllowed) {
      toolBar.classList.remove("pageNavDisabled");
    } else {
      toolBar.classList.add("pageNavDisabled");
    }
    note.readOnly = true;
    editor.setReadOnly(true);
  } else {
    document.getElementById("newPage").style.display = "inline";
    toolBar.classList.remove("pageNavDisabled");
    toolBar.classList.remove("homeToolBar");
    note.readOnly = false;
    editor.setReadOnly(false);
  }
  // Add note to library
  library.set(note.name, note);
  // accents makes the UI reflect the note
  // Keep this here because our afterOpens could call accents themselves and we want to make sure the UI is up to date
  accents(...props);
  // Execute afterOpens
  if (data.reservedData && data.reservedData.afterOpen) {
    for (const func of data.reservedData.afterOpen) {
      func(...props);
    }
  }
  switching = false;
}

async function forceUpdateNotes(noteName = note.name) {
  // temp
  const inMem = library.get(noteName);
  if (inMem && inMem.isEncrypted) {
    return;
  }
  await localforage.removeItem(noteName);
  await silentReset(noteName, {
    refresh: true,
    saveState: true,
  });
  notyf.success(`Local data for ${noteName} has been deleted`);
}

function deletePage(pgN = note.pgN) {
  if (reserved(note.name)) {
    return;
  }
  if (note.content.length > 1) {
    if (!note.isEncrypted) {
      const pageTemp = note.content[pgN];
      const undoState = {
        content: [...note.content],
        aceSessions: [...note.aceSessions],
      };
      if (pageTemp) {
        allowSingleRedo(note.name, undoState);
      }
    }
    note.aceSessions.splice(pgN, 1);
    note.content.splice(pgN, 1);
    let newPage;
    if (pgN === note.content.length) {
      newPage = pgN - 1;
    } else if (pgN === 0) {
      newPage = 0;
    } else {
      newPage = pgN;
    }
    note.pgN = newPage;
    accents();
  } else {
    editor.setValue("");
    accents();
  }
  if (autosavingEnabled) {
    saveNoteBookToDb(note.name, true);
  }
}

async function saveNoteBookToDb(noteName, autoSave = false) {
  if (network.isOffline) {
    return;
  }
  if (!validNoteName.test(noteName) || reserved(noteName)) {
    notyf.error("Something went wrong");
    return;
  }
  const timestamp = Date.now();
  const desiredNote = library.get(noteName);
  if (desiredNote) {
    const undoState = {
      content: [...desiredNote.content],
      aceSessions: [...desiredNote.aceSessions],
    };
    function prepareForSave(obj) {
      const newContent = [];
      const newSessions = [];
      for (let i = 0; i < obj.content.length; i++) {
        if (obj.content[i]) {
          newContent.push(obj.content[i]);
          newSessions.push(obj.aceSessions[i]);
        }
      }

      if (!newContent.length) {
        newContent.push("");
      }

      obj.content = newContent;
      obj.aceSessions = newSessions;
    }

    if (!autoSave) {
      prepareForSave(desiredNote);
    }

    if (!desiredNote.isEncrypted) {
      await localforage.setItem(desiredNote.name, {
        content: note.content,
        timestamp,
      });
    }

    const saveStatus = await notes_api.put.saveNotebooks(desiredNote.name, {
      content: !desiredNote.isEncrypted
        ? desiredNote.content
        : desiredNote.content.map((page) =>
            encryptMsg(page, desiredNote.password),
          ),
      isEncrypted: desiredNote.isEncrypted,
      timestamp,
    });
    const wasSaved = note.saved;
    if (saveStatus.ok) {
      if (desiredNote.name === note.name) {
        if (!autoSave) {
          areNotesSavedIcon.classList.add("saved");
          if (desiredNote.pgN > desiredNote.content.length - 1) {
            jumpToDesiredPage(desiredNote.content.length - 1);
          } else {
            accents(false);
          }
        }
        desiredNote.dbSave = [...desiredNote.content];
        desiredNote.saved = true;
        desiredNote.date = timestamp;
        syncStatus();
      } else {
        desiredNote.dbSave = [...desiredNote.content];
        desiredNote.saved = true;
        desiredNote.date = timestamp;
      }
      if (!autoSave) {
        notyf.success("Notebook was saved");
      }
      if (
        !desiredNote.isEncrypted &&
        undoState.content.length !== desiredNote.content.length
      ) {
        allowSingleRedo(noteName, undoState);
      }
    } else {
      notyf.error("An error occurred when saving a notebook");
    }
    updateList(!wasSaved);
  }
}

async function deleteNoteBookFromDb(noteName) {
  if (network.isOffline) {
    return;
  }
  const noteDelete = await notes_api.del.notebooks(noteName);
  if (noteDelete.ok) {
    notyf.success("Notebook has been deleted from the database");
    closeTab(noteName);
    filterFlashcards(noteName);
    removeDropped(noteName);
    updateList();
    youDeleted(noteName);
  } else if (noteDelete.status === 404) {
    notyf.error("This notebook is not saved to the database");
  } else {
    notyf.error("An error occurred when deleting a notebook");
  }
}

async function renameNote(name, newName) {
  if (network.isOffline) {
    return;
  }
  const data = await getAnyBookContent(name, "_data");
  if (!data) {
    notyf.error("Notebook not found");
    return;
  }
  if (data.isEncrypted) {
    notyf.error("Encrypted notebooks can't be renamed");
    return;
  }
  const response = await notes_api.patch.rename(name, newName);
  if (response.ok) {
    await localforage.setItem(newName, {
      content: data.content,
      timestamp: Date.now(),
    });
    await localforage.removeItem(name);
    renameDropped(name, newName);
    let recentBooks = getSetting("recents", []);
    recentBooks = recentBooks.map((e) => (e === name ? newName : e));
    changeSettings("recents", recentBooks);
    if (!data.aceSessions) {
      data.aceSessions = [];
    }
    if (!data.dbSave) {
      data.dbSave = [...data.content];
    }
    if (data.saved === undefined) {
      data.saved = true;
    }

    renameFlashcards(name, newName);
    await closeTab(name, {
      refresh: true,
      goto: newName,
      state: {
        name: newName,
        content: [...data.content],
        aceSessions: [...data.aceSessions],
        dbSave: [...data.dbSave],
        saved: data.saved,
        isEncrypted: data.isEncrypted,
        date: data.date,
      },
    });
    updateList();
  } else {
    const error = await response.json();
    notyf.error(error.error || "An error occurred");
  }
}
