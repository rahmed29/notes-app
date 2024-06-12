import {
  getAnyBookContent,
  library,
  reservedNames,
  switchNote,
} from "./note_utils";
import { updateList } from "./list_utils";
import { defineCmd } from "./cmd_pal";

export { getFamily, nestNote, relinquishNote, createChild };

// 'hierarchy' stuff
async function getAncestors(bookName, optionalPreFetchedData) {
  let response = new Set();
  const parents =
    optionalPreFetchedData.parents ||
    (await getAnyBookContent(bookName, "parents")) ||
    [];

  if (parents.length === 0) {
    return response;
  }

  parents.forEach(async (parent) => {
    response.add(parent);
    response = new Set([...response, ...(await getAncestors(parent, {}))]);
  });

  return response;
}

async function getDescendants(bookName, optionalPreFetchedData) {
  let response = new Set();
  const children =
    optionalPreFetchedData.children ||
    (await getAnyBookContent(bookName, "children")) ||
    [];

  if (children.length === 0) {
    return response;
  }

  children.forEach(async (child) => {
    response.add(child);
    response = new Set([...response, ...(await getDescendants(child, {}))]);
  });

  return response;
}

async function getFamily(bookName, optionalPreFetchedData) {
  try {
    return library.get(bookName)["family"];
  } catch (err) {
    const ancestors = await getAncestors(
      bookName,
      optionalPreFetchedData || false
    );
    const descendants = await getDescendants(
      bookName,
      optionalPreFetchedData || false
    );
    const response = Array.from(ancestors).concat(Array.from(descendants));
    return response;
  }
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
      method: "POST",
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
      await nestNote(child, parent);
      switchNote(child, 0);
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
      method: "POST",
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
      method: "POST",
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
