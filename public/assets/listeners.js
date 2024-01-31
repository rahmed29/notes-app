const emptyOlist = /^[0-9]+\.\s$/i;
const olist = /^[0-9]+\.\s.+/i;
const ulist = /^-\s.+/i;

// https://stackoverflow.com/a/6637396
notesTextArea.addEventListener('keydown', function (e) {
    if (e.key === 'Tab' && cantab) {
        e.preventDefault();
        let start = this.selectionStart;
        let end = this.selectionEnd;
        this.value = this.value.substring(0, start) + "\t" + this.value.substring(end);
        this.selectionStart = this.selectionEnd = start + 1;
    } else if (e.key === "Enter" && !e.shiftKey) {
        if(currLine === "- ") {
            e.preventDefault()
            let start = this.selectionStart;
            let end = this.selectionEnd;
            this.value = this.value.substring(0, start-2) + this.value.substring(end);
            this.selectionStart = this.selectionEnd = start - 2;
        } else if (emptyOlist.test(currLine)) {
            e.preventDefault()
            let back = currLine.substring(0, currLine.indexOf(". ")).length + 2;
            let start = this.selectionStart;
            let end = this.selectionEnd;
            this.value = this.value.substring(0, start-back) + this.value.substring(end);
            this.selectionStart = this.selectionEnd = start - back;
        }
        else if(olist.test(currLine)) {
            // Add item to ordered list
            e.preventDefault()
            let num = parseInt(currLine.substring(0,currLine.indexOf("."))) + 1;
            let start = this.selectionStart;
            let end = this.selectionEnd;
            this.value = this.value.substring(0, start) + "\n" + num + ". " + this.value.substring(end);
            this.selectionStart = this.selectionEnd = start + (num + "").length + 3;
        } else if (ulist.test(currLine)) {
            // Add item to unordered list
            e.preventDefault()
            let start = this.selectionStart;
            let end = this.selectionEnd;
            this.value = this.value.substring(0, start) + "\n- " + this.value.substring(end);
            this.selectionStart = this.selectionEnd = start + 3;
        }
        updateNotes();
        syncStatus(s);
    }
});

notesTextArea.addEventListener("input", function (e) {
    let num = 0;
    let start = this.selectionStart;
    e.target.value = e.target.value.replaceAll("  ", function(){num = 1; return ' ';});
    this.selectionStart = this.selectionEnd = start - num;
    updateNotes();
});

document.getElementById("icon8").addEventListener("contextmenu", function(e) {
    e.preventDefault();
    allowWiki = !allowWiki;
    if(allowWiki) {
        this.style.filter = "inherit";
    } else {
        this.style.filter = "grayscale(1)";
    }
    notyf.success(`allowWiki was set to ${allowWiki}`)
});

notesTextArea.addEventListener('keyup', () => {
    getLinePos();
});


notesTextArea.addEventListener('mouseup', () => {
    getLinePos();
});

document.addEventListener('keydown', e => {
    if ((e.ctrlKey && e.key === 's') && !atHome) {
        e.preventDefault();
        notePost();
    } else if ((e.ctrlKey && e.key === 'e')) {
        e.preventDefault();
        toggle();
    }
});

topLeftPageNumber.addEventListener('click', function(e) {
    showInd(this);
});

document.getElementById("mobileMenu").addEventListener('click', function(e) {
    showList();
});

document.getElementById("nav").addEventListener('click', function(e) {
    hideInd();
});

document.getElementById("icon1").addEventListener('click', function(e) {
    notePost();
});

document.getElementById("icon2").addEventListener('click', function(e) {
    newP();
});

document.getElementById("icon3").addEventListener('click', function(e) {
    del();
});

document.getElementById("getFile1").addEventListener('change', function(e) {
    insertImage();
});

document.getElementById("icon5").addEventListener('click', function(e) {
    toggle();
});

document.getElementById("icon6").addEventListener('click', function(e) {
    addPage(true, 1);
});

document.getElementById("icon7").addEventListener('click', function(e) {
    addPage(false, 1);
});

document.getElementById("tab").addEventListener('click', function(e) {
    showList();
});

notesAreaContainer.addEventListener('click', function(e) {
    hideInd();
    hideList();
    hideDiff();
});

notesPreviewArea.addEventListener('click', function(e) {
    hideInd();
    hideList();
    hideDiff();
    wikiSearch(e);
});