import { switchNote } from "../note_utils";
import { createPalette } from "./cmd";

export { searchTag };

function searchTag() {
  createPalette(
    "Enter a tag name",
    (results, text, render) => {
      render(
        2,
        [
          {
            name: text,
            icon: "🏷️",
            handler: () => {
              switchNote("Tag-Viewer", {
                props: text,
              });
            },
          },
        ],
        results
      );
    },
    null,
    false
  );
}
