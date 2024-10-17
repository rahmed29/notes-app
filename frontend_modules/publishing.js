import { note } from "./data/note";
import notes_api from "./important_stuff/api";

export {
  publishBook,
  unpublishBook,
  setCurrentPublicBook,
  currentlyOpenPublicBook,
};

let currentlyOpenPublicBook;

function setCurrentPublicBook(book) {
  currentlyOpenPublicBook = book;
}

async function publishBook() {
  const response = await notes_api.patch.publish(note.name);
  if (response.ok) {
    notyf.success("Notebook published");
  } else {
    notyf.error("There was an error publishing the notebook");
  }
  note.isPublic = true;
}

async function unpublishBook() {
  const response = await notes_api.patch.unpublish(note.name);
  if (response.ok) {
    notyf.success("Notebook unpublished");
  } else {
    notyf.error("There was an error unpublishing the notebook");
  }
  note.isPublic = false;
}
