import { wikipediaTippy } from "./important_stuff/tooltips";
import { wikipediaBrainAnimation } from "./important_stuff/dom_refs";
import { brain } from "./important_stuff/dom_refs";
import { note } from "./data/note";

export { toggleWikiSearch, wikiSearch, turnOffWiki, moneyAnimation };

function turnOffWiki() {
  if (brain.hasAttribute("data-disabled")) {
    toggleWikiSearch();
  }
}

// Wikipedia
function toggleWikiSearch() {
  brain.classList.toggle("grayscale");
  if (brain.hasAttribute("data-disabled")) {
    brain.removeAttribute("data-disabled");
  } else {
    brain.setAttribute("data-disabled", "");
  }
}

async function wikiSearch(event) {
  let selection = window.getSelection().toString();
  if (
    !(selection.includes("\n") || !selection.length) &&
    !brain.hasAttribute("data-disabled") &&
    !note.isEncrypted
  ) {
    let wiki = selection.trim().replace(/ /g, "_").toLowerCase();
    document.body.style.cursor = "wait";
    try {
      const response = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${wiki}?redirect=true`,
        {
          cache: "default",
        },
      );
      if (response.ok) {
        const result = await response.json();
        let summary = `<b>${selection.trim()}</b>:<br>${DOMPurify.sanitize(
          result["extract_html"],
        )}<a href = 'https://en.wikipedia.org/wiki/${wiki}' target = '_blank'>Learn More</a>`;
        wikipediaTippy.setContent(`<div id = 'brain'>${summary}</div>`);
        moneyAnimation(event, "🧠");
      }
      document.body.style.cursor = "inherit";
    } catch (err) {
      document.body.style.cursor = "inherit";
    }
  }
}

function moneyAnimation(e, symbol) {
  if (!e.clientY || !e.clientX) {
    return;
  }
  wikipediaBrainAnimation.style.top = `${e.clientY}px`;
  wikipediaBrainAnimation.style.left = `${e.clientX}px`;
  // https://stackoverflow.com/a/69970674
  const moneyAnimation = document.createElement("p");
  moneyAnimation.innerHTML = symbol;
  wikipediaBrainAnimation.appendChild(moneyAnimation);
  moneyAnimation.classList.add("wikipediaBrainAnimation"); // Add the class that animates
  moneyAnimation.addEventListener("animationend", moneyAnimation.remove, {
    once: true,
  });
}
