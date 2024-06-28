import { micromark } from "micromark";
import { math, mathHtml } from "micromark-extension-math";
import { gfm, gfmHtml } from "micromark-extension-gfm";
import { mark, markHTML } from "../micromark-extension-mark/dev/index.js";
import { directive, directiveHtml } from "micromark-extension-directive";
import { events, pastEvents } from "./popups/calendar.js";

export { removeMD, format, formatHDate };

function formatHDate(dateStr) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // const suffixes = ["th", "st", "nd", "rd"];
  const dateParts = dateStr.split("-");
  const year = dateParts[0];
  const month = months[parseInt(dateParts[1]) - 1];
  const day = parseInt(dateParts[2]);

  let suffix;
  switch (day % 10) {
    case 1:
      suffix = "st";
      break;
    case 2:
      suffix = "nd";
      break;
    case 3:
      suffix = "rd";
      break;
    default:
      suffix = "th";
  }

  return DOMPurify.sanitize(`${month} ${day}${suffix}, ${year}`);
}

// micromark directives
function cal(d) {
  if (d.type !== "textDirective") return false;

  this.tag("<div");
  this.tag(' class="note-calendar-wrapper"');

  const calEv = events.concat(pastEvents).find((e) => e.id == d.label) || {
    allDay: true,
    title: "404",
    start: "1337-09-27",
    id: "404",
    extendedProps: {
      category: "404",
    },
  };

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
        <h2>📅 ${calEv.title}</h2>
        <i>"${calEv.extendedProps.description || "No description provided"}"</i>
        <br>
      </div>
      <b>${calEv.extendedProps.category}</b>
    `)
  );
  this.tag("</div>");
}

function ref(d) {
  if (d.type !== "textDirective") return false;

  this.tag(`<a href = 'javascript:()' class="reference" data-bookname="${d.label}" data-page="0">`);
  this.raw(DOMPurify.sanitize(d.label) || "");
  this.tag("</a>");
}

// Text formatting stuff

// https://github.com/stiang/remove-markdown/blob/main/index.js
function removeMD(md, options) {
  options = options || {};
  options.listUnicodeChar = options.hasOwnProperty("listUnicodeChar")
    ? options.listUnicodeChar
    : false;
  options.stripListLeaders = options.hasOwnProperty("stripListLeaders")
    ? options.stripListLeaders
    : true;
  options.gfm = options.hasOwnProperty("gfm") ? options.gfm : true;
  options.useImgAltText = options.hasOwnProperty("useImgAltText")
    ? options.useImgAltText
    : true;
  options.abbr = options.hasOwnProperty("abbr") ? options.abbr : false;
  options.replaceLinksWithURL = options.hasOwnProperty("replaceLinksWithURL")
    ? options.replaceLinksWithURL
    : false;
  options.htmlTagsToSkip = options.hasOwnProperty("htmlTagsToSkip")
    ? options.htmlTagsToSkip
    : [];

  var output = md || "";

  // Remove horizontal rules (stripListHeaders conflict with this rule, which is why it has been moved to the top)
  output = output.replace(/^(-\s*?|\*\s*?|_\s*?){3,}\s*/gm, "");

  try {
    if (options.stripListLeaders) {
      if (options.listUnicodeChar)
        output = output.replace(
          /^([\s\t]*)([\*\-\+]|\d+\.)\s+/gm,
          options.listUnicodeChar + " $1"
        );
      else output = output.replace(/^([\s\t]*)([\*\-\+]|\d+\.)\s+/gm, "$1");
    }
    if (options.gfm) {
      output = output
        // Header
        .replace(/\n={2,}/g, "\n")
        // Fenced codeblocks
        .replace(/~{3}.*\n/g, "")
        // Strikethrough
        .replace(/~~/g, "")
        // Fenced codeblocks
        .replace(/`{3}.*\n/g, "");
    }
    if (options.abbr) {
      // Remove abbreviations
      output = output.replace(/\*\[.*\]:.*\n/, "");
    }
    output = output
      // Remove HTML tags
      .replace(/<[^>]*>/g, "");

    var htmlReplaceRegex = new RegExp("<[^>]*>", "g");
    if (options.htmlTagsToSkip.length > 0) {
      // Using negative lookahead. Eg. (?!sup|sub) will not match 'sup' and 'sub' tags.
      var joinedHtmlTagsToSkip = "(?!" + options.htmlTagsToSkip.join("|") + ")";

      // Adding the lookahead literal with the default regex for html. Eg./<(?!sup|sub)[^>]*>/ig
      htmlReplaceRegex = new RegExp(
        "<" + joinedHtmlTagsToSkip + "[^>]*>",
        "ig"
      );
    }

    output = output
      // Remove HTML tags
      .replace(htmlReplaceRegex, "")
      // Remove setext-style headers
      .replace(/^[=\-]{2,}\s*$/g, "")
      // Remove footnotes?
      .replace(/\[\^.+?\](\: .*?$)?/g, "")
      .replace(/\s{0,2}\[.*?\]: .*?$/g, "")
      // Remove images
      .replace(/\!\[(.*?)\][\[\(].*?[\]\)]/g, options.useImgAltText ? "$1" : "")
      // Remove inline links
      .replace(
        /\[([^\]]*?)\][\[\(].*?[\]\)]/g,
        options.replaceLinksWithURL ? "$2" : "$1"
      )
      // Remove blockquotes
      .replace(/^(\n)?\s{0,3}>\s?/gm, "$1")
      // .replace(/(^|\n)\s{0,3}>\s?/g, '\n\n')
      // Remove reference-style links?
      .replace(/^\s{1,2}\[(.*?)\]: (\S+)( ".*?")?\s*$/g, "")
      // Remove atx-style headers
      .replace(
        /^(\n)?\s{0,}#{1,6}\s*( (.+))? +#+$|^(\n)?\s{0,}#{1,6}\s*( (.+))?$/gm,
        "$1$3$4$6"
      )
      // Remove * emphasis
      .replace(/([\*]+)(\S)(.*?\S)??\1/g, "$2$3")
      // Remove _ emphasis. Unlike *, _ emphasis gets rendered only if
      //   1. Either there is a whitespace character before opening _ and after closing _.
      //   2. Or _ is at the start/end of the string.
      .replace(/(^|\W)([_]+)(\S)(.*?\S)??\2($|\W)/g, "$1$3$4$5")
      // Remove code blocks
      .replace(/(`{3,})(.*?)\1/gm, "$2")
      // Remove inline code
      .replace(/`(.+?)`/g, "$1")
      // // Replace two or more newlines with exactly two? Not entirely sure this belongs here...
      // .replace(/\n{2,}/g, '\n\n')
      // // Remove newlines in a paragraph
      // .replace(/(\S+)\n\s*(\S+)/g, '$1 $2')
      // Replace strike through
      .replace(/~(.*?)~/g, "$1");
  } catch (e) {
    console.error(e);
    return md;
  }
  return output;
}

function format(str) {
  return micromark(str, {
    extensions: [gfm(), math(), mark(), directive()],
    htmlExtensions: [
      gfmHtml(),
      mathHtml(),
      markHTML(),
      directiveHtml({ ref, cal }),
    ],
  });
}
