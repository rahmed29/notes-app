import { note } from "./data/note.js";
import { reserved } from "./data/reserved_notes.js";
import {
  stickyNotes,
  mainContainer,
  stickyNotesTextArea,
  brDots,
} from "./important_stuff/dom_refs.js";
import { updateAndSaveNotesLocally } from "./dom_formatting.js";
import { editor } from "./important_stuff/editor.js";

export {
  saveStickyNotes,
  showStickyNotes,
  hideStickyNotes,
  initializeStickyNotes,
  insertStickyNote,
};

function insertStickyNote() {
  if (!reserved(note.name)) {
    editor.insert(stickyNotesTextArea.value);
    updateAndSaveNotesLocally();
    editor.focus();
  } else {
    notyf.error("Reserved notebooks are read only");
  }
}

// sticky note
async function saveStickyNotes() {
  if (network.isOffline) {
    return;
  }
  const saveStatus = await fetch("/api/save/notebooks/sticky__notes", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: [stickyNotesTextArea.value],
    }),
  });
  if (!saveStatus.ok) {
    notyf.error("An error occurred when saving the sticky note");
  }
}

function showStickyNotes() {
  stickyNotes.classList.remove("gone");
  stickyNotes.classList.add("snOpen");
  mainContainer.addEventListener("click", hideStickyNotes, { once: true });
  stickyNotesTextArea.focus();
  brDots.style.display = "none";
}

function hideStickyNotes() {
  stickyNotes.classList.remove("snOpen");
  stickyNotes.addEventListener("click", showStickyNotes, { once: true });
  mainContainer.removeEventListener("click", hideStickyNotes);
  brDots.style.display = "flex";
}

async function initializeStickyNotes() {
  const response = await fetch("/api/get/notebooks/sticky__notes");
  if (response.ok) {
    let json = await response.json();
    stickyNotesTextArea.value = json["data"]["content"][0];
  } else if (response.status === 404) {
    stickyNotesTextArea.value = "";
  } else {
    notyf.error("An error occurred when loading your sticky note");
  }
}
