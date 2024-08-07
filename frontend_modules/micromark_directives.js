import { micromark } from "micromark";
import { math, mathHtml } from "micromark-extension-math";
import { gfm, gfmHtml } from "micromark-extension-gfm";
import { mark, markHTML } from "../micromark-extension-mark/dev/index.js";
import { directive, directiveHtml } from "micromark-extension-directive";
import { events, pastEvents } from "./popups/calendar.js";
import { currTheme } from "./theming.js";
import { formatHDate } from "./text_formatting.js";

export { cal, ref, fdg, format };

// micromark directives
function cal(d) {
  if (d.type !== "textDirective" || !d.label) return false;

  this.tag("<div");
  this.tag(' class="note-calendar-wrapper"');

  let done = ["", ""];
  let calEv = events.find((e) => e.id == d.label);

  if (!calEv) {
    done = ["<s>", "</s>"];
    calEv = pastEvents.find((e) => e.id == d.label) || {
      allDay: true,
      title: "404",
      start: "1337-09-27",
      id: "404",
      extendedProps: {
        category: "404",
      },
    };
  }

  const date = formatHDate(calEv.start).split(" ");
  const month = date[0];
  const day = date[1].slice(0, -1);
  const year = date[2];

  this.tag(">");
  this.raw(
    DOMPurify.sanitize(`
        <div class = "note-calendar-event">
          <b>${month}</b>
          <span>${day}</span>
          <i>${year}</i>
        </div>
        <div>
          <h2>📅 ${done[0]}${calEv.title}${done[1]}</h2>
          <i>${done[0]}"${
      calEv.extendedProps.description || "No description provided"
    }"${done[1]}</i>
          <br>
        </div>
        <b>${calEv.extendedProps.category}</b>
      `)
  );
  this.tag("</div>");
}

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
    `<span class="reference" data-bookname="${bookName}" data-page="${
      page ? page - 1 : 0
    }">`
  );
  let raw;
  if (atrs && atrs.indexOf("|") > 0) {
    // inner text becomes optional title if it exists
    raw = atrs.split("|").slice(-1);
  } else {
    // else it becomes book name or book name plus page number if it exists
    raw = `${DOMPurify.sanitize(bookName)} ${page ? `pg. ${page}` : ""}`;
  }
  this.raw(raw || "");
  this.tag("</span>");
}

function fdg(d) {
  if (d.type !== "textDirective") {
    return false;
  }

  this.tag(
    `<iframe src = '/api/fdg#${currTheme.notesColor}-${currTheme.body}-${currTheme.mainAccent}'></iframe>`
  );
}
function format(str, {
  includeMath = true,
  includeDirs = true,
} = {}) {
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
      includeDirs ? directiveHtml({ ref, cal, fdg }) : null,
    ],
  });
}
