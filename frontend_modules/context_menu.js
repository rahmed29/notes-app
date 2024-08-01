import {
  mainContainer,
  toolBar,
  bottomRightTools,
} from "./important_stuff/dom_refs";
import { attemptRemoval } from "./dom_utils";

export {
  contextMenu,
  beginAsyncCM,
  asyncContextMenu,
  abnormalContextMenu,
  delContextMenu,
  confirmation_cm,
  scrollCM,
};

let async_cm_incoming = false;
let cm_ref = null;

function confirmation_cm(ele, func) {
  ele.innerText = "Confirm";
  ele.classList.remove("ios");
  ele.classList.add("rios");
  ele.addEventListener(
    "click",
    () => {
      func();
      delContextMenu();
    },
    { once: true }
  );
}

function delContextMenu() {
  async_cm_incoming = false;
  attemptRemoval([cm_ref]);
  document.body.classList.remove("cmOpen");
  mainContainer.removeEventListener("click", delContextMenu);
  mainContainer.removeEventListener("contextmenu", delContextMenu);
  toolBar.removeEventListener("click", delContextMenu);
  toolBar.removeEventListener("contextmenu", delContextMenu);
  bottomRightTools.removeEventListener("click", delContextMenu);
  bottomRightTools.removeEventListener("contextmenu", delContextMenu);
}

function abnormalContextMenu(ele) {
  ele.id = "contextMenu";
  delContextMenu();
  if (ele.firstChild) {
    mainContainer.after(ele);
    cm_ref = ele;
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

function beginAsyncCM() {
  async_cm_incoming = true;
}

function asyncContextMenu(e, buttons, position, noAnimation) {
  if (async_cm_incoming) {
    async_cm_incoming = false;
    contextMenu(e, buttons, position, noAnimation);
  }
}

function contextMenu(e, buttons, position, noAnimation) {
  if (async_cm_incoming) {
    return;
  }
  if (position === "resample") {
    position = [cm_ref.style.left, cm_ref.style.top];
  }
  e.preventDefault();
  e.stopPropagation();
  delContextMenu();
  document.body.classList.add("cmOpen");
  const menu = document.createElement("div");
  menu.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      delContextMenu();
    }
  });
  menu.addEventListener("contextmenu", (e) => e.preventDefault());
  menu.id = "contextMenu";
  menu.tabIndex = 0;
  // for keyboard navigation
  if (!e.clientX && !e.clientY) {
    const rect = e.target.getBoundingClientRect();
    menu.style.left = `${rect.left}px`;
    menu.style.top = `${rect.top}px`;
  } else if (position && position.length == 2) {
    menu.style.left = position[0];
    menu.style.top = position[1];
  } else {
    menu.style.left = `${e.clientX}px`;
    menu.style.top = `${e.clientY}px`;
  }
  buttons.forEach((option) => {
    if (option) {
      if (option.spacer) {
        const spacer = document.createElement("div");
        spacer.classList.add("spacer");
        menu.appendChild(spacer);
        return;
      }
      const item = document.createElement("button");
      if (option.attr) {
        item.setAttribute("data-props", option.attr);
      }
      item.classList.add("contextMenuItem");
      item.innerText = option.text;
      item.addEventListener("click", option.click);
      item.classList.add(option.appearance || "ios");
      menu.appendChild(item);
    }
  });
  if (menu.firstChild) {
    if (noAnimation) {
      menu.style.animation = "none";
    }
    mainContainer.after(menu);
    cm_ref = menu;
    menu.focus();
    // keep context menu in viewport
    if (parseInt(menu.style.top) + menu.scrollHeight >= window.innerHeight) {
      menu.style.marginTop = `-${menu.scrollHeight}px`;
      menu.style.transformOrigin = "bottom";
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

function scrollCM(e) {
  cm_ref.firstChild.scroll({
    top: cm_ref.firstChild.scrollTop + e.deltaY,
  });
}
