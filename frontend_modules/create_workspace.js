import { list } from "./important_stuff/dom_refs";
import { hideList, showList } from "./resize_list";
import { makeTabInDom, savedWS } from "./tabs";

export { createWorkspace };

// loading workspace from last session
function createWorkspace() {
  Array.from(savedWS).forEach((noteName) => makeTabInDom(noteName));
  list.style.width = localStorage.getItem("/listSize") || "350px";
  if (localStorage.getItem("/listShown") === "false") {
    hideList();
  } else {
    showList();
  }
}
