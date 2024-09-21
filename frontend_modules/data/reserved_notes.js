import { imageList } from "./list";
import { library } from "./library";
import { editTabText } from "../tabs";
import { currentlyOpenPublicBook } from "../publishing";
import { getSetting } from "../important_stuff/settings";

export { editReserved, reserved, reservedNames };

function editReserved(name, content) {
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
      content: [],
      beforeOpen: [
        () => {
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
      ],
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
        "This notebook is reserved for storing your scratch pad content. Sorry!",
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
        "# Sorry\nnThis notebook name is reserved for previewing uploaded images.",
      ],
      beforeOpen: [
        () => {
          // update the list of images in the image preview notebook
          editReserved(
            "Your-Uploads",
            imageList.map((url) => {
              return `![User Uploaded Image](/uploads/${url})`;
            })
          );
        },
      ],
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
      name: "Shared-Notebook",
      content: ["This notebook is reserved for viewing public notebooks"],
      beforeOpen: [
        () => {
          if (currentlyOpenPublicBook) {
            editTabText(
              "Shared-Notebook",
              `${currentlyOpenPublicBook[0]} (${currentlyOpenPublicBook[1]})`
            );
          }
        },
      ],
      afterOpen: [
        () => {
          if (currentlyOpenPublicBook) {
            editTabText(
              "Shared-Notebook",
              `${currentlyOpenPublicBook[0]} (${currentlyOpenPublicBook[1]})`
            );
          }
        },
      ],
    },
  },
];
