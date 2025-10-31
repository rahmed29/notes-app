import getAnyBookContent from "./get_book_content";
import { removeSpecificDropped, updateList } from "./list_utils";
import { closeTab } from "./tabs";
import { reserved } from "./data/reserved_notes";
import library from "./data/library";
import localforage from "localforage";
import notes_api from "./important_stuff/api";

export { getFamily, nestNote, relinquishNote, createChild, copyBook };

async function getFamily(bookName) {
  const response = await notes_api.get.family(bookName);
  if (!response.ok) {
    return [];
  }
  const json = await response.json();
  return json.data;
}

async function createChild(parent, child) {
  if (network.isOffline) {
    return;
  }
  const existingItem = await notes_api.get.notebooks(child);
  if (
    // existingItem.ok &&
    existingItem.status === 404 &&
    child &&
    parent &&
    !reserved(parent)
  ) {
    const timestamp = Date.now();
    const saveStatus = await notes_api.put.saveNotebooks(child, {
      content: [""],
      timestamp,
    });
    if (saveStatus.ok) {
      await localforage.setItem(child, {
        content: [""],
        timestamp,
      });
      await closeTab(child, {
        refresh: true,
        saveState: true,
        switchAsFallBack: true,
      });
      nestNote(child, parent);
    } else {
      notyf.error("An error occurred when saving a notebook");
    }
  } else if (existingItem.ok) {
    notyf.error("A notebook with that name already exists");
  } else if (reserved(parent)) {
    notyf.error("That notebook name is reserved");
  } else {
    notyf.error("An error occurred");
  }
}

async function copyBook(newName, bookToCopy) {
  if (network.isOffline) {
    return;
  }
  const existingItem = await notes_api.get.notebooks(newName);
  if (
    // existingItem.ok &&
    existingItem.status === 404 &&
    newName &&
    bookToCopy
  ) {
    if (library.get(bookToCopy) && library.get(bookToCopy).isEncrypted) {
      notyf.error("Encrypted notebooks can't be copied");
      return;
    }
    const content = await getAnyBookContent(bookToCopy, "content");
    const timestamp = Date.now();
    const save = await notes_api.put.saveNotebooks(
      newName,
      { content },
      timestamp,
    );
    if (save.ok) {
      await localforage.setItem(newName, {
        content,
        timestamp,
      });
      updateList();
      closeTab(newName, {
        refresh: true,
        saveState: true,
        switchAsFallBack: true,
      });
    } else {
      notyf.error("An error occurred when saving a notebook");
    }
  } else {
    notyf.error("Something went wrong");
  }
}

async function nestNote(child, parent) {
  if (network.isOffline) {
    return;
  }
  if (child && parent && !reserved(child)) {
    const result = await notes_api.patch.nest(child, parent);
    if (result.ok) {
      // const childInMem = library.get(child);
      // if (childInMem) {
      //   childInMem["parents"].push(parent);
      // }

      // const parentInMem = library.get(parent);
      // if (parentInMem) {
      //   parentInMem["children"].push(child);
      // }

      updateList();
      // defineCmd();
    } else {
      notyf.error("An error occurred when nesting a notebook");
    }
  } else {
    notyf.error("Something went wrong");
  }
}

async function relinquishNote(child, parent) {
  if (network.isOffline) {
    return;
  }
  if (child && parent) {
    const result = await notes_api.patch.relinquish(child, parent);
    if (result.ok) {
      removeSpecificDropped(child, parent);
      updateList();
    } else {
      notyf.error("An error occurred when relinquishing a notebook");
    }
  } else {
    notyf.error("Something went wrong");
  }
}
