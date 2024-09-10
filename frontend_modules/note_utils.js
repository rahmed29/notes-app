import { renameDropped, updateList } from "./list_utils";
import {
  accents,
  syncStatus,
  jumpToDesiredPage,
  updateAndSaveNotesLocally,
} from "./dom_formatting";
import { savedWS, closeTab, makeTabInDom, silentReset } from "./tabs";
import { decryptMsg, encryptMsg, checkKey } from "./encryption";
import { filterFlashcards, renameFlashcards } from "./data/flashcard_data";
import validNoteName from "../shared_modules/validNoteName";
import { allowSingleRedo, youDeleted } from "./palettes/notif_palette";
import { editor } from "./important_stuff/editor";
import { reserved } from "./data/reserved_notes";
import { note, setCurrNote } from "./data/note";
import { library } from "./data/library";
import { getWrittenPages } from "./data_utils";
import { getAnyBookContent } from "./get_book_content";
import { autosavingEnabled } from "./autosave";

export {
  switchNote,
  forceUpdateNotes,
  deletePage,
  saveNoteBookToDb,
  deleteNoteBookFromDb,
  renameNote,
};

// debounce when switching notes
let switching = false;

function updateRecentBooks(noteName) {
  if (!reserved(noteName)) {
    let recentBooks = JSON.parse(localStorage.getItem("/recents") || "[]");
    recentBooks = recentBooks.filter((e) => e !== noteName);
    recentBooks.unshift(noteName);
    if (recentBooks.length > 10) {
      recentBooks.pop();
    }
    localStorage.setItem("/recents", JSON.stringify(recentBooks));
  }
}

// the main function driving the "game loop". Handles all the switching between notes.
// refresher lets us know if we're refreshing. If we are, we shouldn't close the home tab like we usually do when it's the only tab open
async function switchNote(noteName, page, refresher = false) {
  // if we're already switching, return
  if (switching) {
    return;
  }
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
    });
    return;
  }
  // if the notebook is in the library we don't need to rebuild the note object
  if (library.get(noteName)) {
    setCurrNote(library.get(noteName));
    if (note.beforeOpen) {
      for (const func of note.beforeOpen) {
        func();
      }
    }
    if (page !== undefined) {
      note.pgN = page;
    }
    updateRecentBooks(noteName);
    makeTabInDom(note.name, true);
    if (reserved(note.name)) {
      toolBar.classList.add("homeToolBar");
      note.readOnly = true;
      editor.setReadOnly(true);
    } else {
      toolBar.classList.remove("homeToolBar");
      note.readOnly = false;
      editor.setReadOnly(false);
    }
    accents();
    if (note.isEncrypted) {
      document.body.classList.add("isEncrypted");
    } else {
      document.body.classList.remove("isEncrypted");
    }
    return;
  }
  if (network.isOffline) {
    return;
  }
  // none of the above, we need to fetch the note and build the note object
  switching = true;
  if (page === undefined) {
    page = 0;
  }
  updateRecentBooks(noteName);
  const data = (await getAnyBookContent(noteName, "_data")) || {
    name: noteName,
    content: [""],
    children: [],
    parents: [],
    saved: false,
    isEncrypted: false,
  };
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
        data.content = data.content.map(
          (cipher) => JSON.parse(decryptMsg(cipher, data.password)).msg
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
  if (data.beforeOpen) {
    for (const func of data.beforeOpen) {
      func();
    }
  }
  setCurrNote({});
  note.name = noteName.replaceAll("/", "");
  note.isEncrypted = data.isEncrypted;
  // if the local data is newer than the data from the database, use the local data
  let localData = JSON.parse(localStorage.getItem(noteName));
  let content;
  if (note.isEncrypted) {
    content = data.content;
  } else if (localData) {
    if (localData.timestamp > data.date) {
      content = localData.content;
    } else {
      content = data.content;
      const undoState = {
        content: [...localData.content],
        aceSessions: [],
      };
      allowSingleRedo(noteName, undoState);
    }
  } else {
    content = data.content;
  }
  // remove empty pages
  note.content = getWrittenPages(content);
  note.pgN = page < note.content.length ? page : note.content.length - 1;
  note.password = note.isEncrypted ? data.password : null;
  note.dbSave = data.dbSave || [...data.content];
  note.children = data.children;
  note.parents = data.parents;
  note.date = data.date;
  note.beforeOpen = data.beforeOpen || null;
  if (data.saved === undefined || data.saved) {
    // whether the note is saved to the database
    note.saved = true;
  } else {
    note.saved = false;
  }
  note.aceSessions = data.aceSessions || [];
  // if (!note.pgN) {
  //   note.pgN = 0;
  //   note.content = getWrittenPages(note.content);
  // }
  makeTabInDom(note.name, true);
  if (reserved(note.name)) {
    toolBar.classList.add("homeToolBar");
    note.readOnly = true;
    editor.setReadOnly(true);
  } else {
    toolBar.classList.remove("homeToolBar");
    note.readOnly = false;
    editor.setReadOnly(false);
  }
  library.set(note.name, note);
  accents();
  switching = false;
}

async function forceUpdateNotes(noteName = note.name) {
  // temp
  localStorage.removeItem(noteName);
  await silentReset(noteName, {
    refresh: true,
    saveState: true,
  });
  notyf.success(`${noteName} has been reset`);
}

function deletePage(pgN = note.pgN) {
  if (note.content.length > 1) {
    const undoState = {
      content: [...note.content],
      aceSessions: [...note.aceSessions],
    };
    note.aceSessions[pgN] = null;
    note.content.splice(pgN, 1);
    note.pgN = note.content.length - 1;
    // defineCmd();
    updateAndSaveNotesLocally();
    allowSingleRedo(note.name, undoState);
  } else {
    note.content[0] = "";
    editor.setValue("");
    updateAndSaveNotesLocally();
  }
  accents();
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
      localStorage.setItem(
        desiredNote.name,
        JSON.stringify({
          content: note.content,
          timestamp,
        })
      );
    }
    const saveStatus = await fetch(`/api/save/notebooks/${desiredNote.name}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: !desiredNote.isEncrypted
          ? desiredNote.content
          : desiredNote.content.map((page) =>
              encryptMsg(page, desiredNote.password)
            ),
        isEncrypted: desiredNote.isEncrypted,
      }),
    });
    const wasSaved = note.saved;
    if (saveStatus.ok) {
      if (desiredNote.name === note.name) {
        if (!autoSave) {
          areNotesSavedIcon.classList.add("saved");
        }
        desiredNote.dbSave = [...desiredNote.content];
        if (desiredNote.pgN > desiredNote.content.length - 1) {
          jumpToDesiredPage(desiredNote.content.length - 1);
        } else {
          accents(false);
        }
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
      if (undoState.content.length !== desiredNote.content.length) {
        allowSingleRedo(noteName, undoState);
      }
    } else {
      notyf.error("An error occurred when saving a notebook");
    }
    updateList(!wasSaved);
  }
  // defineCmd();
}

async function deleteNoteBookFromDb(noteName) {
  if (network.isOffline) {
    return;
  }
  const noteDeleteStatus = await fetch(`/api/delete/notebooks/${noteName}`, {
    method: "DELETE",
  });
  if (noteDeleteStatus.ok) {
    notyf.success("Notebook has been deleted from the database");

    const noteinMem = library.get(noteName);
    if (noteinMem) {
      noteinMem.parents.forEach((parent) => {
        const p = library.get(parent);
        if (p) {
          p.children = p.children.filter((e) => e !== noteName);
        }
      });

      noteinMem.children.forEach((child) => {
        const c = library.get(child);
        if (c) {
          c.parents = c.parents.filter((e) => e !== noteName);
        }
      });
    }

    closeTab(noteName);
    filterFlashcards(noteName);
    syncStatus();
    updateList();
    // defineCmd();
    youDeleted(noteName);
  } else {
    notyf.error("An error occurred when deleting a notebook");
  }
}

async function renameNote(name, newName) {
  if (network.isOffline) {
    return;
  }
  const data = await getAnyBookContent(name, "_data");
  if (data.isEncrypted) {
    notyf.error("Encrypted notebooks can't be renamed");
    return;
  }
  const response = await fetch(`/api/rename/${name}/${newName}`, {
    method: "PATCH",
  });
  if (response.ok) {
    const noteinMem = library.get(name);
    if (noteinMem) {
      noteinMem.parents.forEach((book) => {
        const p = library.get(book);
        if (p) {
          p.children = p.children.map((e) => (e === name ? newName : e));
        }
      });

      noteinMem.children.forEach((book) => {
        const c = library.get(book);
        if (c) {
          c.parents = c.parents.map((e) => (e === name ? newName : e));
        }
      });
    }

    localStorage.setItem(
      newName,
      JSON.stringify({
        content: data.content,
        timestamp: Date.now(),
      })
    );
    localStorage.removeItem(name);
    renameDropped(name, newName);
    let recentBooks = JSON.parse(localStorage.getItem("/recents") || "[]");
    recentBooks = recentBooks.map((e) => (e === name ? newName : e));
    localStorage.setItem("/recents", JSON.stringify(recentBooks));
    if (library.get(name)) {
      if (!data.aceSessions) {
        data.aceSessions = [];
      }
      if (!data.dbSave) {
        data.dbSave = [...data.content];
      }
      if (data.saved === undefined) {
        data.saved = true;
      }
      library.set(newName, {
        name: newName,
        content: [...data.content],
        aceSessions: [...data.aceSessions],
        dbSave: [...data.dbSave],
        children: data.children,
        parents: data.parents,
        saved: data.saved,
        isEncrypted: data.isEncrypted,
        date: data.date,
      });
    }
    renameFlashcards(name, newName);
    await closeTab(name, {
      refresh: true,
      goto: newName,
    });
    updateList();
  } else {
    notyf.error("An error occurred when renaming a notebook");
  }
}
