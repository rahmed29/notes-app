export {
  setup_dom_refs,
  notesTextArea,
  notesPreviewArea,
  mainContainer,
  notesAreaContainer,
  topLeftPageNumber,
  areNotesSavedIcon,
  list,
  listContainer,
  wikipediaBrainAnimation,
  bottomLeftGeneralInfo,
  generalInfoPageNumberEle,
  uploadFolder,
  morePages,
  toolBar,
  brain,
  border,
  stickyNotesTextArea,
  stickyNotes,
  workspace,
  tabs,
  openCalendar,
  flashcardPrac,
  myForm,
  letterCount,
  wordCount,
  mode,
  previewContent,
  brDots,
  yellowButtons,
  bottomRightTools,
  searchBar,
};

let notesTextArea;
let notesPreviewArea;
let mainContainer;
let notesAreaContainer;
let topLeftPageNumber;
let areNotesSavedIcon;
let list;
let listContainer;
let wikipediaBrainAnimation;
let bottomLeftGeneralInfo;
let generalInfoPageNumberEle;
let uploadFolder;
let morePages;
let toolBar;
let brain;
let border;
let stickyNotesTextArea;
let stickyNotes;
let workspace;
let tabs;
let openCalendar;
let flashcardPrac;
let myForm;
let letterCount;
let wordCount;
let mode;
let previewContent;
let brDots;
let yellowButtons;
let bottomRightTools;
let searchBar;

function setup_dom_refs() {
  notesTextArea = document.getElementById("notesTextArea");
  notesPreviewArea = document.getElementById("notesPreviewArea");
  mainContainer = document.getElementById("mainContainer");
  notesAreaContainer = document.getElementById("notesAreaContainer");
  topLeftPageNumber = document.getElementById("topLeftPageNumbers");
  areNotesSavedIcon = document.getElementById("areNotesSavedIcon");
  list = document.getElementById("listOfBooks");
  listContainer = document.getElementById("listContainer");
  wikipediaBrainAnimation = document.getElementById("wikipediaBrainAnimation");
  bottomLeftGeneralInfo = document.getElementById("bottomLeftGeneralInfo");
  generalInfoPageNumberEle = document.getElementById("generalInfoPageNumber");
  uploadFolder = document.getElementById("yourUploads");
  morePages = document.getElementById("morePages");
  toolBar = document.getElementById("toolBar");
  brain = document.getElementById("icon8");
  border = document.getElementById("border");
  stickyNotesTextArea = document.getElementById("stickyNotesTextArea");
  stickyNotes = document.getElementById("stickyNotes");
  workspace = document.getElementById("workspace");
  tabs = document.getElementById("tabs");
  openCalendar = document.getElementById("openCalendar");
  flashcardPrac = document.getElementById("flashcardsPrac");
  myForm = document.getElementById("myForm");
  letterCount = document.getElementById("letterCount");
  wordCount = document.getElementById("wordCount");
  mode = document.getElementById("generalInfoViewMode");
  previewContent = document.getElementById("fill");
  brDots = document.getElementById("brDots");
  yellowButtons = document.getElementById("yellowButtons");
  bottomRightTools = document.getElementById("bottomRightTools");
  searchBar = document.getElementById("searchBar");
}
