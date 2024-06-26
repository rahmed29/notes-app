import { editor } from "../main";
import { updateAndSaveNotesLocally } from "./dom_formatting";
import { updateList } from "./list_utils";
import { note, reserved } from "./note_utils";

export { insertAndSaveImage, deleteImageFromDb };

async function insertAndSaveImage() {
  if (!reserved(note.name)) {
    const formData = new FormData(myForm);
    const imageUploadStatus = await fetch("/api/save/images", {
      method: "POST",
      body: formData,
    });
    if (imageUploadStatus.ok) {
      const response = await imageUploadStatus.text();
      editor.insert(`![](${response})`);
      updateAndSaveNotesLocally();
      updateList();
      // saveNoteBookToDb(note.name);
    } else {
      notyf.error("An error occurred when saving an image");
    }
  } else {
    notyf.error("Reserved notebooks are read only");
  }
}

async function deleteImageFromDb(image) {
  let imageInText = `![](/uploads/${image})`;
  const imageDelete = await fetch(`/api/delete/images/${image}`, {
    method: "DELETE",
  });
  if (imageDelete.ok) {
    editor.session.setValue(editor.getValue().replaceAll(imageInText, ""));
    updateAndSaveNotesLocally();
    // if (!note.readOnly) {
    //   saveNoteBookToDb(note.name);
    // }
    updateList();
  } else {
    notyf.error("An error occurred when deleting an image");
  }
}
