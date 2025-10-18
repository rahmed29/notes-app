import {
  listContainer,
  list,
  uploadFolder,
  topLeftPageNumber,
  searchBar,
} from "./important_stuff/dom_refs";
import {
  abnormalContextMenu,
  contextMenu,
  delContextMenu,
} from "./context_menu";
import getAnyBookContent from "./get_book_content";
import format from "./micromark_directives";
import { switchTab, silentReset } from "./tabs";
import { formatNonText, jumpToDesiredPage } from "./dom_formatting";
import { getTitle } from "../shared_modules/removeMD";
import { listContextMenu } from "./modify_note_context_menu";
import { note } from "./data/note";
import {
  listInMemory,
  imageList,
  setListInMemory,
  setImageList,
} from "./data/list";
import { setInnerHTML } from "./dom_utils";
import { changeSettings, getSetting } from "./important_stuff/settings";
import { properLink } from "./data_utils";
import notes_api from "./important_stuff/api";

export {
  updateList,
  search,
  showPagePreview,
  showMorePages,
  renameDropped,
  removeDropped,
  removeSpecificDropped,
};

const listHandlers = [];
const imageListHandlers = [];

// variable for the tree list
let nestedBooks;
const droppedFolders = getSetting("fileStructure", []);
const root = {
  name: "$root",
  children: [],
  excerpt: [],
  parents: [],
};

function renameDropped(oldName, newName) {
  droppedFolders.forEach((e) => {
    if (e.name === oldName) {
      e.name = newName;
    }
    if (e.parentName === oldName) {
      e.parentName = newName;
    }
  });
  changeSettings("fileStructure", droppedFolders);
}

function removeDropped(name) {
  const index = droppedFolders.findIndex(
    (e) => e.name === name || e.parentName === name,
  );
  if (index !== -1) {
    droppedFolders.splice(index, 1);
  }
  changeSettings("fileStructure", droppedFolders);
}

function removeSpecificDropped(name, parentName) {
  const index = droppedFolders.findIndex(
    (e) => e.name === name && e.parentName === parentName,
  );
  if (index !== -1) {
    droppedFolders.splice(index, 1);
  }
  changeSettings("fileStructure", droppedFolders);
}

async function showMorePages(e) {
  const buttons = note.content.reduce((arr, e, i) => {
    if (i >= 9) {
      const appearance = i === note.pgN ? "currPage" : "random";
      arr.push({
        text: `Page ${i + 1}`,
        click: (_, __, e) => {
          jumpToDesiredPage(i);
          showMorePages(e);
        },
        appearance,
      });
    }
    return arr;
  }, []);
  contextMenu(
    e,
    buttons,
    ["21px", `${topLeftPageNumber.scrollHeight + 5}px`],
    true,
  );
}

// creating the tree list
function dropWrapper(e) {
  e.stopPropagation();
  delContextMenu();
  if (this.hasAttribute("data-down")) {
    const index = droppedFolders.findIndex(
      (e) =>
        e.name === this.parentNode.getAttribute("data-bookname") &&
        e.parentName === this.getAttribute("data-parent"),
    );
    if (index !== -1) {
      droppedFolders.splice(index, 1);
    }
    this.nextElementSibling.style.display = "none";
    this.classList.remove("down");
    this.removeAttribute("data-down");
  } else {
    if (
      !droppedFolders.find(
        (e) =>
          e.name === this.parentNode.getAttribute("data-bookname") &&
          e.parentName === this.getAttribute("data-parent"),
      )
    ) {
      droppedFolders.push({
        name: this.parentNode.getAttribute("data-bookname"),
        parentName: this.getAttribute("data-parent"),
      });
    }
    this.nextElementSibling.style.display = "flex";
    this.classList.add("down");
    this.setAttribute("data-down", "");
  }
  changeSettings("fileStructure", droppedFolders);
}

// If no custom children, that means we want the regular list
// Custom children is used to show search results
// Or, when we don't watch to refetch the image list, we can just pass the list in memory as the custom children
async function createList(customChildren, fromSearchFunc = false) {
  if (searching && !fromSearchFunc) {
    return;
  }
  listHandlers.forEach((e) => {
    e.element.removeEventListener(e.type, e.listener);
  });
  listHandlers.length = 0;
  nestedBooks = new Set();
  const result = customChildren ? customChildren : listInMemory;
  root.children = result.map((obj) => obj.name);
  const gigaFolder = nestedList(root, result).childNodes[1];
  gigaFolder.classList.add("gigaFolder");
  while (listContainer.firstChild) {
    listContainer.firstChild.remove();
  }
  listContainer.appendChild(gigaFolder);
  if (!gigaFolder.firstChild) {
    gigaFolder.classList.add("emptyTree");
    setInnerHTML(
      gigaFolder,
      "<span class = 'leaves'>🍃</span><span>No results</span>",
    );
  }
  if (!customChildren) {
    imageListHandlers.forEach((e) => {
      e.element.removeEventListener(e.type, e.listener);
    });
    imageListHandlers.length = 0;
    appendUploads();
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

// call update list to update the list in memory and the list in the DOM
// pass false to only update the list in the DOM
async function updateList(refetch = true) {
  if (!refetch) {
    createList(listInMemory);
  } else {
    const list = await notes_api.get.list();
    if (!list.ok && !listInMemory) {
      notyf.error("An error occurred when creating the list");
      createList();
      return;
    }
    const json = await list.json();
    setListInMemory(json.data);
    createList();
  }
}

function nestedList(obj, allNotes, parentName = "$root") {
  if (obj.parents.length > 0) {
    nestedBooks.add(obj.name);
  }
  const folder = document.createElement("div");
  folder.setAttribute("data-bookname", obj.name);
  folder.classList.add("item");
  const folderName = document.createElement("button");
  folderName.setAttribute("data-bookname", obj.name);
  folderName.setAttribute("data-parent", parentName);
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
    if (obj.isEncrypted) {
      a.innerHTML = "<i>Encrypted</i>";
    } else if (!obj.excerpt[i]) {
      a.innerHTML = "<i>No title</i>";
    } else {
      if (obj.excerpt[i].substring(0, 1) === "\\") {
        a.innerText = obj.excerpt[i].substring(1);
      } else {
        a.innerText = obj.excerpt[i];
      }
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
      li.appendChild(
        nestedList(
          allNotes.find((obj) => obj.name === childName),
          allNotes,
          obj.name,
        ),
      );
      ul.prepend(li);
    });
  }
  if (
    droppedFolders.find(
      (e) => e.name === obj.name && e.parentName === parentName,
    )
  ) {
    folderName.setAttribute("data-down", "");
    ul.style.display = "flex";
    folderName.classList.add("down");
  }
  folder.appendChild(ul);
  return folder;
}

function showImagePreview(e) {
  showPagePreview(
    e,
    `${properLink(this.getAttribute("data-href"))}(${this.getAttribute(
      "data-href",
    )})`,
  );
}

async function appendUploads() {
  const images = await notes_api.get.imageList();
  if (!images.ok) {
    notyf.error("An error occurred when creating the image-list");
    return;
  }
  const json = await images.json();
  setImageList(json["data"]);
  const ul = uploadFolder.nextSibling.nextSibling;
  uploadFolder.setAttribute("data-children", imageList.length);
  while (ul.firstChild) {
    ul.firstChild.remove();
  }
  imageList.map((file, i) => {
    const a = document.createElement("button");
    a.classList.add("listPage");
    a.addEventListener("contextmenu", showImagePreview);
    imageListHandlers.push({
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
  silentReset("Your-Uploads", {
    refresh: true,
  });
}

let searching = false;

async function search(value) {
  if (value) {
    const results = await notes_api.get.fuzzy(value);
    if (results.ok) {
      const json = await results.json();
      const tempChildren = json.data.map((e) => ({
        name: e.item.name,
        excerpt: e.item.content.map((e) => getTitle(e)),
        children: [],
        parents: [],
      }));
      createList(tempChildren, true);
      searching = true;
    }
  } else {
    searching = false;
    createList(listInMemory);
  }
}

// page preview
async function showPagePreview(e, customText, allowHTML) {
  e.preventDefault();
  e.stopPropagation();
  const leftAmount =
    e.currentTarget.id.substring(0, "whereTo".length) === "whereTo"
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
    setInnerHTML(preview, customText);
  } else if (customText && !allowHTML) {
    preview.innerHTML = format(customText);
  } else {
    preview.innerHTML = format(
      (
        await getAnyBookContent(
          e.currentTarget.getAttribute("data-bookname"),
          "content",
        )
      )[page],
    );
  }
  menu.appendChild(preview);
  formatNonText(preview, false);
  abnormalContextMenu(menu);
}
