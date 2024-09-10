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
  const response = await fetch("/api/get/flashcards");
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
        card.front && card.front !== "\n" && card.back && card.back !== "\n"
    )
  );
  const response = await fetch("/api/save/notebooks/flash__cards", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: [JSON.stringify(flashcards)],
    }),
  });
  if (!response.ok) {
    notyf.error("An error occurred when saving the flashcards");
  }
}
