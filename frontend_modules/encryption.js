import { note, saveNoteBookToDb } from "./note_utils";
import { notesAreaContainer } from "../main";
import CryptoJS from "crypto-js";

export {
  encryptMsg,
  checkKey,
  decryptMsg,
  decryptCurrentBook,
  encryptCurrentBook,
};

function decryptCurrentBook() {
  if (
    note.isEncrypted &&
    confirm(
      "This will immediately save your notebook in an unencrypted state. Proceed?"
    )
  ) {
    note.isEncrypted = false;
    note.password = null;
    saveNoteBookToDb(note.name);
    notesAreaContainer.classList.remove("isEncrypted");
  }
}

function encryptCurrentBook() {
  if (!note.isEncrypted) {
    note.password = prompt("Enter a password");
    if (note.password != null) {
      note.isEncrypted = true;
      saveNoteBookToDb(note.name);
      notesAreaContainer.classList.add("isEncrypted");
      localStorage.removeItem(note.name);
    }
  } else {
    notyf.error("Note is already encrypted");
  }
}

function encryptMsg(msg, key) {
  return CryptoJS.AES.encrypt(JSON.stringify({ msg }), key).toString();
}

function checkKey(cipher, key) {
  return CryptoJS.AES.decrypt(cipher, key).sigBytes >= 0;
}

function decryptMsg(cipher, key) {
  const bytes = CryptoJS.AES.decrypt(cipher, key);
  return bytes.toString(CryptoJS.enc.Utf8);
}
