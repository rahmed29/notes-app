import { list } from "./important_stuff/dom_refs";
import { hideList, showList } from "./resize_list";
import { getSetting } from "./important_stuff/settings";
import { makeTabInDom, savedWS } from "./tabs";

export { createWorkspace };

// loading workspace from last session
function createWorkspace() {
  Array.from(savedWS).forEach((noteName) => makeTabInDom(noteName));
  list.style.width = getSetting("listSize", "350px");
  if (getSetting("listShown") === false) {
    hideList();
  } else {
    showList();
  }
}
