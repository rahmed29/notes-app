import "tippy.js/dist/tippy.css";
import tippy from "tippy.js";
import "tippy.js/themes/light.css";
import "tippy.js/animations/shift-toward-subtle.css";
import { brain } from "./dom_refs";
import { getSetting } from "./settings";
export {
  wikipediaTippy,
  synced,
  generalInfoPageNumber,
  editingModeTippy,
  setupToolTips,
};

let wikipediaTippy;
let synced;
let generalInfoPageNumber;
let editingModeTippy;

function setupToolTips() {
  wikipediaTippy = tippy([brain], {
    animation: "shift-toward-subtle",
    arrow: false,
    content: `<div id = 'brain' style = 'width: auto;'>Info on highlighted text will appear here</div>`,
    interactive: true,
    allowHTML: true,
    maxWidth: "500px",
    placement: "bottom-end",
  })[0];

  synced = tippy("#areNotesSavedIcon", {
    animation: "shift-toward-subtle",
    arrow: false,
    content: "Notes are saved",
    placement: "bottom-end",
  })[0];

  editingModeTippy = tippy("#generalInfoViewMode", {
    animation: "shift-toward-subtle",
    arrow: false,
    content: getSetting("viewPref", "?"),
    placement: "top",
  })[0];

  generalInfoPageNumber = tippy("#generalInfoPageNumber", {
    animation: "shift-toward-subtle",
    arrow: false,
    content: "Loading",
    placement: "top",
  })[0];

  const anonTooltips = [
    {
      name: "#icon1",
      content: "Save (Ctrl + S)",
    },
    {
      name: "#icon2",
      content: "Notebook",
    },
    {
      name: "#icon3",
      content: "Delete",
    },
    {
      name: "#icon4",
      content: "Insert File",
    },
    {
      name: "#icon5",
      content: "Switch View (Ctrl + E)",
    },
    {
      name: "#icon6",
      content: "Prev Page",
    },
    {
      name: "#icon7",
      content: "Next Page",
    },
    {
      name: "#wordCount",
      content: "Word Count",
    },
    {
      name: "#letterCount",
      content: "Character Count",
    },
    {
      name: "#openCommandPal",
      content: "Command Palette",
    },
    {
      name: "#autoSaveSpinner",
      content: "Auto Saving is on",
    },
    {
      name: "#goHome",
      content: "Quick Access",
    },
    {
      name: "#newPage",
      content: "New Page",
    },
    {
      name: "#vaultDetails",
      content:
        "This notebook will be encrypted with your pass-word before being sent to the server. Unsaved changes will <b>NOT</b> be saved locally.",
    },
  ];

  anonTooltips.forEach((obj) =>
    tippy(obj.name, {
      arrow: false,
      allowHTML: true,
      animation: "shift-toward-subtle",
      content: obj.content,
      placement: "bottom",
    }),
  );
}
