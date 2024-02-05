notesTextArea.addEventListener("input", function (e) {
    hideDiff();
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

document.addEventListener('keydown', e => {
    if ((e.ctrlKey && e.key === 's') && !atHome) {
        e.preventDefault();
        notePost();
    } 
    else if ((e.ctrlKey && (e.key === 'e' || e.key === 'E'))) {
        e.preventDefault();
        toggle();
    }
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

document.getElementById("retract").addEventListener('click', function(e) {
    toggleList();
});

notesAreaContainer.addEventListener('click', function(e) {
    hideDiff();
});

notesPreviewArea.addEventListener('click', function(e) {
    hideDiff();
    wikiSearch(e);
});