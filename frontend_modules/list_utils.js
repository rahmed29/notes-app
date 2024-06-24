import {
  mainContainer,
  toolBar,
  listContainer,
  list,
  uploadFolder,
  workspace,
  border,
  tabs,
  bottomLeftGeneralInfo,
  topLeftPageNumber,
} from "../main";
import { contextMenu, delContextMenu } from "./context_menu";
import {
  switchNote,
  deleteNoteBookFromDb,
  getAnyBookContent,
  reservedNames,
  note,
  copyBook,
} from "./note_utils";
import { format, removeMD } from "./text_formatting";
import { switchTab } from "./tabs";
import { getFamily, nestNote, relinquishNote, createChild } from "./hierarchy";
import { jumpToDesiredPage } from "./dom_formatting";
import { eid } from "./dom_utils";

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
  scrollCM,
  listInMemory,
  listContextMenu,
  showMorePages,
};

let listHandlers = [];

// variable for the tree list
let nestedBooks = null;
const droppedFolders = new Set(
  JSON.parse(localStorage.getItem("/fileStructure")) || []
);
const root = {
  name: "_root",
  children: [],
  excerpt: [],
  parents: [],
};

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
  contextMenu(e, buttons, ["21px", `${topLeftPageNumber.scrollHeight + 5}px`]);
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
  const arrayFromSet = Array.from(droppedFolders);
  localStorage.setItem("/fileStructure", JSON.stringify(arrayFromSet));
}

async function createList() {
  nestedBooks = new Set();
  listHandlers = listHandlers.reduce((arr, { element, type, listener }) => {
    element.removeEventListener(type, listener);
    return arr;
  }, []);
  const result = (await getList()).sort((a, b) => {
    const date1 = a.name;
    const date2 = b.name;
    if (date1 < date2) {
      return;
    }
    if (date1 > date1) {
      return -1;
    }
    // names must be equal
    return;
  });
  root.children = result.map((obj) => obj.name);
  const gigaFolder = nestedList(root, result).childNodes[1];
  gigaFolder.classList.add("gigaFolder");
  while (listContainer.firstChild) {
    listContainer.firstChild.remove();
  }
  listContainer.appendChild(gigaFolder);
  appendUploads();

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
let listInMemory = null;

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
  const folderName = document.createElement("div");
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
    const a = document.createElement("a");
    a.setAttribute("data-page", i);
    a.setAttribute("data-bookname", obj.name);
    a.addEventListener("click", switchTab);
    listHandlers.push({ element: a, type: "click", listener: switchTab });
    // }
    if (!removeMD(obj.excerpt[i])) {
      a.innerHTML = "<i>Empty Page</i>";
    } else if (obj.isEncrypted) {
      a.innerHTML = "<i>Encrypted Page</i>";
    } else {
      a.innerText = removeMD(obj.excerpt[i]);
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

function goToImagePreview() {
  const occ = Object.entries(localStorage).reduce((str, [key, value]) => {
    if (JSON.stringify(value).includes(this.getAttribute("data-href"))) {
      str += `- :ref[${key}]\n`;
    }
    return str;
  }, "**Occurrences in local storage:**\n");
  reservedNames.find((e) => e.data.name === "Image-Preview").data.content = [
    `![](${this.getAttribute("data-href")})\n\n${occ}`,
  ];
  switchNote("Image-Preview");
}

async function appendUploads() {
  const images = await fetch("/api/get/image-list");
  if (!images.ok) {
    notyf.error("An error occurred when creating the image-list");
    return;
  }
  const json2 = await images.json();
  const result2 = json2["data"];
  const ul = uploadFolder.nextSibling.nextSibling;
  uploadFolder.setAttribute("data-children", result2.length);
  while (ul.firstChild) {
    ul.firstChild.remove();
  }
  result2.forEach((file) => {
    const a = document.createElement("a");
    a.addEventListener("contextmenu", showImagePreview);
    listHandlers.push({
      element: a,
      type: "mouseenter",
      listener: showImagePreview,
    });
    a.setAttribute("data-href", `/uploads/${file}`);
    a.innerText = file;
    a.addEventListener("click", goToImagePreview);
    const li = document.createElement("li");
    li.appendChild(a);
    ul.appendChild(li);
  });
}

async function search(term) {
  for (const item of listContainer.firstChild.childNodes) {
    const folder = item.firstChild;
    const name = folder.getAttribute("data-bookname");
    let fam = await getFamily(name)
    fam.push(name)
    fam = JSON.stringify(fam).toLowerCase()
    if (!fam.includes(term.toLowerCase()) && term) {
      folder.style.display = "none";
    } else {
      folder.style.display = "inline-block"
    }
  }
}

function resizeList(e) {
  border.classList.add("currPage");
  document.body.style.cursor = "w-resize";
  if (e.clientX <= 600 && e.clientX >= 300) {
    list.style.width = `${e.clientX - 16}px`;
    workspace.style.width = `calc(100% - 25px - ${e.clientX - 16}px)`;
    bottomLeftGeneralInfo.style.left = `${e.clientX - 16 + 25}px`;
  }
}

function hideList() {
  workspace.style.width = "calc(100% - 20px";
  bottomLeftGeneralInfo.style.left = "25px";
  list.style.display = "none";
  list.removeAttribute("data-shown");
  border.style.display = "none";
  tabs.style.marginLeft = "0px";
  localStorage.setItem("/listShown", "false");
}

function showList() {
  workspace.style.width = `calc(100% - 25px - ${
    localStorage.getItem("/listSize") || "300px"
  })`;
  bottomLeftGeneralInfo.style.left =
    parseInt(localStorage.getItem("/listSize") || 300) + 25 + "px";
  list.setAttribute("data-shown", "");
  list.style.display = "flex";
  border.style.display = "inline";
  tabs.style.marginLeft = "-5px";
  localStorage.setItem("/listShown", "true");
}

var toggleList = () =>
  list.hasAttribute("data-shown") ? hideList() : showList();

function listContextMenu(e, toolBar) {
  function cmInput(ele, noteName, placeholder, choice) {
    let hasTyped = false;
    const storeHTML = ele.innerHTML;
    ele.classList.add("currPage");
    ele.style.fontStyle = "italic";
    ele.innerText = placeholder;
    ele.contentEditable = true;
    ele.focus();
    ele.addEventListener(
      "beforeinput",
      function () {
        hasTyped = true;
        ele.innerText = "";
      },
      { once: true }
    );
    ele.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        e.stopImmediatePropagation();
        e.stopPropagation();
        ele.contentEditable = false;
        if (hasTyped) {
          switch (choice) {
            case "open":
              switchNote(ele.innerText.replaceAll("\n", ""));
              break;
            case "copy":
              copyBook(ele.innerText.replaceAll("\n", ""), noteName);
              break;
            case "child":
              createChild(noteName, ele.innerText.replaceAll("\n", ""));
          }
          delContextMenu();
        } else {
          delContextMenu();
        }
      } else if (e.key === "Escape") {
        delContextMenu();
      }
    });
    ele.addEventListener(
      "blur",
      function () {
        ele.contentEditable = false;
        ele.innerHTML = storeHTML;
        ele.classList.remove("currPage");
        ele.style.fontStyle = "inherit";
        ele.innerText = "Open Notebook";
      },
      { once: true }
    );
  }

  contextMenu(
    e,
    [
      toolBar
        ? {
            text: "Open Notebook",
            click: function () {
              cmInput(this, note.name, "Enter a book name", "open");
            },
            appearance: "ios",
          }
        : {
            attr: this.getAttribute("data-bookname"),
            text: "Open Notebook",
            click: function () {
              switchNote(this.getAttribute("data-props"));
              delContextMenu();
            },
            appearance: "ios",
          },
      toolBar
        ? null
        : {
            attr: toolBar ? "" : this.getAttribute("data-bookname"),
            text: "Delete Notebook",
            click: function () {
              this.innerText = "Confirm";
              this.classList.add("rios");
              this.addEventListener(
                "click",
                function () {
                  deleteNoteBookFromDb(
                    toolBar ? note.name : this.getAttribute("data-props")
                  );
                  delContextMenu();
                },
                { once: true }
              );
            },
            appearance: "ios",
          },
      {
        attr: toolBar ? "" : this.getAttribute("data-bookname"),
        text: "Relinquish Notebook",
        click: async function () {
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
                appearance: "ios",
              };
            }
          );
          contextMenu(e, buttons, [
            eid("contextMenu").style.left,
            eid("contextMenu").style.top,
          ]);
        },
        appearance: "ios",
      },
      {
        attr: toolBar ? "" : this.getAttribute("data-bookname"),
        text: "Nest Notebook",
        click: async function (e) {
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
                appearance: "ios",
              });
            }
            return arr;
          }, []);
          contextMenu(e, buttons, [
            eid("contextMenu").style.left,
            eid("contextMenu").style.top,
          ]);
        },
        appearance: "ios",
      },
      {
        attr: toolBar ? note.name : this.getAttribute("data-bookname"),
        text: "Create Child",
        click: function () {
          cmInput(
            this,
            this.getAttribute("data-props"),
            "Enter a child name",
            "child"
          );
        },
        appearance: "ios",
      },
      {
        attr: toolBar ? note.name : this.getAttribute("data-bookname"),
        text: "Copy Notebook",
        click: function () {
          cmInput(
            this,
            this.getAttribute("data-props"),
            "Enter a copy name",
            "copy"
          );
        },
        appearance: "ios",
      },
    ],
    toolBar ? [`${e.clientX - 160}px`, "75px"] : null
  );
}

// page preview
async function showPagePreview(e, customText) {
  e.preventDefault();
  e.stopPropagation();
  delContextMenu();
  const leftAmount =
    e.currentTarget.id.slice(0, "whereTo".length) === "whereTo"
      ? 30
      : parseInt(list.style.width) + 30;
  const page = e.currentTarget.getAttribute("data-page");
  const menu = document.createElement("div");
  menu.id = "contextMenu";
  menu.classList.add("listPreview");
  menu.style.left = `${leftAmount}px`;
  menu.style.top =
    e.clientY + 340 <= window.innerHeight
      ? `${e.clientY}px`
      : "calc(100vh - 340px)";
  const preview = document.createElement("div");
  preview.classList.add("pagePreviewContainer");
  preview.innerHTML = customText
    ? format(customText)
    : format(
        (
          await getAnyBookContent(
            e.currentTarget.getAttribute("data-bookname"),
            "content"
          )
        )[page]
      );
  menu.appendChild(preview);
  mainContainer.after(menu);
  mainContainer.addEventListener("click", delContextMenu, { once: true });
  mainContainer.addEventListener("contextmenu", delContextMenu, { once: true });
  toolBar.addEventListener("click", delContextMenu, { once: true });
  toolBar.addEventListener("contextmenu", delContextMenu, { once: true });
}

function scrollCM(e) {
  eid("contextMenu").firstChild.scroll({
    top: eid("contextMenu").firstChild.scrollTop + e.deltaY,
  });
}
