import { getAnyBookContent, library, reservedNames } from "./note_utils";
import { updateList } from "./list_utils";
import { defineCmd } from "./ctrl_space";
import { closeTab } from "./tabs";

export { getFamily, nestNote, relinquishNote, createChild };

// not actually "family", but rather all descendants and ancestors. If possible, grabs from memory. This function is needed when nesting notebooks to prevent infinite recursion in the list
async function getFamily(bookName, optionalPreFetchedData) {
  try {
    return library.get(bookName)["family"];
  } catch (err) {
    const ancestors = await getFamilyOneWay(
      bookName,
      "parents",
      optionalPreFetchedData
    );
    const descendants = await getFamilyOneWay(
      bookName,
      "children",
      optionalPreFetchedData
    );
    const response = [...ancestors, ...descendants];
    return response;
  }
}

async function getFamilyOneWay(
  bookName,
  direction,
  optionalPreFetchedData = {}
) {
  const response = new Set();
  const branch =
    optionalPreFetchedData[direction] ||
    (await getAnyBookContent(bookName, direction)) ||
    [];

  if (branch.length === 0) {
    return response;
  }

  for (const member of branch) {
    response.add(member);
    const memberFamily = await getFamilyOneWay(member, direction, {});
    memberFamily.forEach((m) => response.add(m));
  }

  return response;
}

async function createChild(parent, child) {
  const existingItem = await fetch(`/api/get/notebooks/${child}`);
  if (
    existingItem.status === 404 &&
    child &&
    parent &&
    !reservedNames.some((e) => e.data.name === parent)
  ) {
    const saveStatus = await fetch("/api/save/notebooks/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: child,
        content: [""],
        date: new Date().toLocaleString(),
      }),
    });
    if (saveStatus.ok) {
      localStorage.setItem(child, JSON.stringify([""]));
      await closeTab(child, true);
      nestNote(child, parent);
    } else {
      notyf.error("An error occurred when saving a notebook");
    }
  } else {
    notyf.error("Something went wrong");
  }
}

async function nestNote(child, parent) {
  if (child && parent && !reservedNames.some((e) => e.data.name === child)) {
    const result = await fetch(`/api/nest/${child}/${parent}`, {
      method: "PATCH",
    });
    if (result.ok) {
      const childInMem = library.get(child);
      if (childInMem) {
        childInMem["parents"].push(parent);
        childInMem["family"].push(parent);
      }

      const parentInMem = library.get(parent);
      if (parentInMem) {
        parentInMem["children"].push(child);
        parentInMem["family"].push(child);
      }

      updateList();
      defineCmd();
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
        childInMem["parents"] = childInMem["parents"].filter((e) => e !== parent);
        childInMem["family"] = childInMem["family"].filter((e) => e !== parent);
      }

      const parentInMem = library.get(parent);
      if (parentInMem) {
        parentInMem["children"] = parentInMem["children"].filter((e) => e !== child);
        parentInMem["family"] = parentInMem["family"].filter((e) => e !== child);
      }

      updateList();
      defineCmd();
    } else {
      notyf.error("An error occurred when relinquishing a notebook");
    }
  } else {
    notyf.error("Something went wrong");
  }
}
