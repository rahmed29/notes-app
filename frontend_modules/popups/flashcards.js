import { contextMenu, delContextMenu } from "../context_menu";
import { createPopupWindow, closePopupWindow } from "./popup";
import { showList, hideList } from "../list_utils";
import { note } from "../note_utils";
import { aiGenerating, prompt_ai } from "../ai_utils";
import { toggleWikiSearch, turnOffWiki, moneyAnimation } from "../wikipedia";
import { mainContainer, notesPreviewArea, brain } from "../../main";
import { eid, attemptRemoval } from "../dom_utils";
import { AINotif } from "../palettes/notif_palette";
import { format } from "../text_formatting";

export {
  initializeFlashcards,
  showFlashcards,
  flashcards,
  editCardsRejection,
  flashcardMode,
  leaveFlashcardMode,
  filterFlashcards,
  setRejectToNull,
};

let editCardsRejection = null;

function setRejectToNull() {
  if (editCardsRejection) {
    editCardsRejection(new Error("Exited"));
    editCardsRejection = null;
  }
}

async function AIFlashcards() {
  if (note.isEncrypted) {
    notyf.error("AI Features are unavailable on encrypted notebooks");
    return;
  }
  leaveFlashcardMode();
  let generatedCards = [];
  let response = (
    (await prompt_ai(
      note.content[note.pgN],
      // this works well enough idk
      "Create flashcards from this note. Use GitHub flavored markdown to create a table of 2 columns, one column being terms and the other being definitions. Do not use any HTML tags.",
      "chatgpt"
    ))
  )
  const shadow = document.createElement("div");
  shadow.innerHTML = format(response);
  let count = 1;
  if (shadow.getElementsByTagName("table")[0]) {
   for (const td of shadow.getElementsByTagName("table")[0].rows) {
      if (td.children[0].innerText && td.children[0].innerText) {
        generatedCards.push({
          subject: note.name,
          front: td.children[0].innerText.replaceAll("<br>", "\n"),
          back: td.children[1].innerText.replaceAll("<br>", "\n"),
          id: Date.now() + count,
          ai_generated: true,
          learning: "unattempted",
        });
        count++;
      }
    }
    AINotif("Flashcards", note.name, async () => {
      try {
        generatedCards = await editCardsHelper(generatedCards, true);
        flashcards = flashcards.concat(generatedCards);
        saveFlashcards();
        showFlashcards(true);
      } catch (err) {
        if (err.message === "Unsaved") {
          showFlashcards(true);
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

// flashcards
let flashcards = [];
let currCard = null;

function filterFlashcards(filter) {
  flashcards = flashcards.filter((e) => e.subject !== filter);
}

// flashcards
async function initializeFlashcards() {
  const response = await fetch("/api/get/notebooks/flash__cards");
  if (response.ok) {
    let json = await response.json();
    flashcards = JSON.parse(json["data"]["content"][0]);
  } else if (response.status === 404) {
    flashcards = [];
  } else {
    notyf.error("An error occurred when loading your flashcards");
  }
}

async function saveFlashcards() {
  flashcards = flashcards.filter(
    (card) =>
      card.front && card.front !== "\n" && card.back && card.back !== "\n"
  );
  const response = await fetch("/api/save/notebooks/flash__cards", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: [JSON.stringify(flashcards)],
      date: new Date().toLocaleString(),
    }),
  });
  if (!response.ok) {
    notyf.error("An error occurred when saving the flashcards");
  }
}

let fcLastNode = null;

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
    currCard.innerText = e.target.innerText;
  }
}

function flashcardMode() {
  if (!note.saved) {
    notyf.error("Flashcards can only be created for saved notebooks");
    return;
  }
  closePopupWindow();
  leaveFlashcardMode();
  document.body.classList.add("flashcardMode");
  hideList();
  const alert = document.createElement("div");
  alert.id = "fcAlert";
  alert.innerText = `You are in flashcard mode. Click some text to add it to the focused side of the card. ${
    note.isEncrypted ? "Flashcards are NOT encrypted!" : ""
  }`;
  mainContainer.after(alert);
  turnOffWiki;
  brain.classList.add("grayscale");
  const fcArea = document.createElement("div");
  fcArea.id = "fcArea";
  fcArea.addEventListener("click", delContextMenu)
  const aibutton = document.createElement("div");
  aibutton.classList.add("fcButtons");
  const generated = document.createElement("button");
  generated.innerHTML = "✨ Generate Cards (ChatGPT)";
  generated.addEventListener("click", AIFlashcards)
  if (aiGenerating || note.isEncrypted) {
    generated.classList.add("unavailable");
  }
  aibutton.appendChild(generated);
  fcArea.appendChild(aibutton);
  const cardFront = document.createElement("div");
  cardFront.classList.add("currCard");
  cardFront.contentEditable = true;
  cardFront.spellcheck = false;
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
    { once: true }
  );
  const exit = document.createElement("button");
  exit.innerText = "❌ Exit";
  exit.addEventListener("click", () => leaveFlashcardMode(), { once: true });
  buttons.appendChild(save);
  buttons.appendChild(exit);
  cardFront.addEventListener("focus", function () {
    delContextMenu();
    currCard.classList.remove("currCard");
    this.classList.add("currCard");
    currCard = this;
  });

  const cardBack = document.createElement("div");
  cardBack.contentEditable = true;
  cardBack.spellcheck = false;
  cardBack.addEventListener("focus", function () {
    delContextMenu();
    currCard.classList.remove("currCard");
    this.classList.add("currCard");
    currCard = this;
  });
  cardBack.classList.add("cardBack");
  fcArea.appendChild(cardFront);
  fcArea.appendChild(cardBack);
  fcArea.appendChild(buttons);
  mainContainer.after(fcArea);
  notesPreviewArea.addEventListener("click", fcPop);
  notesPreviewArea.addEventListener("mouseover", fcId);
  cardFront.focus();
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
  attemptRemoval([eid("fcAlert")]);
  attemptRemoval([eid("fcArea")]);
}

function showFlashcards(noAnimation) {
  const bookDiffContent = createPopupWindow(noAnimation);
  const organized = flashcards.reduce(
    (arr2d, e) => {
      if (e.subject !== note.name) {
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
    [[], [], []]
  );

  const extra = document.createElement("div");
  extra.classList.add("extra");
  const editAll = document.createElement("div");
  editAll.classList.add("reset");
  editAll.innerText = "📝 Edit";
  editAll.addEventListener(
    "click",
    () => {
      let promisedCards = flashcards.filter((e) => e.subject === note.name);
      editCards(promisedCards);
    },
    { once: true }
  );
  extra.appendChild(editAll);
  const reset = document.createElement("div");
  reset.classList.add("reset");
  reset.innerText = "🔁 Reset All";
  reset.addEventListener(
    "click",
    () => {
      flashcards = flashcards.map((e) => {
        e.learning = "unattempted";
        return e;
      });
      saveFlashcards();
      showFlashcards(true);
    },
    { once: true }
  );
  const pracAll = document.createElement("div");
  pracAll.classList.add("reset");
  pracAll.innerText = "🗂️ Practice All";
  pracAll.addEventListener(
    "click",
    () => {
      const cards = flashcards.filter((e) => e.subject === note.name);
      study([cards.shift()], cards);
    },
    { once: true }
  );
  extra.appendChild(reset);
  extra.appendChild(pracAll);
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
    cards.addEventListener("wheel", function (e) {
      this.scroll({
        left: this.scrollLeft + e.deltaY,
      });
    });
    cards.classList.add("fcCardList");

    e.forEach((card) => {
      num.innerText = parseInt(num.innerText) + 1;
      const cardFront = document.createElement("div");
      cardFront.addEventListener(
        "click",
        () =>
          study(
            e.splice(
              e.findIndex((obj) => obj.id === card.id),
              1
            ),
            e
          ),
        { once: true }
      );
      cardFront.addEventListener("contextmenu", function (e) {
        contextMenu(e, [
          {
            attr: card.id,
            text: `Edit Card`,
            click: function () {
              editCards([card]);
              delContextMenu();
            },
            appearance: "ios",
          },
          {
            attr: card.id,
            text: `Reset Card`,
            click: function () {
              flashcards.find(
                (e) => e.id == this.getAttribute("data-props")
              ).learning = "unattempted";
              saveFlashcards();
              delContextMenu();
              showFlashcards(true);
            },
            appearance: "ios",
          },
          {
            attr: card.id,
            text: `Delete Card`,
            click: function () {
              this.innerText = "Confirm";
              this.classList.add("rios");
              this.addEventListener(
                "click",
                function () {
                  flashcards = flashcards.filter(
                    (e) => e.id != this.getAttribute("data-props")
                  );
                  saveFlashcards();
                  delContextMenu();
                  showFlashcards(true);
                },
                { once: true }
              );
            },
            appearance: "ios",
          },
        ]);
      });
      cardFront.classList.add("cardFront");
      cardFront.innerText = card.front;
      cards.appendChild(cardFront);
    });

    if (!cards.firstChild) {
      cards.classList.add("grid");
      cards.innerHTML = "<i>Cards for this notebook will appear here.</i>";
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
}

function editCardsHelper(cardArr) {
  if (cardArr.length === 0) {
    return;
  }

  const bookDiffContent = createPopupWindow(true);

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

      const cardFront = document.createElement("div");
      cardFront.addEventListener("input", function () {
        card.front = this.innerText;
      });
      cardFront.innerText = card.front;
      cardFront.classList.add("cardFront");
      cardFront.contentEditable = true;
      cardFront.spellcheck = false;

      const cardBack = document.createElement("div");
      cardBack.addEventListener("input", function () {
        card.back = this.innerText;
      });
      cardBack.innerText = card.back;
      cardBack.classList.add("cardBack");
      cardBack.contentEditable = true;
      cardBack.spellcheck = false;

      const remove = document.createElement("button");
      remove.classList.add("deleteCard");
      remove.innerText = "❌";
      remove.addEventListener("click", function (e) {
        card.front = "";
        card.back = "";
        this.parentElement.remove();
        delContextMenu();
      });

      oneCard.appendChild(cardFront);
      oneCard.appendChild(cardBack);
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
      { once: true }
    );
    buttonContainer.appendChild(check);
    const exit = document.createElement("button");
    exit.innerText = "❌ Exit";
    exit.addEventListener(
      "click",
      () => {
        editCardsRejection(new Error("Unsaved"));
      },
      { once: true }
    );
    buttonContainer.appendChild(exit);

    bookDiffContent.appendChild(buttonContainer);
    bookDiffContent.children[1].firstChild.focus();
  });
}

function study(cardArr, allCards) {
  const bookDiffContent = createPopupWindow(true);

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

  const leave = document.createElement("div");
  leave.classList.add("reset");
  leave.innerText = "❌ Exit";
  leave.addEventListener("click", () => showFlashcards(true));
  options.appendChild(leave);

  const reset = document.createElement("div");
  reset.classList.add("reset");
  reset.innerText = "🔁 Reset Card";
  reset.addEventListener("click", () => {
    cardObj.learning = "unattempted";
    study(cardArr, allCards);
  });
  options.appendChild(reset);

  const back = document.createElement("div");
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

  const skip = document.createElement("div");
  skip.classList.add("reset");
  skip.innerText = "⏩ Skip";
  skip.addEventListener("click", () =>
    study([allCards.shift(), ...cardArr], allCards)
  );
  options.appendChild(skip);

  const reshuffle = document.createElement("div");
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

  const cardContainer = document.createElement("div");
  cardContainer.classList.add("quizlet");
  cardContainer.addEventListener("click", function () {
    this.classList.toggle("quizletActive");
  });
  const cardContent = document.createElement("div");
  cardContent.classList.add("qContent");

  cardContainer.appendChild(cardContent);

  const frontCard = document.createElement("div");
  frontCard.classList.add("qFront");
  frontCard.innerText = cardObj.front;
  container.appendChild(frontCard);

  const backCard = document.createElement("div");
  backCard.classList.add("qBack");
  backCard.innerText = cardObj.back;
  container.appendChild(backCard);

  cardContent.appendChild(frontCard);
  cardContent.appendChild(backCard);

  container.appendChild(cardContainer);

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
