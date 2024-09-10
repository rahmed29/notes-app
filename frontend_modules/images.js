import { editor } from "./important_stuff/editor";
import { updateAndSaveNotesLocally } from "./dom_formatting";
import { updateList } from "./list_utils";
import { note } from "./data/note";
import { reserved } from "./data/reserved_notes";

export { insertAndSaveImage, deleteImageFromDb };

async function insertAndSaveImage() {
  if (!reserved(note.name)) {
    const formData = new FormData(myForm);
    const imageUploadStatus = await fetch("/api/save/images", {
      method: "POST",
      body: formData,
    });
    if (imageUploadStatus.ok) {
      const response = await imageUploadStatus.json();
      editor.insert(`![](${response.image})`);
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
  let imageInText = `![](/uploads/${image})`;
  const imageDelete = await fetch(`/api/delete/images/${image}`, {
    method: "DELETE",
  });
  if (imageDelete.ok) {
    editor.setValue(editor.getValue().replaceAll(imageInText, ""));
    updateAndSaveNotesLocally();
    // if (!note.readOnly) {
    //   saveNoteBookToDb(note.name);
    // }
    updateList();
    editor.focus();
    editor.gotoLine(0, 0);
  } else {
    notyf.error("An error occurred when deleting an image");
  }
}
