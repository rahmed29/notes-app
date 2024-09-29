export { getAnyBookContent };

import { library } from "./data/library";
import { listInMemory } from "./data/list";
import { reserved, reservedNames } from "./data/reserved_notes";

// Returns desired info of any given book. If possible, takes it from memory
async function getAnyBookContent(bookName, desiredInfo) {
  if (reserved(bookName)) {
    if (desiredInfo === "_data") {
      return reservedNames.find((e) => e.data.name === bookName)["data"];
    }
    return reservedNames.find((e) => e.data.name === bookName)["data"][
      desiredInfo
    ];
  }
  if (library.get(bookName)) {
    const cachedData = {
      data: library.get(bookName),
    };
    if (desiredInfo === "_data") {
      return cachedData["data"];
    }
    return cachedData["data"][desiredInfo];
  } else if (
    listInMemory &&
    (desiredInfo === "parents" || desiredInfo === "children")
  ) {
    const objectInList = listInMemory.find((e) => e.name === bookName);
    if (objectInList) {
      return objectInList[desiredInfo];
    } else {
      return null;
    }
  }
  const response = await fetch(`/api/get/notebooks/${bookName}`);
  if (response.ok) {
    let json = await response.json();
    json.justFetched = true;
    if (desiredInfo === "_data") {
      return json["data"];
    }
    return json["data"][desiredInfo];
  } else if (response.status === 404) {
    return null;
  } else {
    notyf.error(`There was an error retrieving notebook: ${bookName}`);
    return null;
  }
}
