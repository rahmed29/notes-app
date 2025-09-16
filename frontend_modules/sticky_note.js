import {
  stickyNotes,
  mainContainer,
  stickyNotesTextArea,
  brDots,
} from "./important_stuff/dom_refs.js";
import notes_api from "./important_stuff/api.js";

export {
  saveStickyNotes,
  showStickyNotes,
  hideStickyNotes,
  initializeStickyNotes,
};

// sticky note
async function saveStickyNotes() {
  if (network.isOffline) {
    return;
  }
  const saveStatus = await notes_api.put.saveNotebooks("sticky__notes", {
    content: [stickyNotesTextArea.value],
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
  const response = await notes_api.get.notebooks("sticky__notes");
  if (response.ok) {
    let json = await response.json();
    stickyNotesTextArea.value = json["data"]["content"][0];
  } else if (response.status === 404) {
    stickyNotesTextArea.value = "";
  } else {
    notyf.error("An error occurred when loading your sticky note");
  }
}
