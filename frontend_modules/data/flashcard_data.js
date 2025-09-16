import notes_api from "../important_stuff/api";

export {
  flashcards,
  filterFlashcards,
  renameFlashcards,
  setFlashcards,
  initializeFlashcards,
  saveFlashcards,
};

let flashcards = [];

function setFlashcards(data) {
  flashcards = data;
}

function filterFlashcards(filter) {
  flashcards = flashcards.filter((e) => e.subject !== filter);
}

function renameFlashcards(oldName, newName) {
  flashcards = flashcards.map((e) => {
    if (e.subject === oldName) {
      e.subject = newName;
    }
    return e;
  });
  // This is only used when renaming a notebook, the rename endpoint will update the flashcards on the backend,
  // so we don't need to call `saveFlashcards()` here
}

// flashcards
async function initializeFlashcards() {
  const response = await notes_api.get.flashcards();
  if (response.ok) {
    let json = await response.json();
    setFlashcards(json.data);
  } else if (response.status === 404) {
    setFlashcards([]);
  } else {
    notyf.error("An error occurred when loading your flashcards");
  }
}

async function saveFlashcards() {
  if (network.isOffline) {
    return;
  }
  setFlashcards(
    flashcards.filter(
      (card) =>
        card.front && card.front !== "\n" && card.back && card.back !== "\n",
    ),
  );
  const response = await notes_api.put.saveNotebooks("flash__cards", {
    content: [JSON.stringify(flashcards)],
  });
  if (!response.ok) {
    notyf.error("An error occurred when saving the flashcards");
  }
}
