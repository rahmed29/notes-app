import {
  listContainer,
  list,
  uploadFolder,
  workspace,
  border,
  tabs,
  bottomLeftGeneralInfo,
  topLeftPageNumber,
  searchBar,
} from "./important_stuff/dom_refs";
import {
  abnormalContextMenu,
  asyncContextMenu,
  beginAsyncCM,
  confirmation_cm,
  contextMenu,
  delContextMenu,
} from "./context_menu";
import {
  switchNote,
  deleteNoteBookFromDb,
  getAnyBookContent,
  note,
  forceUpdateNotes,
} from "./note_utils";
import { format } from "./micromark_directives";
import { closeTab, switchTab, silentReset } from "./tabs";
import { getFamily, nestNote, relinquishNote } from "./hierarchy";
import { jumpToDesiredPage } from "./dom_formatting";
import removeMD from "../modules/removeMD";
import { cmInput } from "./palettes/cmInput";

export {
  createList,
  getList,
  updateList,
  search,
  resizeList,
  toggleList,
  showList,
  hideList,
  showPagePreview,
  listInMemory,
  imageList,
  listContextMenu,
  showMorePages,
  cmInput,
  removeDropped,
  addDropped,
};

let listHandlers = [];

// variable for the tree list
let nestedBooks = null;
const droppedFolders = new Set(
  JSON.parse(localStorage.getItem("/fileStructure")) || []
);
const root = {
  name: "/root",
  children: [],
  excerpt: [],
  parents: [],
};

function removeDropped(book) {
  droppedFolders.delete(book);
  localStorage.setItem(
    "/fileStructure",
    JSON.stringify(Array.from(droppedFolders))
  );
}

function addDropped(book) {
  droppedFolders.add(book);
  localStorage.setItem(
    "/fileStructure",
    JSON.stringify(Array.from(droppedFolders))
  );
}

async function showMorePages(e) {
  const buttons = note.content.reduce((arr, e, i) => {
    if (i >= 9) {
      const app = i === note.pgN ? "currPage" : "random";
      arr.push({
        text: `Page ${i}`,
        click: (e) => {
          jumpToDesiredPage(i);
          showMorePages(e);
        },
        appearance: app,
      });
    }
    return arr;
  }, []);
  contextMenu(
    e,
    buttons,
    ["21px", `${topLeftPageNumber.scrollHeight + 5}px`],
    true
  );
}

// creating the tree list
function dropWrapper(e) {
  e.stopPropagation();
  delContextMenu();
  if (this.hasAttribute("data-down")) {
    droppedFolders.delete(this.parentNode.getAttribute("data-bookname"));
    this.nextElementSibling.style.display = "none";
    this.classList.remove("down");
    this.removeAttribute("data-down");
  } else {
    droppedFolders.add(this.parentNode.getAttribute("data-bookname"));
    this.nextElementSibling.style.display = "flex";
    this.classList.add("down");
    this.setAttribute("data-down", "");
  }
  localStorage.setItem(
    "/fileStructure",
    JSON.stringify(Array.from(droppedFolders))
  );
}

async function createList(customChildren) {
  nestedBooks = new Set();
  listHandlers = listHandlers.reduce((arr, { element, type, listener }) => {
    element.removeEventListener(type, listener);
    return arr;
  }, []);
  const result = customChildren ? customChildren : await getList();
  root.children = result.map((obj) => obj.name);
  const gigaFolder = nestedList(root, result).childNodes[1];
  gigaFolder.classList.add("gigaFolder");
  while (listContainer.firstChild) {
    listContainer.firstChild.remove();
  }
  listContainer.appendChild(gigaFolder);
  if (!gigaFolder.firstChild) {
    gigaFolder.classList.add("emptyTree");
    gigaFolder.innerHTML =
      "<span class = 'leaves'>🍃</span><span>No results</span>";
  }
  if (!customChildren) {
    appendUploads();
  }
  if (!customChildren) {
    searchBar.value = "";
  }

  // TODO: look at this
  nestedBooks.forEach(() => {
    for (const node of gigaFolder.childNodes) {
      if (nestedBooks.has(node.firstChild.getAttribute("data-bookname"))) {
        node.remove();
        break;
      }
    }
  });
}

// cache the list in memory for any functions that need a list of notebooks
let listInMemory = [];
let imageList = [];

async function getList() {
  if (!listInMemory) {
    await updateList();
  }
  return listInMemory;
}

async function updateList() {
  const list = await fetch("/api/get/list");
  const json = await list.json();
  listInMemory = json.data;
  createList();
}

function nestedList(obj, allNotes) {
  if (obj.parents.length > 0) {
    nestedBooks.add(obj.name);
  }
  const folder = document.createElement("div");
  folder.setAttribute("data-bookname", obj.name);
  folder.classList.add("item");
  const folderName = document.createElement("button");
  folderName.setAttribute("data-bookname", obj.name);
  folderName.classList.add("folderName");
  folderName.addEventListener("contextmenu", listContextMenu);
  listHandlers.push({
    element: folderName,
    type: "contextmenu",
    listener: listContextMenu,
  });
  folderName.addEventListener("click", dropWrapper);
  listHandlers.push({
    element: folderName,
    type: "click",
    listener: dropWrapper,
  });
  folderName.innerText = obj.name;
  folder.appendChild(folderName);
  const ul = document.createElement("ul");
  folder.appendChild(ul);
  for (let i = 0, n = obj.excerpt.length; i < n; i++) {
    const li = document.createElement("li");
    const a = document.createElement("button");
    a.classList.add("listPage");
    a.setAttribute("data-page", i);
    a.setAttribute("data-bookname", obj.name);
    a.addEventListener("click", switchTab);
    listHandlers.push({ element: a, type: "click", listener: switchTab });
    // }
    if (!obj.excerpt[i]) {
      a.innerHTML = "<i>Empty Page</i>";
    } else if (obj.isEncrypted) {
      a.innerHTML = "<i>Encrypted Page</i>";
    } else {
      a.innerText = obj.excerpt[i];
    }
    a.addEventListener("contextmenu", showPagePreview);
    listHandlers.push({
      element: a,
      type: "contextmenu",
      listener: showPagePreview,
    });
    li.appendChild(a);
    ul.appendChild(li);
  }
  if (obj.children.length > 0) {
    obj.children.forEach((childName) => {
      const li = document.createElement("li");
      try {
        li.appendChild(
          nestedList(
            allNotes.find((obj) => obj.name === childName),
            allNotes
          )
        );
        ul.prepend(li);
      } catch (err) {
        console.log(err);
      }
    });
  }
  if (droppedFolders.has(obj.name)) {
    folderName.setAttribute("data-down", "");
    ul.style.display = "flex";
    folderName.classList.add("down");
  }
  folder.appendChild(ul);
  return folder;
}

function showImagePreview(e) {
  showPagePreview(e, `![](${this.getAttribute("data-href")})`);
}

async function appendUploads() {
  const images = await fetch("/api/get/image-list");
  if (!images.ok) {
    notyf.error("An error occurred when creating the image-list");
    return;
  }
  const json = await images.json();
  const result = json["data"];
  imageList = result;
  const ul = uploadFolder.nextSibling.nextSibling;
  uploadFolder.setAttribute("data-children", imageList.length);
  while (ul.firstChild) {
    ul.firstChild.remove();
  }
  imageList.map((file, i) => {
    const a = document.createElement("button");
    a.classList.add("listPage");
    a.addEventListener("contextmenu", showImagePreview);
    listHandlers.push({
      element: a,
      type: "contextmenu",
      listener: showImagePreview,
    });
    a.setAttribute("data-href", `/uploads/${file}`);
    a.setAttribute("data-bookname", "Your-Uploads");
    a.setAttribute("data-page", i);
    a.innerText = file;
    a.addEventListener("click", switchTab);
    const li = document.createElement("li");
    li.appendChild(a);
    ul.appendChild(li);
  });
  silentReset("Your-Uploads")
}

async function search() {
  if (this.value) {
    const text = this.value;
    const results = await fetch(`/api/fuzzy/${text}`);
    if (results.ok) {
      const json = await results.json();
      const tempChildren = json.data.map((e) => {
        return {
          name: e.item.name,
          excerpt: e.item.content.map((e) => removeMD(e.split("\n")[0])),
          children: [],
          parents: [],
        };
      });
      createList(tempChildren);
    }
  } else {
    createList();
  }
}

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
  bottomLeftGeneralInfo.style.left = "25px";
  list.removeAttribute("data-shown");
  localStorage.setItem("/listShown", "false");
}

function showList() {
  list.style.display = "flex";
  border.style.display = "inline";
  tabs.style.padding = "5px 5px 5px 0";
  workspace.style.width = `calc(100% - 25px - ${
    localStorage.getItem("/listSize") || "300px"
  })`;
  bottomLeftGeneralInfo.style.left =
    parseInt(localStorage.getItem("/listSize") || 300) + 25 + "px";
  list.setAttribute("data-shown", "");
  localStorage.setItem("/listShown", "true");
}

var toggleList = () =>
  list.hasAttribute("data-shown") ? hideList() : showList();

// this is messy
function listContextMenu(e, toolBar) {
  contextMenu(
    e,
    [
      toolBar
        ? {
            text: "Open Notebook",
            click: function () {
              cmInput(note.name, "open");
            },
          }
        : {
            attr: this.getAttribute("data-bookname"),
            text: "Open Notebook",
            click: function () {
              switchNote(this.getAttribute("data-props"));
              delContextMenu();
            },
          },
      toolBar
        ? null
        : {
            attr: this.getAttribute("data-bookname"),
            text: "Open & Close Current Tab",
            click: function () {
              closeTab(note.name, {
                refresh: true,
                goto: this.getAttribute("data-props"),
                page: 0,
              });
              delContextMenu();
            },
          },
      { spacer: true },
      {
        attr: toolBar ? note.name : this.getAttribute("data-bookname"),
        text: "Rename Notebook",
        click: function () {
          cmInput(
            this.getAttribute("data-props"),
            "rename"
          );
        },
      },
      {
        attr: toolBar ? note.name : this.getAttribute("data-bookname"),
        text: "Copy Notebook",
        click: function () {
          cmInput(this.getAttribute("data-props"), "copy");
        },
      },
      toolBar
        ? null
        : {
            attr: toolBar ? "" : this.getAttribute("data-bookname"),
            text: "Delete Notebook",
            click: function () {
              confirmation_cm(this, () =>
                deleteNoteBookFromDb(
                  toolBar ? note.name : this.getAttribute("data-props")
                )
              );
            },
          },
      { spacer: true },
      {
        attr: toolBar ? "" : this.getAttribute("data-bookname"),
        text: "Nest Notebook",
        click: async function (e) {
          beginAsyncCM();
          const noteName = toolBar
            ? note.name
            : this.getAttribute("data-props");
          const family = await getFamily(noteName);
          const json = await getList();
          const buttons = json.reduce((arr, e) => {
            if (e.name !== noteName && !family.includes(e.name)) {
              arr.push({
                text: e.name,
                click: () => {
                  nestNote(noteName, e.name);
                  delContextMenu();
                },
              });
            }
            return arr;
          }, []);
          asyncContextMenu(e, buttons, "resample");
        },
      },
      {
        attr: toolBar ? "" : this.getAttribute("data-bookname"),
        text: "Relinquish Notebook",
        click: async function () {
          beginAsyncCM();
          const noteName = toolBar
            ? note.name
            : this.getAttribute("data-props");
          const buttons = (await getAnyBookContent(noteName, "parents")).map(
            (parent) => {
              return {
                text: parent,
                click: () => {
                  relinquishNote(noteName, parent);
                  delContextMenu();
                },
              };
            }
          );
          asyncContextMenu(e, buttons, "resample");
        },
      },
      {
        attr: toolBar ? note.name : this.getAttribute("data-bookname"),
        text: "Create Child",
        click: function () {
          cmInput(
            this.getAttribute("data-props"),
            "child"
          );
        },
      },
      { spacer: true },
      {
        attr: toolBar ? note.name : this.getAttribute("data-bookname"),
        text: "Force Update",
        click: function () {
          confirmation_cm(this, () => {
            forceUpdateNotes(this.getAttribute("data-props"));
          })
        },
      },
    ],
    toolBar ? [`${e.clientX - 160}px`, "75px"] : null
  );
}

// page preview
async function showPagePreview(e, customText, allowHTML) {
  e.preventDefault();
  e.stopPropagation();
  const leftAmount =
    e.currentTarget.id.slice(0, "whereTo".length) === "whereTo"
      ? 30
      : parseInt(list.style.width) + 30;
  const page = e.currentTarget.getAttribute("data-page");
  const menu = document.createElement("div");
  menu.classList.add("listPreview");
  menu.style.left = `${leftAmount}px`;
  menu.style.top =
    e.clientY + 340 <= window.innerHeight
      ? `${e.clientY}px`
      : "calc(100vh - 340px)";
  const preview = document.createElement("div");
  preview.classList.add("pagePreviewContainer");
  if (customText && allowHTML) {
    preview.innerHTML = customText;
  } else if (customText && !allowHTML) {
    preview.innerHTML = format(customText);
  } else {
    preview.innerHTML = format(
      (
        await getAnyBookContent(
          e.currentTarget.getAttribute("data-bookname"),
          "content"
        )
      )[page]
    );
  }
  menu.appendChild(preview);
  abnormalContextMenu(menu);
}
