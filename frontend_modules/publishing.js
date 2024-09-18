import { note } from "./data/note";

export { publishBook, unpublishBook, setCurrentPublicBook, currentlyOpenPublicBook };

let currentlyOpenPublicBook;

function setCurrentPublicBook(book) {
  currentlyOpenPublicBook = book;
}

async function publishBook() {
  const response = await fetch(`/api/publish/${note.name}`, {
    method: "PATCH",
  });
  if (response.ok) {
    notyf.success("Notebook published");
  } else {
    notyf.error("There was an error publishing the notebook");
  }
  note.isPublic = true;
}

async function unpublishBook() {
  const response = await fetch(`/api/unpublish/${note.name}`, {
    method: "PATCH",
  });
  if (response.ok) {
    notyf.success("Notebook unpublished");
  } else {
    notyf.error("There was an error unpublishing the notebook");
  }
  note.isPublic = false;
}
