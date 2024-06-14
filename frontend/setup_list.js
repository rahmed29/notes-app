import { mainContainer, list, uploadFolder, border } from "../main";
import { jumpToDesiredPage } from "./dom_formatting";
import { showMorePages, search, resizeList } from "./list_utils";
import { switchNote } from "./note_utils";
import { toggleList } from "./list_utils";

export default setupList;

function setupList() {
  // side bar and list
  document
    .getElementById("leftMostSideBar")
    .addEventListener("contextmenu", (e) => e.preventDefault());
  document
    .getElementById("sideBarRetractList")
    .addEventListener("click", toggleList);
  document
    .getElementById("newPage")
    .addEventListener("click", () => jumpToDesiredPage(note.content.length));
  morePages.addEventListener("click", (e) => showMorePages(e));
  document
    .getElementById("goHome")
    .addEventListener("click", () => switchNote("home", 0));
  list.addEventListener("contextmenu", (e) => e.preventDefault());
  document
    .getElementById("searchItem")
    .children[0].addEventListener("input", function () {
      search(this.value);
    });
  uploadFolder.addEventListener("click", function () {
    this.parentNode.classList.toggle("down");
  });
  border.addEventListener("mousedown", () => {
    delContextMenu();
    mainContainer.style.userSelect = "none";
    document.addEventListener("mousemove", resizeList);
    document.addEventListener(
      "mouseup",
      () => {
        localStorage.setItem("/listSize", list.style.width);
        border.classList.remove("currPage");
        document.body.style.cursor = "inherit";
        mainContainer.style.userSelect = "inherit";
        document.removeEventListener("mousemove", resizeList);
      },
      { once: true }
    );
  });
  document.getElementById("loading").addEventListener(
    "animationend",
    function () {
      this.remove();
    },
    { once: true }
  );
  document
    .getElementById("openCommandPal")
    .addEventListener("click", () =>
      document.getElementsByClassName("mobile-button")[0].click()
    );
}
