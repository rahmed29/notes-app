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
// If you edit something in here, make sure to update the excludedNames and unsaveableNames in server.js
const reservedNames = [
  {
    data: {
      name: "home",
      content: [],
      reservedData: {
        beforeOpen: () => {
          // update the home page to show accurate information
          editReserved(
            "home",
            "# 🏠 Welcome Home!\n\nUse the __tree list__, the __toolbar__, the :ref[Note-Map|Note Map], or the __command palette__ *(Ctrl + Space)* to open a new/existing notebook!" +
              "\n\n## Recent Notes\n\n" +
              (getSetting("recents", [])
                .map((e) => `- :ref[${e}]`)
                .join("\n") || "- N/A") +
              `\n\n## Recent Tags\n\n` +
              (getSetting("recents_tags", [])
                .map((e) => `- :tag[${e}]`)
                .join("\n") || "- N/A\n"),
          );
        },
      },
    },
  },
  {
    data: {
      name: "mobile_home",
      content: [
        "# 🏠 Welcome Home!\n\n### ⚠️ WIP\n\nThis is the **mobile version**. Notes are read only as of right now!\n\nTap the button in the **bottom-right** corner to access the :ref[Note-Map|Note Map] at any time and move between notebooks!\n\n---\n\n![](/assets/wip.jpg)",
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
      reservedData: {
        reservedButPageNavAllowed: true,
        beforeOpen: () => {
          // update the list of images in the image preview notebook
          editReserved(
            "Your-Uploads",
            imageList.length
              ? imageList.map((url) => {
                  return `${properLink(url)}(/uploads/${url})`;
                })
              : ["# Uploaded images and PDFs will appear in this notebook!"],
          );
        },
      },
    },
  },
  {
    data: {
      name: "Note-Map",
      content: ["# Note Map\n\n:fdg[]"],
    },
  },
  {
    data: {
      name: "__god",
      content: [
        "# Sorry!\n\nThis notebook is reserved for storing important information!",
      ],
    },
  },
  {
    data: {
      name: "Tag-Viewer",
      content: ["# 🏷️ Tag Viewer\n\n---\n\n"],
      reservedData: {
        afterOpen: async (tag) => {
          const content = await getTags(tag);
          editReserved("Tag-Viewer", content);
          accents(false);
        },
      },
    },
  },
  {
    data: {
      name: "Public-Notebook",
      content: [
        "# Sorry!\n\nThis notebook is reserved for viewing public notebooks.",
      ],
      reservedData: {
        reservedButPageNavAllowed: true,
        afterOpen: () => {
          if (currentlyOpenPublicBook) {
            editTabText(
              "Public-Notebook",
              `${currentlyOpenPublicBook[0]} (${currentlyOpenPublicBook[1]})`,
              true,
            );
          }
        },
      },
    },
  },
];
