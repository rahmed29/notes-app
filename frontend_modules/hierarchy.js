import { getAnyBookContent, library, reserved } from "./note_utils";
import { updateList } from "./list_utils";
import { closeTab } from "./tabs";

export { getFamily, nestNote, relinquishNote, createChild, copyBook };

async function getFamily(bookName) {
  const response = await fetch(`/api/get/family/${bookName}`);
  const json = await response.json();
  return json.data;
}

async function createChild(parent, child) {
  const existingItem = await fetch(`/api/get/notebooks/${child}`);
  if (existingItem.status === 404 && child && parent && !reserved(parent)) {
    const saveStatus = await fetch(`/api/save/notebooks/${child}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: [""],
        date: new Date().toLocaleString(),
      }),
    });
    if (saveStatus.ok) {
      localStorage.setItem(child, JSON.stringify([""]));
      await closeTab(child, {
        refresh: true,
        saveState: true,
      }, true);
      nestNote(child, parent);
    } else {
      notyf.error("An error occurred when saving a notebook");
    }
  } else {
    notyf.error("Something went wrong");
  }
}

async function copyBook(newName, bookToCopy) {
  const existingItem = await fetch(`/api/get/notebooks/${newName}`);
  if (existingItem.status === 404 && newName && bookToCopy) {
    if (library.get(bookToCopy) && library.get(bookToCopy).isEncrypted) {
      notyf.error("Encrypted notebooks can't be copied");
      return;
    }
    const content = (await getAnyBookContent(bookToCopy, "content")) || [""];
    const save = await fetch(`/api/save/notebooks/${newName}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
        date: new Date().toLocaleString(),
      }),
    });
    if (save.ok) {
      localStorage.setItem(newName, JSON.stringify(content));
      updateList();
      closeTab(newName, {
        refresh: true,
        saveState: true,
      });
    } else {
      notyf.error("An error occurred when saving a notebook");
    }
  } else {
    notyf.error("Something went wrong");
  }
}

async function nestNote(child, parent) {
  if (child && parent && !reserved(child)) {
    const result = await fetch(`/api/nest/${child}/${parent}`, {
      method: "PATCH",
    });
    if (result.ok) {
      const childInMem = library.get(child);
      if (childInMem) {
        childInMem["parents"].push(parent);
      }

      const parentInMem = library.get(parent);
      if (parentInMem) {
        parentInMem["children"].push(child);
      }

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
  if (child && parent) {
    const result = await fetch(`/api/relinquish/${child}/${parent}`, {
      method: "PATCH",
    });
    if (result.ok) {
      const childInMem = library.get(child);
      if (childInMem) {
        childInMem["parents"] = childInMem["parents"].filter(
          (e) => e !== parent
        );
      }

      const parentInMem = library.get(parent);
      if (parentInMem) {
        parentInMem["children"] = parentInMem["children"].filter(
          (e) => e !== child
        );
      }

      updateList();
      // defineCmd();
    } else {
      notyf.error("An error occurred when relinquishing a notebook");
    }
  } else {
    notyf.error("Something went wrong");
  }
}
