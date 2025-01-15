import { editor } from "./important_stuff/editor";
import { updateAndSaveNotesLocally } from "./dom_formatting";
import { updateList } from "./list_utils";
import { note } from "./data/note";
import { reserved } from "./data/reserved_notes";
import { properLink } from "./data_utils";
import notes_api from "./important_stuff/api";

export { insertAndSaveImage, deleteImageFromDb };

async function insertAndSaveImage() {
  if (!reserved(note.name)) {
    const formData = new FormData(myForm);
    const imageUploadStatus = await notes_api.post.saveImages(formData);
    if (imageUploadStatus.ok) {
      const response = await imageUploadStatus.json();
      editor.insert(`${properLink(response.image)}(${response.image})`);
      updateAndSaveNotesLocally();
      updateList();
      // saveNoteBookToDb(note.name);
      editor.focus();
    } else {
      notyf.error("An error occurred when saving an image");
    }
  } else {
    notyf.error("Reserved notebooks are read only");
  }
}

// image is the name of the image file
async function deleteImageFromDb(image) {
  const imageDelete = await notes_api.del.images(image);
  if (imageDelete.ok) {
    // *replace all instances of the image in the notes*
    // updateAndSaveNotesLocally();
    // editor.focus();
    // editor.gotoLine(0, 0);
    updateList();
  } else if (imageDelete.status === 403) {
    notyf.error("You don't own this image");
  } else {
    notyf.error("An error occurred when deleting an image");
  }
}
