import { imageList } from "./list";
import library from "./library";
import { editTabText } from "../tabs";
import { currentlyOpenPublicBook } from "../publishing";
import { getSetting } from "../important_stuff/settings";
import { properLink } from "../data_utils";
import { accents } from "../dom_formatting";
import { getTags } from "../tags";

export { editReserved, reserved, reservedNames };

function editReserved(name, content) {
  if (!Array.isArray(content)) {
    content = [content];
  }
  reservedNames.find((e) => e.data.name === name).data.content = content;
  const possibleBook = library.get(name);
  if (possibleBook) {
    possibleBook.content = content;
    possibleBook.aceSessions = [];
  }
}

function reserved(name) {
  return reservedNames.some((e) => e.data.name === name);
}

// notebook names that aren't allowed because they are being used for other stuff
const reservedNames = [
  {
    data: {
      name: "home",
      content: [
        "# 🏠 Welcome Home!\n\nUse the __tree list__, the __toolbar__, the __note map__, or the __command palette__ *(Ctrl + Space)* to open a new/existing notebook!",
      ],
      beforeOpen: () => {
        // update the home page to show accurate information
        editReserved("home", [
          `# 🏠 Welcome Home!\n\nUse the __tree list__, the __toolbar__, the __note map__, or the __command palette__ *(Ctrl + Space)* to open a new/existing notebook!\n\n__Recent Notes__\n\n${
            // get the recent notes from local storage and reduce them to a single markdown list
            getSetting("recents", []).reduce((str, e) => {
              str += `- :ref[${e}]\n`;
              return str;
            }, "")
          }`,
        ]);
      },
    },
  },
  {
    data: {
      name: "todo__list",
      content: [
        "# Sorry!\n\nThis notebook is reserved for storing your todo data. Sorry!",
      ],
    },
  },
  {
    data: {
      name: "sticky__notes",
      content: [
        "# Sorry!\n\nThis notebook is reserved for storing your scratch pad content",
      ],
    },
  },
  {
    data: {
      name: "flash__cards",
      content: [
        "# Sorry!\n\nThis notebook is reserved for storing your flashcard data.",
      ],
    },
  },
  {
    data: {
      name: "AI-Summary",
      content: [
        "# Sorry!\n\nThis notebook is reserved for displaying AI Summaries.",
      ],
    },
  },
  {
    data: {
      name: "Your-Uploads",
      content: [
        "# Sorry\n\nThis notebook name is reserved for previewing uploaded images.",
      ],
      beforeOpen: () => {
        // update the list of images in the image preview notebook
        editReserved(
          "Your-Uploads",
          imageList.map((url) => {
            return `${properLink(url)}(/uploads/${url})`;
          })
        );
      },
    },
  },
  {
    data: {
      name: "Note-Map",
      content: ["# Note-Map\n\n:fdg[]"],
    },
  },
  {
    data: {
      name: "Tag-Viewer",
      content: ["# 🏷️ Tag Viewer\n\n---\n\n"],
      afterOpen: async (tag) => {
        const content = await getTags(tag);
        editReserved("Tag-Viewer", content);
        accents(false);
      },
    },
  },
  {
    data: {
      name: "Public-Notebook",
      content: ["This notebook is reserved for viewing public notebooks"],
      afterOpen: () => {
        if (currentlyOpenPublicBook) {
          editTabText(
            "Public-Notebook",
            `${currentlyOpenPublicBook[0]} (${currentlyOpenPublicBook[1]})`,
            true
          );
        }
      },
    },
  },
];
