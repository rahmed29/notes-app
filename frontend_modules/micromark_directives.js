import { micromark } from "micromark";
import { math, mathHtml } from "micromark-extension-math";
import { gfm, gfmHtml } from "micromark-extension-gfm";
import { mark, markHTML } from "../micromark-extension-mark/dev/index.js";
import { directive, directiveHtml } from "micromark-extension-directive";
import { currTheme } from "./theming.js";

export { format };

function ref(d) {
  // :ref[bookName:optional page|optional title]

  // return if empty
  if (d.type !== "textDirective" || !d.label) return false;

  // book name, first part of label
  let bookName = d.label.split(":")[0].replaceAll(" ", "");
  // attributes, second part of label (page number and optional title)
  const atrs = d.label.split(":")[1];
  // parse int from attributes
  const page = parseInt(atrs);
  this.tag(
    `<span class="reference" data-bookname="${DOMPurify.sanitize(
      bookName
    )}" data-page="${page ? page - 1 : 0}">`
  );
  let raw;
  if (atrs && atrs.indexOf("|") > 0) {
    // inner text becomes optional title if it exists
    raw = atrs.split("|").slice(-1);
  } else {
    // else it becomes book name or book name plus page number if it exists
    raw = DOMPurify.sanitize(`${bookName} ${page ? `pg. ${page}` : ""}`);
  }
  this.raw(raw || "");
  this.tag("</span>");
}

function fdg(d) {
  if (d.type !== "textDirective") {
    return false;
  }

  this.tag(
    `<iframe class = 'directiveFrame' src = '/api/fdg#${currTheme.notesColor}-${currTheme.body}-${currTheme.mainAccent}'></iframe>`
  );
}

// No need to DOMPurify on this because Micromark is safe by default
function format(str, { includeMath = true, includeDirs = true } = {}) {
  return micromark(str, {
    extensions: [
      gfm(),
      mark(),
      includeMath ? math() : null,
      includeDirs ? directive() : null,
    ],
    htmlExtensions: [
      gfmHtml(),
      markHTML(),
      includeMath ? mathHtml() : null,
      includeDirs ? directiveHtml({ ref, fdg }) : null,
    ],
  });
}
