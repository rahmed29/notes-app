import {
  addDropped,
  imageList,
  listInMemory,
  removeDropped,
  updateList,
} from "./list_utils";
import { accents, syncStatus, jumpToDesiredPage } from "./dom_formatting";
import { savedWS, closeTab, makeTabInDom, silentReset } from "./tabs";
import { decryptMsg, encryptMsg, checkKey } from "./encryption";
import { filterFlashcards, renameFlashcards } from "./popups/flashcards";
import validNoteName from "../shared_modules/validNoteName";
import { allowSingleRedo, youDeleted } from "./palettes/notif_palette";
import { editor } from "./important_stuff/editor";

export {
  library,
  note,
  setCurrNote,
  getAnyBookContent,
  reserved,
  editReserved,
  switchNote,
  getWrittenPages,
  forceUpdateNotes,
  deletePage,
  saveNoteBookToDb,
  deleteNoteBookFromDb,
  renameNote,
};

// debounce when switching notes
let switching = false;

// note stuff
let library = new Map();
let note = null;

// notebook names that aren't allowed because they are being used for other stuff
const reservedNames = [
  {
    data: {
      name: "home",
      content: [],
      children: [],
      parents: [],
      saved: false,
      isEncrypted: false,
      beforeOpen: [
        () => {
          // update the home page to show accurate information
          editReserved("home", [
            `# 🏠 Welcome Home!\n\nUse the __side menu__, the __toolbar__, the __note map__ or the __command palette__ *(Ctrl + Space)* to open a new/existing notebook!\n\n__Recent Notes__\n\n${JSON.parse(
              // get the recent notes from local storage and reduce them to a single markdown list
              localStorage.getItem("/recents") || "[]"
            ).reduce((str, e) => {
              str += `- :ref[${e}]\n`;
              return str;
            }, "")}`,
          ]);
        },
      ],
    },
  },
  {
    data: {
      name: "todo__list",
      content: [
        "This notebook is reserved for storing your calendar events. Sorry!",
      ],
      children: [],
      parents: [],
      saved: false,
      isEncrypted: false,
    },
  },
  {
    data: {
      name: "sticky__notes",
      content: [
        "This notebook is reserved for storing your sticky note. Sorry!",
      ],
      children: [],
      parents: [],
      saved: false,
      isEncrypted: false,
    },
  },
  {
    data: {
      name: "flash__cards",
      content: [
        "This notebook is reserved for storing your flahscards. Sorry!",
      ],
      children: [],
      parents: [],
      saved: false,
      isEncrypted: false,
    },
  },
  {
    data: {
      name: "AI-Summary",
      content: ["🤖 This notebook name is reserved for AI Summaries. Sorry!"],
      children: [],
      parents: [],
      saved: false,
      isEncrypted: false,
    },
  },
  {
    data: {
      name: "Your-Uploads",
      content: [
        "This notebook name is reserved for previewing uploaded images. Sorry!",
      ],
      children: [],
      parents: [],
      saved: false,
      isEncrypted: false,
      beforeOpen: [
        () => {
          // update the list of images in the image preview notebook
          editReserved(
            "Your-Uploads",
            imageList.map((url) => {
              // get the occurrences of the image in local storage and reduce them to a single markdown list
              const occ = Object.entries(localStorage).reduce(
                (str, [key, value]) => {
                  if (key.slice(0, 1) !== "/") {
                    JSON.parse(value).map((page, i) => {
                      if (page.includes(`/uploads/${url}`)) {
                        str += `- :ref[${key}:${i + 1}]\n`;
                      }
                    });
                  }
                  return str;
                },
                "**Occurrences in local storage:**\n"
              );
              return `![User Uploaded Image](/uploads/${url})\n\n${occ}`;
            })
          );
        },
      ],
    },
  },
  {
    data: {
      name: "Note-Map",
      content: ["# Note-Map\n\n:fdg[]"],
      children: [],
      parents: [],
      saved: false,
      isEncrypted: false,
    },
  },
];

function editReserved(name, content) {
  reservedNames.find((e) => e.data.name === name).data.content = content;
  const possibleBook = library.get(name);
  if (possibleBook) {
    possibleBook.content = content;
    possibleBook.aceSessions = [];
  }
}

function reserved(name) {
  return reservedNames.some((e) => e.data.name === name);
}

function setCurrNote(input) {
  note = input;
}

window.getAnyBookContent = getAnyBookContent;
// Returns desired info of any given book. If possible, takes it from memory
async function getAnyBookContent(bookName, desiredInfo) {
  if (reserved(bookName)) {
    if (desiredInfo === "_data") {
      return reservedNames.find((e) => e.data.name === bookName)["data"];
    }
    return reservedNames.find((e) => e.data.name === bookName)["data"][
      desiredInfo
    ];
  }
  if (library.get(bookName)) {
    const cBook = library.get(bookName);
    const cachedData = {
      data: cBook,
    };
    if (desiredInfo === "_data") {
      return cachedData["data"];
    }
    return cachedData["data"][desiredInfo];
  } else if (
    listInMemory &&
    (desiredInfo === "parents" || desiredInfo === "children")
  ) {
    const objectInList = listInMemory.find((e) => e.name === bookName);
    if (objectInList) {
      return objectInList[desiredInfo];
    }
  }
  const response = await fetch(`/api/get/notebooks/${bookName}`);
  if (response.ok) {
    let json = await response.json();
    if (desiredInfo === "_data") {
      return json["data"];
    }
    return json["data"][desiredInfo];
  } else if (response.status === 404) {
    return null;
  } else {
    notyf.error(`There was an error retrieving notebook: ${bookName}`);
    return null;
  }
}

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
window.switchNoteWrapper = (name) => switchNote(name);
async function switchNote(noteName, page, refresher = false) {
  // if we're already switching, return
  if (switching) {
    return;
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
  if (note && note.name === noteName && page != null) {
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
    if (page != null) {
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
    savedWS.add(noteName);
    localStorage.setItem("/workspace", JSON.stringify(Array.from(savedWS)));
    if (note.isEncrypted) {
      document.body.classList.add("isEncrypted");
    } else {
      document.body.classList.remove("isEncrypted");
    }
    return;
  }

  // none of the above, we need to fetch the note and build the note object
  switching = true;
  if (page == null) {
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
    if (data.isEncrypted && data.password == null) {
      data.password = prompt(`Enter your password for notebook: ${noteName}`);
      if (data.password == null) {
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
  const content = note.isEncrypted
    ? data.content
    : JSON.parse(localStorage.getItem(noteName)) || data.content;
  // remove empty pages
  note.content = getWrittenPages(content);
  note.pgN = page < note.content.length ? page : note.content.length - 1;
  note.password = note.isEncrypted ? data.password : null;
  note.dbSave = data.dbSave || [...data.content];
  note.children = data.children;
  note.parents = data.parents;
  note.date = data.date;
  note.beforeOpen = data.beforeOpen || null;
  if (data.saved == null || data.saved) {
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
  savedWS.add(noteName);
  localStorage.setItem("/workspace", JSON.stringify(Array.from(savedWS)));
  switching = false;
}

// a small wrapper function that filters an array with the given logic (or compares to an empty string by default), but won't return an empty array
function getWrittenPages(arr, logic = (str) => str !== "", defaultValue = "") {
  const response = arr.filter((e) => logic(e));
  if (!response.length) {
    response.push(defaultValue);
  }
  return response;
}

async function forceUpdateNotes(noteName = note.name) {
  // temp
  localStorage.removeItem(noteName);
  await silentReset(noteName, true);
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
    accents();
    // defineCmd();
    allowSingleRedo(note.name, undoState);
  }
}

async function saveNoteBookToDb(noteName, autoSave = false) {
  if (!validNoteName.test(noteName) || reserved(noteName)) {
    notyf.error("Something went wrong");
    return;
  }
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
      localStorage.setItem(desiredNote.name, JSON.stringify(note.content));
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
        date: new Date().toLocaleString(),
        isEncrypted: desiredNote.isEncrypted,
      }),
    });
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
        desiredNote.date = new Date().toLocaleString();
        syncStatus();
      } else {
        desiredNote.dbSave = [...desiredNote.content];
        desiredNote.saved = true;
        desiredNote.date = new Date().toLocaleString();
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
    updateList(!autoSave);
    // defineCmd();
  }
}

async function deleteNoteBookFromDb(noteName) {
  const noteDeleteStatus = await fetch(`/api/delete/notebooks/${noteName}`, {
    method: "DELETE",
  });
  if (noteDeleteStatus.ok) {
    notyf.success("Notebook has been deleted from the database");

    if (library.get(noteName)) {
      const noteinMem = library.get(noteName);
      noteinMem.parents.forEach((parent) => {
        try {
          library.get(parent).children = library
            .get(parent)
            .children.filter((e) => e !== noteName);
        } catch (err) {
          // console.log(err);
        }
      });

      noteinMem.children.forEach((child) => {
        try {
          library.get(child).parents = library
            .get(child)
            .parents.filter((e) => e !== noteName);
        } catch (err) {
          // console.log(err);
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
  const data = await getAnyBookContent(name, "_data");
  if (data.isEncrypted) {
    notyf.error("Encrypted notebooks can't be renamed");
    return;
  }
  const response = await fetch(`/api/rename/${name}/${newName}`, {
    method: "PATCH",
  });
  if (response.ok) {
    localStorage.setItem(newName, JSON.stringify(data.content));
    localStorage.removeItem(name);
    removeDropped(name);
    addDropped(newName);
    let recentBooks = JSON.parse(localStorage.getItem("/recents") || "[]");
    recentBooks = recentBooks.map((e) => (e === name ? newName : e));
    localStorage.setItem("/recents", JSON.stringify(recentBooks));
    // if it wasn't previously in memory we have to fill in some info
    if (!data.aceSessions) {
      data.aceSessions = [];
    }
    if (!data.dbSave) {
      data.dbSave = [...data.content];
    }
    if (data.saved == null) {
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
