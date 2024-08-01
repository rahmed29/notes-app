import { note, switchNote } from "../note_utils";
import {
  mainContainer,
  list,
  uploadFolder,
  border,
  searchBar,
} from "../important_stuff/dom_refs";
import { jumpToDesiredPage } from "../dom_formatting";
import { showMorePages, search, resizeList } from "../list_utils";
import { toggleList } from "../list_utils";
import { contextMenu, delContextMenu } from "../context_menu";
import { eid } from "../dom_utils";

export default setupList;

function setupList() {
  // side bar and list
  eid("leftMostSideBar").addEventListener("contextmenu", (e) =>
    e.preventDefault()
  );
  eid("sideBarRetractList").addEventListener("click", toggleList);
  eid("newPage").addEventListener("click", () =>
    jumpToDesiredPage(note.content.length)
  );
  morePages.addEventListener("click", (e) => showMorePages(e));
  eid("goHome").addEventListener("click", (e) => {
    contextMenu(e, [
      {
        text: "Recent Notes",
        click: async () => {
          const recents = JSON.parse(localStorage.getItem("/recents")).map(
            (e) => {
              return {
                text: e,
                click: async () => {
                  await switchNote(e);
                  delContextMenu();
                },
              };
            }
          );
          recents.push({ spacer: true });
          recents.push({
            text: "Clear List",
            click: async () => {
              localStorage.setItem("/recents", "[]");
              delContextMenu();
            },
            appearance: "rios",
          });
          contextMenu(e, recents, "resample");
        },
      },
      {
        spacer: true,
      },
      {
        text: "Note Map",
        click: async () => {
          await switchNote("Note-Map");
          delContextMenu();
        },
      },
      {
        text: "Home",
        click: async () => {
          await switchNote("home");
          delContextMenu();
        },
      },
    ]);
  });
  list.addEventListener("contextmenu", (e) => e.preventDefault());
  searchBar.addEventListener("input", search);
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
}
