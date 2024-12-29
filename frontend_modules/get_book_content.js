export default getAnyBookContent;

import library from "./data/library";
import { listInMemory } from "./data/list";
import { reserved, reservedNames } from "./data/reserved_notes";
import notes_api from "./important_stuff/api";

const defaultValues = {
  parents: [],
  children: [],
  content: [""],
  _data: null,
};

async function getAnyBookContent(bookName, desiredInfo) {
  // If it's reserved, we just take it from our array of reserved names
  if (reserved(bookName)) {
    if (desiredInfo === "_data") {
      return reservedNames.find((e) => e.data.name === bookName)["data"];
    }
    return (
      reservedNames.find((e) => e.data.name === bookName)["data"][
        desiredInfo
      ] || defaultValues[desiredInfo]
    );
  }
  // If there is a list in memory, we can take the parents and children from there
  // this should always be the case
  if (
    listInMemory &&
    (desiredInfo === "parents" || desiredInfo === "children")
  ) {
    const objectInList = listInMemory.find((e) => e.name === bookName);
    if (objectInList) {
      return objectInList[desiredInfo];
    } else {
      return defaultValues[desiredInfo];
    }
    // If the book is in memory, we can take the data from there (if it's not parents or children)
  } else if (
    library.get(bookName) &&
    (desiredInfo !== "parents" || desiredInfo !== "children")
  ) {
    const cachedData = {
      data: library.get(bookName),
    };
    if (desiredInfo === "_data") {
      return cachedData["data"];
    }
    return cachedData["data"][desiredInfo];
  }
  // If it's not in memory, we have to fetch it from the server
  const response = await notes_api.get.notebooks(bookName);
  if (response.ok) {
    let json = await response.json();
    if (desiredInfo === "_data") {
      return json["data"];
    }
    return json["data"][desiredInfo];
  } else if (response.status === 404) {
    return defaultValues[desiredInfo];
  } else {
    notyf.error(`There was an error retrieving content for ${bookName}`);
    return defaultValues[desiredInfo];
  }
}
