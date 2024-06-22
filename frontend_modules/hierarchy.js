import {
  getAnyBookContent,
  library,
  reservedNames,
} from "./note_utils";
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
      optionalPreFetchedData || false
    );
    const descendants = await getFamilyOneWay(
      bookName,
      "children",
      optionalPreFetchedData || false
    );
    const response = Array.from(ancestors).concat(Array.from(descendants));
    return response;
  }
}

async function getFamilyOneWay(bookName, direction, optionalPreFetchedData) {
  let response = new Set();
  const branch =
    optionalPreFetchedData.parents ||
    (await getAnyBookContent(bookName, direction)) ||
    [];

  if (branch.length === 0) {
    return response;
  }

  branch.forEach(async (member) => {
    response.add(member);
    response = new Set([
      ...response,
      ...(await getFamilyOneWay(member, direction, {})),
    ]);
  });

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
      await closeTab(child, true)
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
      if (library.get(child)) {
        library.get(child)["parents"].push(parent);
        library.get(child)["family"].push(parent);
      }

      if (library.get(parent)) {
        library.get(parent)["children"].push(child);
        library.get(parent)["family"].push(child);
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
      try {
        library.get(child)["parents"] = library
          .get(child)
          ["parents"].filter((e) => e !== parent);
        library.get(child)["family"] = library
          .get(child)
          ["family"].filter((e) => e !== parent);
      } catch (err) {
        // console.log(err);
      }

      try {
        library.get(parent)["children"] = library
          .get(parent)
          ["children"].filter((e) => e !== child);
        library.get(parent)["family"] = library
          .get(parent)
          ["family"].filter((e) => e !== child);
      } catch (err) {
        // console.log(err);
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
