import { micromark } from "micromark";
import { math, mathHtml } from "micromark-extension-math";
import { gfm, gfmHtml } from "micromark-extension-gfm";
import { mark, markHTML } from "../micromark-extension-mark/dev/index.js";
import { directive, directiveHtml } from "micromark-extension-directive";
import { currTheme } from "./theming.js";
import { parseReference } from "../shared_modules/parse_ref.js";

export default format;

function tag(d) {
  if (d.type !== "textDirective" || !d.label) return false;
  this.tag(
    `<button class = "sanctaTag" data-bookname = "Tag-Viewer" data-props = "${d.label}">`,
  );
  this.raw(d.label);
  this.tag("</button>");
}

function ref(d) {
  // :ref[bookName:page]
  // :ref[bookName|title]
  // :ref[]

  if (d.type !== "textDirective" || !d.label) return false;

  const { name, page, title } = parseReference(d.label);

  if (!name) {
    return false;
  }

  this.tag(
    `<button class="reference" data-bookname="${name}" data-page="${
      page ? page - 1 : 0
    }">`,
  );

  let raw;
  if (title) {
    raw = title;
  } else if (page) {
    raw = `${name} pg. ${page}`;
  } else {
    raw = name;
  }
  this.raw(raw || "");
  this.tag("</button>");
}

function fdg(d) {
  if (d.type !== "textDirective") {
    return false;
  }

  this.tag(
    `<iframe class = 'directiveFrame' src = '/api/get/fdg#${currTheme.notesColor}-${currTheme.body}-${currTheme.mainAccent}'></iframe>`,
  );
}

let memo = {};

// No need to DOMPurify on this because Micromark is safe by default
function format(str, { includeMath = true, includeDirs = true } = {}) {
  if (memo[`${str}${includeMath}${includeDirs}`]) {
    return memo[`${str}${includeMath}${includeDirs}`];
  }
  let html;
  try {
    html = micromark(str, {
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
        includeDirs ? directiveHtml({ ref, fdg, tag }) : null,
      ],
    });
  } catch (err) {
    html = micromark(str, {
      extensions: [gfm(), mark(), includeDirs ? directive() : null],
      htmlExtensions: [
        gfmHtml(),
        markHTML(),
        includeDirs ? directiveHtml({ ref, fdg, tag }) : null,
      ],
    });
    html = `<div class = 'previewErr'><b>Error:</b> ${err}</div>${html}`;
  }

  if (Object.keys(memo).length > 99) {
    memo = {};
  }
  if (str.includes(":fdg") && str.length < 25) {
    // Don't memoize if it's a small string with a FDG, because it's likely to be the Note Map which gets messed up with memoization
    // because it requires the current themes colors to be passed in as parameters to the note map iframe
  } else {
    memo[`${str}${includeMath}${includeDirs}`] = html;
  }

  return html;
}
