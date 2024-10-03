import { micromark } from "micromark";
import { math, mathHtml } from "micromark-extension-math";
import { gfm, gfmHtml } from "micromark-extension-gfm";
import { mark, markHTML } from "../micromark-extension-mark/dev/index.js";
import { directive, directiveHtml } from "micromark-extension-directive";
import { currTheme } from "./theming.js";
import { parseReference } from "../shared_modules/parse_ref.js";
import DOMPurify from "dompurify";

export default format;

function ref(d) {
  // :ref[bookName:page]
  // :ref[bookName|title]
  // :ref[]

  // return if empty
  if (d.type !== "textDirective" || !d.label) return false;

  const { name, page, title } = parseReference(d.label);

  if (!name) {
    return false;
  }

  this.tag(
    `<span class="reference" data-bookname="${DOMPurify.sanitize(
      name
    )}" data-page="${page ? page - 1 : 0}">`
  );

  let raw;
  if (title) {
    raw = DOMPurify.sanitize(title);
  } else if (page) {
    raw = DOMPurify.sanitize(`${name} pg. ${page}`);
  } else {
    raw = DOMPurify.sanitize(`${name}`);
  }
  this.raw(raw || "");
  this.tag("</span>");
}

function fdg(d) {
  if (d.type !== "textDirective") {
    return false;
  }

  this.tag(
    `<iframe class = 'directiveFrame' src = '/api/get/fdg#${currTheme.notesColor}-${currTheme.body}-${currTheme.mainAccent}'></iframe>`
  );
}

let memo = {};

// No need to DOMPurify on this because Micromark is safe by default
function format(str, { includeMath = true, includeDirs = true } = {}) {
  const startTIme = performance.now();
  if (memo[`${str}${includeMath}${includeDirs}`]) {
    console.log("Preview render time (w/ memo):", performance.now() - startTIme);
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
        includeDirs ? directiveHtml({ ref, fdg }) : null,
      ],
    });
  } catch (err) {
    html = micromark(str, {
      extensions: [gfm(), mark(), includeDirs ? directive() : null],
      htmlExtensions: [
        gfmHtml(),
        markHTML(),
        includeDirs ? directiveHtml({ ref, fdg }) : null,
      ],
    });
  }

  if (Object.keys(memo).length > 99) {
    memo = {};
  }

  memo[`${str}${includeMath}${includeDirs}`] = html;

  console.log("Preview render time:", performance.now() - startTIme);
  return html;
}
