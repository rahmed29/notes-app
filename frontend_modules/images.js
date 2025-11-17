import { editor } from "./important_stuff/editor";
import { updateAndSaveNotesLocally } from "./dom_formatting";
import { updateList } from "./list_utils";
import { note } from "./data/note";
import { properLink } from "./data_utils";
import notes_api from "./important_stuff/api";
import { insertTemplate } from "./snippets";

export { insertAndSaveImage, deleteImageFromDb };

async function insertAndSaveImage() {
  if (!note.readOnly) {
    const formData = new FormData(myForm);
    const imageUploadStatus = await notes_api.post.saveImages(formData);
    if (imageUploadStatus.ok) {
      const response = await imageUploadStatus.json();
      insertTemplate(`${properLink(response.image)}(${response.image})`);
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

async function deleteImageFromDb(image_name) {
  const imageDelete = await notes_api.del.images(image_name);
  if (imageDelete.ok) {
    // Uncomment the below code to remove instances of the image in the markdown text
    // This will also remove instances of the image in any codeblocks, but who cares
    // also it repositions the caret at the start of where the last instance of the image in the markdown was
    if (!note.readOnly) {
      let newContent = note.content[note.pgN].replace(
        /(!)?\[(.*?)\]\((.*?)\)/g,
        "{{^}}",
      );
      insertTemplate(newContent, true);
      updateAndSaveNotesLocally();
    }
    updateList();
  } else if (imageDelete.status === 403) {
    notyf.error("You don't own this image");
  } else {
    notyf.error("An error occurred when deleting an image");
  }
}
