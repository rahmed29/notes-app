import { confirmation_cm, contextMenu, delContextMenu } from "../context_menu";
import { createPopupWindow } from "./popup";
import { showList, hideList } from "../resize_list";
import { note } from "../data/note";
// import { aiGenerating, prompt_ai } from "../ai_utils";
import { toggleWikiSearch, turnOffWiki, moneyAnimation } from "../wikipedia";
import {
  mainContainer,
  notesPreviewArea,
  brain,
} from "../important_stuff/dom_refs";
import { eid, attemptRemoval, appendText } from "../dom_utils";
import { AINotif } from "../palettes/notif_palette";
import format from "../micromark_directives";
import {
  flashcards,
  setFlashcards,
  saveFlashcards,
} from "../data/flashcard_data";
import { currTheme } from "../theming";
import { alertUser, stopAlert } from "../alerts";
import duai from "../../shared_modules/duai";

export {
  showFlashcards,
  editCardsRejection,
  flashcardMode,
  leaveFlashcardMode,
};

let editCardsRejection = null;
function setRejectToNull() {
  if (editCardsRejection) {
    editCardsRejection(new Error("Exited"));
    editCardsRejection = null;
  }
}

async function AIFlashcards() {
  notyf.error(duai);
  return;
  if (network.isOffline) {
    return;
  }
  if (note.isEncrypted) {
    notyf.error("AI Features are unavailable on encrypted notebooks");
    return;
  }
  leaveFlashcardMode();
  const noteName = note.name;
  let generatedCards = [];
  let response = await prompt_ai(
    note.content[note.pgN || 0],
    // this works well enough idk
    "Create flashcards from this note. Use GitHub flavored markdown to create a table of 2 columns, one column being terms and the other being definitions. Do not use any HTML tags.",
    "chatgpt",
  );
  if (response === 0) {
    return notyf.error("Flashcards could not be generated");
  }
  const shadow = document.createElement("div");
  shadow.innerHTML = format(response, {
    includeDirs: false,
  });
  let count = 1;
  if (shadow.getElementsByTagName("table")[0]) {
    for (const td of shadow.getElementsByTagName("table")[0].rows) {
      if (td.children[0].innerText && td.children[0].innerText) {
        generatedCards.push({
          subject: noteName,
          front: td.children[0].innerText.replaceAll("<br>", "\n"),
          back: td.children[1].innerText.replaceAll("<br>", "\n"),
          id: Date.now() + count++,
          ai_generated: true,
          learning: "unattempted",
        });
      }
    }
    AINotif("flashcards", noteName, async () => {
      try {
        generatedCards = await editCardsHelper(generatedCards);
        setFlashcards(flashcards.concat(generatedCards));
        saveFlashcards();
        showFlashcards(true, [noteName]);
      } catch (err) {
        if (err.message === "Unsaved") {
          showFlashcards(true, [noteName]);
        }
      }
    });
  } else {
    if (!note.isEncrypted) {
      notyf.error("Flashcards could not be generated");
    }
    leaveFlashcardMode();
  }
}

let currCard;

let fcLastNode;

function fcId(e) {
  if (e.target.id !== "fill" && e.target.id !== "notesPreviewArea") {
    if (fcLastNode) {
      fcLastNode.classList.remove("fcSelection");
    }
    e.target.classList.add("fcSelection");
    fcLastNode = e.target;
  }
}

function fcPop(e) {
  if (e.target.id !== "fill" && e.target.id !== "notesPreviewArea") {
    currCard.children[1].innerText = e.target.innerText;
  }
}

function flashcardMode() {
  if (!note.saved) {
    notyf.error("Flashcards can only be created for saved notebooks");
    return;
  }
  leaveFlashcardMode();
  document.body.classList.add("flashcardMode");
  hideList();
  turnOffWiki();
  brain.classList.add("grayscale");
  const fcArea = document.createElement("div");
  fcArea.id = "fcArea";
  fcArea.addEventListener("click", delContextMenu);
  const aibutton = document.createElement("div");
  aibutton.classList.add("fcButtons");
  const generated = document.createElement("button");
  generated.innerHTML = "✨ Generate Cards";
  appendText(generated, note.isEncrypted ? "Unavailable" : duai);
  generated.addEventListener("click", AIFlashcards);
  generated.classList.add("unavailable");
  aibutton.appendChild(generated);
  fcArea.appendChild(aibutton);

  const cardContainer1 = document.createElement("div");
  cardContainer1.classList.add("cardContainer");
  const cardHeader1 = document.createElement("div");
  cardHeader1.classList.add("cardHeader");
  cardHeader1.innerText = "Front";
  cardContainer1.appendChild(cardHeader1);
  const cardFront = document.createElement("div");
  cardFront.classList.add("currCard");
  cardFront.contentEditable = true;
  cardFront.spellcheck = false;
  cardFront.addEventListener("focus", () => {
    delContextMenu();
    currCard.classList.remove("currCard");
    cardFront.parentElement.classList.add("currCard");
    currCard = cardFront.parentElement;
  });
  cardContainer1.appendChild(cardFront);

  const cardContainer2 = document.createElement("div");
  cardContainer2.classList.add("cardContainer");
  const cardHeader2 = document.createElement("div");
  cardHeader2.classList.add("cardHeader");
  cardHeader2.innerText = "Back";
  cardContainer2.appendChild(cardHeader2);
  const cardBack = document.createElement("div");
  cardBack.contentEditable = true;
  cardBack.spellcheck = false;
  cardBack.addEventListener("focus", () => {
    delContextMenu();
    currCard.classList.remove("currCard");
    cardBack.parentElement.classList.add("currCard");
    currCard = cardBack.parentElement;
  });
  cardBack.classList.add("cardBack");
  cardContainer2.appendChild(cardBack);

  currCard = cardFront;
  cardFront.classList.add("cardFront");
  const buttons = document.createElement("div");
  buttons.classList.add("fcButtons");
  const save = document.createElement("button");
  save.innerText = "💾 Save";
  save.addEventListener(
    "click",
    (e) => {
      if (cardFront.innerText && cardBack.innerText) {
        flashcards.push({
          subject: note.name,
          front: cardFront.innerText,
          back: cardBack.innerText,
          id: Date.now(),
          ai_generated: false,
          learning: "unattempted",
        });
        moneyAnimation(e, "✔️");
        flashcardMode();
        saveFlashcards();
      } else {
        notyf.error("Both sides of flashcard must be populated");
        flashcardMode();
      }
    },
    { once: true },
  );
  const exit = document.createElement("button");
  exit.innerText = "❌ Exit";
  exit.addEventListener("click", () => leaveFlashcardMode(), { once: true });
  buttons.appendChild(save);
  buttons.appendChild(exit);

  fcArea.appendChild(cardContainer1);
  fcArea.appendChild(cardContainer2);
  fcArea.appendChild(buttons);
  mainContainer.after(fcArea);
  notesPreviewArea.addEventListener("click", fcPop);
  notesPreviewArea.addEventListener("mouseover", fcId);
  cardFront.focus();
  alertUser(
    "flashcard",
    `You are in flashcard mode, click some text to add it to the focused side of the flashcard.${
      note.isEncrypted ? " Flashcards are NOT encrypted!" : ""
    }`,
    currTheme.quizletPurpleAccents,
  );
}

function leaveFlashcardMode() {
  for (const node of document.getElementsByClassName("fcSelection")) {
    node.classList.remove("fcSelection");
  }
  notesPreviewArea.removeEventListener("click", fcPop);
  notesPreviewArea.removeEventListener("mouseover", fcId);
  document.body.classList.remove("flashcardMode");
  delContextMenu();
  toggleWikiSearch();
  showList();
  attemptRemoval([eid("fcArea")]);
  stopAlert("flashcard");
}

let globalFilter = null;

function showFlashcards(noAnimation, filter) {
  if (!filter && !globalFilter) {
    globalFilter = [note.name];
    filter = globalFilter;
  } else if (!filter) {
    filter = globalFilter;
  } else {
    globalFilter = filter;
  }
  const bookDiffContent = createPopupWindow({
    noAnimation,
  });
  const organized = flashcards.reduce(
    (arr2d, e) => {
      if (!filter.includes(e.subject)) {
        return arr2d;
      }
      switch (e.learning) {
        case "unattempted":
          arr2d[0].push(e);
          break;
        case "know":
          arr2d[1].push(e);
          break;
        case "dontKnow":
          arr2d[2].push(e);
          break;
      }
      return arr2d;
    },
    [[], [], []],
  );
  let availableCards = organized.reduce((avail, arr) => {
    avail = avail.concat(arr);
    return avail;
  }, []);

  const extra = document.createElement("div");
  extra.classList.add("extra");
  const editAll = document.createElement("button");
  editAll.classList.add("reset");
  editAll.innerText = "📝 Edit";
  editAll.addEventListener(
    "click",
    () => {
      editCards(availableCards);
    },
    { once: true },
  );
  extra.appendChild(editAll);
  const reset = document.createElement("button");
  reset.classList.add("reset");
  reset.innerText = "🔁 Reset All";
  reset.addEventListener("click", (e) => {
    contextMenu(e, [
      {
        text: "Confirm",
        click: () => {
          availableCards = availableCards.map((e) => {
            if (filter.includes(e.subject)) {
              e.learning = "unattempted";
              return e;
            }
          });
          saveFlashcards();
          showFlashcards(true);
        },
        appearance: "rios",
      },
    ]);
  });
  const pracAll = document.createElement("button");
  pracAll.classList.add("reset");
  pracAll.innerText = "🗂️ Practice All";
  pracAll.addEventListener(
    "click",
    () => {
      study([availableCards.shift()], availableCards);
    },
    { once: true },
  );
  extra.appendChild(reset);
  extra.appendChild(pracAll);

  const decks = document.createElement("button");
  decks.classList.add("reset");
  decks.id = "decks";
  decks.innerText = decks.innerText =
    filter.length > 1
      ? `🎴 ${filter[0]} (+${filter.length - 1})`
      : `🎴 ${filter[0]}`;
  decks.addEventListener("click", (e) => {
    const setFromArr = new Set(flashcards.map((e) => e.subject));
    contextMenu(
      e,
      Array.from(setFromArr).map((e) => ({
        text: ` ${e}`,
        click: () => {
          if (filter.includes(e) && filter.length > 1) {
            filter = filter.filter((f) => f !== e);
          } else if (!filter.includes(e)) {
            filter.push(e);
          }
          showFlashcards(true, filter);
        },
        appearance: filter.includes(e)
          ? "selected radioItem ios"
          : "radioItem ios",
      })),
      [
        `${e.target.getBoundingClientRect().left - 100}px`,
        `${e.target.getBoundingClientRect().top + 35}px`,
      ],
    );
  });
  extra.appendChild(decks);

  bookDiffContent.appendChild(extra);
  organized.map((e, i) => {
    const wrapper = document.createElement("div");
    const info = document.createElement("div");
    info.classList.add("fcGroupInfo");
    const num = document.createElement("span");
    const infoTexts = ["Unattempted - ", "Know - ", "Don't Know - "];
    num.innerText = "0";
    info.innerText = infoTexts[i];
    info.appendChild(num);
    const cards = document.createElement("div");
    cards.addEventListener("wheel", (e) => {
      e.preventDefault();
      cards.scroll({
        left: cards.scrollLeft + e.deltaY,
      });
    });
    cards.classList.add("fcCardList");

    e.forEach((card) => {
      num.innerText = parseInt(num.innerText) + 1;
      const cardFront = document.createElement("button");
      cardFront.tabIndex = 0;
      cardFront.addEventListener(
        "click",
        () =>
          study(
            e.splice(
              e.findIndex((obj) => obj.id === card.id),
              1,
            ),
            e,
          ),
        { once: true },
      );
      cardFront.addEventListener("contextmenu", (e) => {
        contextMenu(e, [
          {
            text: `Edit Card`,
            click: () => {
              editCards([card]);
              delContextMenu();
            },
          },
          {
            props: card.id,
            text: `Reset Card`,
            click: (props) => {
              flashcards.find((e) => e.id == props).learning = "unattempted";
              saveFlashcards();
              delContextMenu();
              showFlashcards(true);
            },
          },
          {
            props: card.id,
            text: `Delete Card`,
            click: (props, ele) => {
              confirmation_cm(ele, () => {
                setFlashcards(flashcards.filter((e) => e.id != props));
                saveFlashcards();
                delContextMenu();
                showFlashcards(true);
              });
            },
          },
        ]);
      });
      cardFront.classList.add("cardFront");
      cardFront.innerHTML = format(card.front, {
        includeDirs: false,
      });
      cards.appendChild(cardFront);
    });

    if (!cards.firstChild) {
      cards.classList.add("grid");
      cards.innerHTML = "<i>Flashcards will appear here.</i>";
    } else {
      cards.classList.remove("grid");
    }

    wrapper.appendChild(info);
    wrapper.appendChild(cards);
    wrapper.classList.add("fcGroup");
    bookDiffContent.appendChild(wrapper);
  });
}

function shuffle(array) {
  const newArr = [...array];
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [newArr[currentIndex], newArr[randomIndex]] = [
      newArr[randomIndex],
      newArr[currentIndex],
    ];
  }

  return newArr;
}

async function editCards(cardArr) {
  try {
    const resolvedArr = await editCardsHelper(cardArr);
    for (let i = 0, n = cardArr.length; i < n; i++) {
      cardArr[i].front = resolvedArr[i].front;
      cardArr[i].back = resolvedArr[i].back;
    }
    saveFlashcards();
    showFlashcards(true);
  } catch (err) {
    if (err.message === "Unsaved") {
      showFlashcards(true);
    }
  }
  console.log("exited edit cards");
}

function editCardsHelper(cardArr) {
  if (cardArr.length === 0) {
    return;
  }

  const bookDiffContent = createPopupWindow({
    noAnimation: true,
    closers: [setRejectToNull],
  });

  const h2 = document.createElement("h2");
  h2.innerText = "Flashcard Editor";
  bookDiffContent.appendChild(h2);

  const copy = JSON.parse(JSON.stringify(cardArr));

  return new Promise((resolve, reject) => {
    // Make rejection available globally and reject it when closing popup
    editCardsRejection = reject;
    copy.map((card, i) => {
      const oneCard = document.createElement("div");
      oneCard.setAttribute("data-order", i + 1);
      oneCard.classList.add("editableCard");

      const cardContainer1 = document.createElement("div");
      cardContainer1.classList.add("cardContainer");
      const cardHeader1 = document.createElement("div");
      cardHeader1.classList.add("cardHeader");
      cardHeader1.innerText = "Front";
      cardContainer1.appendChild(cardHeader1);
      const cardFront = document.createElement("div");
      cardFront.addEventListener("input", () => {
        card.front = cardFront.innerText;
      });
      cardFront.innerText = card.front;
      cardFront.classList.add("cardFront");
      cardFront.contentEditable = true;
      cardFront.spellcheck = false;
      cardContainer1.appendChild(cardFront);

      const cardContainer2 = document.createElement("div");
      cardContainer2.classList.add("cardContainer");
      const cardHeader2 = document.createElement("div");
      cardHeader2.classList.add("cardHeader");
      cardHeader2.innerText = "Back";
      cardContainer2.appendChild(cardHeader2);
      const cardBack = document.createElement("div");
      cardBack.addEventListener("input", () => {
        card.back = cardBack.innerText;
      });
      cardBack.innerText = card.back;
      cardBack.classList.add("cardBack");
      cardBack.contentEditable = true;
      cardBack.spellcheck = false;
      cardContainer2.appendChild(cardBack);

      const remove = document.createElement("button");
      remove.classList.add("deleteCard");
      remove.innerText = "❌";
      remove.addEventListener("click", () => {
        card.front = "";
        card.back = "";
        remove.parentElement.remove();
        delContextMenu();
      });

      oneCard.appendChild(cardContainer1);
      oneCard.appendChild(cardContainer2);
      oneCard.appendChild(remove);

      bookDiffContent.appendChild(oneCard);
    });

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("fcButtons");
    const check = document.createElement("button");
    check.innerText = "💾 Save";
    check.addEventListener(
      "click",
      () => {
        resolve(copy);
        editCardsRejection = null;
      },
      { once: true },
    );
    buttonContainer.appendChild(check);
    const exit = document.createElement("button");
    exit.innerText = "❌ Exit";
    exit.addEventListener(
      "click",
      () => {
        editCardsRejection(new Error("Unsaved"));
      },
      { once: true },
    );
    buttonContainer.appendChild(exit);

    bookDiffContent.appendChild(buttonContainer);
    bookDiffContent.children[1].firstChild.focus();
  });
}

function study(cardArr, allCards) {
  const bookDiffContent = createPopupWindow({
    noAnimation: true,
  });

  if (!cardArr[0]) {
    showFlashcards(true);
    return;
  }
  const cardObj = cardArr[0];

  const container = document.createElement("div");
  container.classList.add("studyContainer");
  bookDiffContent.appendChild(container);

  const options = document.createElement("div");
  options.classList.add("studyingOptions");
  container.appendChild(options);

  const leave = document.createElement("button");
  leave.classList.add("reset");
  leave.innerText = "❌ Exit";
  leave.addEventListener("click", () => showFlashcards(true));
  options.appendChild(leave);

  const reset = document.createElement("button");
  reset.classList.add("reset");
  reset.innerText = "🔁 Reset Card";
  reset.addEventListener("click", () => {
    cardObj.learning = "unattempted";
    saveFlashcards();
    study(cardArr, allCards);
  });
  options.appendChild(reset);

  const back = document.createElement("button");
  back.classList.add("reset");
  back.innerText = "⏪ Back";
  back.style.opacity = ".5";
  if (cardArr.length > 1) {
    back.addEventListener("click", () => {
      allCards.push(cardArr.shift());
      study(cardArr, allCards);
    });
    back.style.opacity = "1";
  }
  options.appendChild(back);

  const skip = document.createElement("button");
  skip.classList.add("reset");
  skip.innerText = "⏩ Skip";
  skip.addEventListener("click", () =>
    study([allCards.shift(), ...cardArr], allCards),
  );
  options.appendChild(skip);

  const reshuffle = document.createElement("button");
  reshuffle.classList.add("reset");
  reshuffle.innerText = "🔀 Shuffle";
  reshuffle.addEventListener("click", () => {
    const shuffled = shuffle([cardArr.shift(), ...allCards]);
    notyf.success("Cards were shuffled");
    study([shuffled.shift(), ...cardArr], shuffled);
  });
  options.appendChild(reshuffle);

  const progress = document.createElement("span");
  progress.style.fontFamily = "monospace";
  progress.innerText = `${cardArr.length}/${allCards.length + cardArr.length}`;
  options.appendChild(progress);

  if (cardObj.ai_generated) {
    const ai = document.createElement("div");
    ai.innerText = "🤖";
    options.appendChild(ai);
  }

  const cardContainer = document.createElement("button");
  cardContainer.classList.add("glowing-border");
  cardContainer.classList.add("quizlet");
  cardContainer.addEventListener("click", () => {
    cardContainer.classList.toggle("quizletActive");
  });
  const cardContent = document.createElement("div");
  cardContent.classList.add("qContent");

  cardContainer.appendChild(cardContent);

  const frontCard = document.createElement("div");
  frontCard.classList.add("qFront");
  frontCard.innerHTML = format(cardObj.front, {
    includeDirs: false,
  });
  container.appendChild(frontCard);

  const backCard = document.createElement("div");
  backCard.classList.add("qBack");
  backCard.innerHTML = format(cardObj.back, {
    includeDirs: false,
  });
  container.appendChild(backCard);

  cardContent.appendChild(frontCard);
  cardContent.appendChild(backCard);

  container.appendChild(cardContainer);

  // <div CARDCONTAINER>
  //    <div CARDFRONT></div>
  //    <div CARDBACK></div>
  // </div>

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("fcButtons");
  const check = document.createElement("button");
  check.innerText = "✅ Know";
  if (cardObj.learning === "know") {
    check.style.background = "lightgreen";
    check.style.color = "black";
  }
  check.addEventListener("click", (e) => {
    cardObj.learning = "know";
    moneyAnimation(e, "😊");
    saveFlashcards();
    study([allCards.shift(), ...cardArr], allCards);
  });
  const x = document.createElement("button");
  x.addEventListener("click", (e) => {
    cardObj.learning = "dontKnow";
    moneyAnimation(e, "😔");
    saveFlashcards();
    study([allCards.shift(), ...cardArr], allCards);
  });
  x.innerText = "❌ Don't Know";
  if (cardObj.learning === "dontKnow") {
    x.style.background = "lightcoral";
    x.style.color = "black";
  }
  buttonContainer.appendChild(check);
  buttonContainer.appendChild(x);
  container.appendChild(buttonContainer);
}
