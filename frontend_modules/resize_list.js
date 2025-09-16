import { border, list, tabs, workspace } from "./important_stuff/dom_refs";
import { changeSettings, getSetting } from "./important_stuff/settings";

export { resizeList, toggleList, showList, hideList };

function resizeList(e) {
  border.classList.add("currPage");
  document.body.style.cursor = "w-resize";
  if (e.clientX <= 600 && e.clientX >= 200) {
    list.style.width = `${e.clientX - 16}px`;
    workspace.style.width = `calc(100% - 25px - ${e.clientX - 16}px)`;
  }
}

function hideList() {
  list.style.display = "none";
  border.style.display = "none";
  tabs.style.padding = "5px";
  workspace.style.width = "calc(100% - 20px";
  list.removeAttribute("data-shown");
  changeSettings("listShown", false);
}

function showList() {
  list.style.display = "flex";
  border.style.display = "inline";
  tabs.style.padding = "5px 5px 5px 0";
  workspace.style.width = `calc(100% - 25px - ${getSetting(
    "listSize",
    "300px",
  )})`;
  list.setAttribute("data-shown", "");
  changeSettings("listShown", true);
}

var toggleList = () =>
  list.hasAttribute("data-shown") ? hideList() : showList();
