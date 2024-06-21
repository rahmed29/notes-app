import { mainContainer, toolBar, bottomRightTools } from "../main";
import { attemptRemoval } from "./dom_utils";

export { contextMenu, delContextMenu };

// takes in an event object, an array of objects representing items in the context menu, and optionally an array representing a x and y coordinate for the context menu to be located

function delContextMenu() {
  attemptRemoval([document.getElementById("contextMenu")])
  mainContainer.removeEventListener("click", delContextMenu);
  mainContainer.removeEventListener("contextmenu", delContextMenu);
  toolBar.removeEventListener("click", delContextMenu);
  toolBar.removeEventListener("contextmenu", delContextMenu);
  bottomRightTools.removeEventListener("click", delContextMenu);
  bottomRightTools.removeEventListener("contextmenu", delContextMenu);
}

function contextMenu(e, button, position) {
  e.preventDefault();
  e.stopPropagation();
  delContextMenu();
  const menu = document.createElement("div");
  menu.addEventListener("contextmenu", (e) => e.preventDefault());
  menu.id = "contextMenu";
  if (position && position.length == 2) {
    menu.style.left = position[0];
    menu.style.top = position[1];
  } else {
    menu.style.left = `${e.clientX}px`;
    menu.style.top = `${e.clientY}px`;
  }
  button.forEach((option) => {
    if (option) {
      const item = document.createElement("div");
      if (option.attr) {
        item.setAttribute("data-props", option.attr);
      }
      item.classList.add("contextMenuItem");
      item.innerText = option.text;
      item.addEventListener("click", option.click);
      item.classList.add(option.appearance);
      menu.appendChild(item);
    }
  });
  if (menu.firstChild) {
    mainContainer.after(menu);
    // keep context menu in viewport
    if (parseInt(menu.style.top) + menu.scrollHeight >= window.innerHeight) {
      menu.style.marginTop = `-${menu.scrollHeight}px`;
    }
    if (parseInt(menu.style.left) + menu.scrollWidth >= window.innerWidth) {
      menu.style.marginLeft = `-${menu.scrollWidth}px`;
    }
    mainContainer.addEventListener("click", delContextMenu, { once: true });
    mainContainer.addEventListener("contextmenu", delContextMenu, {
      once: true, 
    });
    toolBar.addEventListener("click", delContextMenu, { once: true });
    toolBar.addEventListener("contextmenu", delContextMenu, { once: true });
    bottomRightTools.addEventListener("click", delContextMenu, { once: true });
    bottomRightTools.addEventListener("contextmenu", delContextMenu, {
      once: true,
    });
  }
}
