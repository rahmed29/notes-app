import { switchNote } from "../note_utils";
import {
  mainContainer,
  list,
  uploadFolder,
  border,
  searchBar,
} from "../important_stuff/dom_refs";
import { accents, jumpToDesiredPage } from "../dom_formatting";
import { showMorePages, search } from "../list_utils";
import { contextMenu, delContextMenu } from "../context_menu";
import { eid } from "../dom_utils";
import { note } from "../data/note";
import { toggleList, resizeList } from "../resize_list";
import { changeSettings, getSetting } from "../important_stuff/settings";
import { throttle } from "../data_utils";

export default setupList;

function setupList() {
  // side bar and list
  eid("leftMostSideBar").addEventListener("contextmenu", (e) =>
    e.preventDefault(),
  );
  eid("sideBarRetractList").addEventListener("click", toggleList);
  eid("newPage").addEventListener("click", () =>
    jumpToDesiredPage(note.content.length),
  );
  morePages.addEventListener("click", (e) => showMorePages(e));
  eid("goHome").addEventListener("click", (e) => {
    contextMenu(e, [
      {
        text: "Recent Notes",
        populator: () => {
          const recents = getSetting("recents", []).map((e) => ({
            text: e,
            click: async () => {
              await switchNote(e);
              delContextMenu();
            },
          }));
          recents.push({ spacer: true });
          recents.push({
            text: "Clear List",
            click: async () => {
              changeSettings("recents", []);
              if (note.name === "home") {
                note.reservedData.beforeOpen[0]();
                accents();
              }
              delContextMenu();
            },
            appearance: "rios",
          });
          return recents;
        },
      },
      {
        text: "Recent Tags",
        populator: () => {
          const recents = getSetting("recents_tags", []).map((e) => {
            return {
              text: e,
              click: async () => {
                await switchNote("Tag-Viewer", {
                  props: e,
                });
                delContextMenu();
              },
            };
          });
          recents.push({ spacer: true });
          recents.push({
            text: "Clear List",
            click: async () => {
              changeSettings("recents_tags", []);
              if (note.name === "home") {
                note.reservedData.beforeOpen[0]();
                accents();
              }
              delContextMenu();
            },
            appearance: "rios",
          });
          return recents;
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
        text: "Snippets",
        click: async () => {
          await switchNote("snippets");
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
  searchBar.addEventListener("input", () => {
    throttle({
      delay: 100,
      condition: true,
      callback: () => search(searchBar.value),
    });
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
        changeSettings("listSize", list.style.width);
        border.classList.remove("currPage");
        document.body.style.cursor = "inherit";
        mainContainer.style.userSelect = "inherit";
        document.removeEventListener("mousemove", resizeList);
      },
      { once: true },
    );
  });
}
