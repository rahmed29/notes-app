import { listInMemory, updateList } from "./list_utils";
import { closePopupWindow } from "./popup";
import { editor } from "../main";
import { accents, syncStatus, jumpToDesiredPage } from "./dom_formatting";
import { defineCmd } from "./cmd_pal";
import { createTab, switchTab, closeTab } from "./tabs";
import { decryptMsg, encryptMsg, checkKey } from "./encryption";
import { getFamily } from "./hierarchy";
import { filterFlashcards } from "./flashcards";
import validNoteName from "../validNoteName";

export {
  savedWS,
  library,
  lastNote,
  note,
  setLastNote,
  setCurrNote,
  getAnyBookContent,
  reservedNames,
  switchNote,
  getWrittenPages,
  forceUpdateNotes,
  deletePage,
  saveNoteBookToDb,
  deleteNoteBookFromDb,
  copyBook,
};

// debounce when switching notes
let switching = false;

// note stuff
const savedWS = new Set(JSON.parse(localStorage.getItem("/workspace"))) || [];
let library = new Map();
let lastNote = null;
let note = null;

// notebook names that aren't allowed because they are being used for other stuff
const reservedNames = [
  {
    data: {
      name: "home",
      content: [
        "# 👋 Welcome Home!\n\nUse the __side menu__, the __toolbar__, or the __command palette__ *(Ctrl + Space)* to open a new/existing notebook!",
      ],
      children: [],
      parents: [],
      saved: false,
      isEncrypted: false,
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
      content: ["This notebook name is reserved for AI Summaries. Sorry!"],
      children: [],
      parents: [],
      saved: false,
      isEncrypted: false,
    },
  },
  {
    data: {
      name: "Image-Preview",
      content: [
        "This notebook name is reserved for previewing uploaded images. Sorry!",
      ],
      children: [],
      parents: [],
      saved: false,
      isEncrypted: false,
    },
  },
];

function setLastNote(input) {
  lastNote = input;
}

function setCurrNote(input) {
  note = input;
}

// Returns desired info of any given book. If possible, takes it from memory
async function getAnyBookContent(bookName, desiredInfo) {
  if (reservedNames.some((e) => e.data.name === bookName)) {
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
      data: {
        name: cBook.name,
        date: cBook.timeOfSave,
        content: cBook.content,
        dbSave: cBook.dbSave,
        children: cBook.children,
        parents: cBook.parents,
        saved: cBook.saved,
        isEncrypted: cBook.isEncrypted,
        password: cBook.password,
        aceSessions: cBook.aceSessions,
      },
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

// function to switch between notes.
async function switchNote(noteName, page) {
  if (!validNoteName.test(noteName)) {
    notyf.error("Invalid note name");
    if (!note) {
      switchNote("home");
    }
    return;
  }
  closePopupWindow();
  // can't do !page because page can be be 0 and !0 => true
  if (page == null) {
    try {
      page = library.get(noteName).pgN;
    } catch (err) {
      page = 0;
    }
  }
  if (
    note &&
    noteName === note.name &&
    page === note.pgN &&
    !reservedNames.some((e) => e.data.name === note.name)
  ) {
    return;
  }
  if (switching) {
    return;
  }
  switching = true;
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
        notesAreaContainer.classList.add("isEncrypted");
      } else {
        notyf.error("Incorrect Password");
        switching = false;
        switchNote("home");
        return;
      }
    } else if (data.isEncrypted) {
      // data.content = data.content.map((cipher) => decryptMsg(cipher, data.password))
      notesAreaContainer.classList.add("isEncrypted");
    } else {
      notesAreaContainer.classList.remove("isEncrypted");
    }
  } catch (err) {
    switching = false;
    switchNote("home");
    notyf.error("Something went wrong. Try again in a second");
    return;
  }
  try {
    document.getElementById(`book__${note.name}`).classList.remove("openTab");
  } catch (err) {
    // console.log(err);
  }
  setLastNote(note);
  setCurrNote({});
  note.name = noteName.replaceAll("/", "");
  note.isEncrypted = data.isEncrypted;
  note.content = note.isEncrypted
    ? data.content
    : JSON.parse(localStorage.getItem(noteName)) || data.content;
  note.pgN = page < note.content.length ? page : note.content.length - 1;
  note.password = note.isEncrypted ? data.password : null;
  note.dbSave = data.dbSave || data.content;
  note.children = data.children;
  note.parents = data.parents;
  note.family = await getFamily(noteName, data);
  note.timeOfSave = data.date;
  if (data.saved == null || data.saved) {
    note.saved = true;
  } else {
    note.saved = false;
  }
  note.aceSessions = data.aceSessions || [];
  if (!note.pgN) {
    note.pgN = 0;
    note.content = getWrittenPages(note.content);
  }
  try {
    document.getElementById(`book__${note.name}`).classList.add("openTab");
  } catch (err) {
    createTab(note.name, true);
  }
  if (reservedNames.some((e) => e.data.name === note.name)) {
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
  if (!lastNote || lastNote.name !== note.name) {
    defineCmd();
  }
  savedWS.add(noteName);
  localStorage.setItem("/workspace", JSON.stringify(Array.from(savedWS)));
  switching = false;
}

// a small wrapper function that filters an array with the given logic (or compares to an empty string by default), but won't return an empty array
function getWrittenPages(arr, logic, defaultValue) {
  logic = !logic ? (str) => str !== "" : logic;
  defaultValue = defaultValue == null ? "" : defaultValue;
  const response = arr.filter((e) => logic(e));
  if (!response.length) {
    response.push(defaultValue);
  }
  return response;
}

async function forceUpdateNotes() {
  const name = note.name;
  try {
    const tabToClose = document.getElementById(`book__${note.name}`);
    tabToClose.removeEventListener("click", switchTab);
    tabToClose.removeEventListener("mouseup", closeTab);
    tabToClose.children[1].removeEventListener("click", closeTab);
    tabToClose.remove();
  } catch (err) {
    console.log(err);
  }
  const pg = note.pgN;
  setCurrNote(null);
  localStorage.removeItem(name);
  library.delete(name);
  switchNote(name, pg);
  notyf.success("Notes were pulled from database");
}

function deletePage() {
  if (note.content.length > 1) {
    note.aceSessions[note.pgN] = null;
    note.content.splice(note.pgN, 1);
    note.pgN = note.content.length - 1;
    accents(false);
    defineCmd();
  }
}

async function saveNoteBookToDb(noteName, data) {
  if (
    !validNoteName.test(noteName) ||
    reservedNames.some((e) => e.data.name === noteName)
  ) {
    notyf.error("Something went wrong");
    return;
  }
  if (library.get(noteName)) {
    function prepareForSave(obj) {
      const newContent = [];
      const newSessions = [];
      for (let i = 0; i < obj.content.length; i++) {
        if (obj.content[i]) {
          newContent.push(obj.content[i]);
          newSessions.push(obj.aceSessions[i]);
        }
      }

      obj.content = newContent;
      obj.aceSessions = newSessions;
    }

    let desiredNote = library.get(noteName);
    prepareForSave(desiredNote);
    if (!desiredNote.isEncrypted) {
      localStorage.setItem(desiredNote.name, JSON.stringify(note.content));
    }
    const saveStatus = await fetch("/api/save/notebooks/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: desiredNote.name,
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
        areNotesSavedIcon.classList.add("saved");
        desiredNote.dbSave = [...desiredNote.content];
        if (desiredNote.pgN > desiredNote.content.length - 1) {
          jumpToDesiredPage(desiredNote.content.length - 1);
        } else {
          accents(false);
        }
        desiredNote.saved = true;
        desiredNote.timeOfSave = new Date().toLocaleString();
        syncStatus(desiredNote.dbSave);
      } else {
        desiredNote.dbSave = [...desiredNote.content];
        desiredNote.saved = true;
        desiredNote.timeOfSave = new Date().toLocaleString();
      }
      notyf.success("Notebook was saved");
    } else {
      notyf.error("An error occurred when saving a notebook");
    }
    updateList();
    defineCmd();
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
          library.get(parent).family = library
            .get(parent)
            .family.filter((e) => e !== noteName);
        } catch (err) {
          // console.log(err);
        }
      });

      noteinMem.children.forEach((child) => {
        try {
          library.get(child).parents = library
            .get(child)
            .parents.filter((e) => e !== noteName);
          library.get(child).family = library
            .get(child)
            .family.filter((e) => e !== noteName);
        } catch (err) {
          // console.log(err);
        }
      });

      noteinMem.dbSave = [];
      noteinMem.saved = false;
      noteinMem.children = [];
      noteinMem.parents = [];
      noteinMem.family = [];
      noteinMem.isEncrypted = false;
      noteinMem.password = null;
    }

    filterFlashcards(noteName);
    syncStatus(note.dbSave);
    updateList();
    defineCmd();
  } else {
    notyf.error("An error occurred when deleting a notebook");
  }
}

async function copyBook(newName, bookToCopy) {
  const existingItem = await fetch(`/api/get/notebooks/${newName}`);
  if (existingItem.status === 404 && newName && bookToCopy) {
    if (library.get(bookToCopy) && library.get(bookToCopy).isEncrypted) {
      notyf.error("Encrypted notebooks can't be copied");
      return;
    }
    const content = await getAnyBookContent(bookToCopy, "content");
    const save = await fetch("/api/save/notebooks/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newName,
        content,
        date: new Date().toLocaleString(),
      }),
    });
    if (save.ok) {
      localStorage.setItem(newName, JSON.stringify(content));
      if (library.get(newName)) {
        library.get(newName).content = content;
      }
      updateList();
      switchNote(newName, 0);
    } else {
      notyf.error("An error occurred when saving a notebook");
    }
  }
}
