let mediaScreen = window.matchMedia("(max-width: 1170px)")

async function createList() {
    const response = await fetch("/api/get/everything")
    const json = await response.json();
    const result = json["data"];
    let listedItems = [];
    if(mediaScreen.matches) {
        listedItems.push(`<div class = "item" onclick = 'forceUpdate()'><h2 style = 'color: rgba(116, 222, 152);'>Refresh Notes</h2></div>`)
    }
    for (let i = result.length-1; i >= 0; i--) {
        let links = []
        for (let j = 0; j < result[i]["length"]; j++)
        {
            links.push(`<h3><a href = '/${result[i]["name"]}?${(j+1)}'>Page ${(j+1)}</a></h3>`)
        }
        listedItems.push(`<div class = "item" data-pos="up" onclick = "dropDown(this)"><h2>${result[i]["name"]}</h2><br>${links.join('')}</div>`)
    }
    document.getElementById("list").innerHTML = listedItems.join('');
}

const sendThis = location.pathname.substring(1);
const webhook = document.getElementById("discord_webhook").innerText || "";
document.getElementById("discord_webhook").remove()
let cantab;
let allowWiki = true;
let currLine = "";
let temp;
let notyf = new Notyf();
const notesTextArea = document.getElementById("in");
const notesPreviewArea = document.getElementById("notes");
const notesAreaContainer = document.getElementById("notesArea");
const topRightPageNumber = document.getElementById("pageNumber");

if(sendThis === "home") temp = true; else temp = false;
const atHome = temp;

if (sendThis.includes("/")) {
    location.href = "/" + sendThis.substring(0, sendThis.length - 1);
}

tippy('#icon1', {
    content: 'Save (Ctrl + S)',
});
tippy('#icon2', {
    content: 'Open',
});
tippy('#icon3', {
    content: 'Delete',
});
tippy('#icon4', {
    content: 'Insert Image',
});
tippy('#icon5', {
    content: 'Toggle Preview (Ctrl + E)',
});
tippy('#icon6', {
    content: 'Prev Page',
});
tippy('#icon7', {
    content: 'Next Page',
});

let pgN = parseInt(location.search.substring(1)) - 1 || 0;
let book = [""];

function accents() {
    notesTextArea.value = book[pgN];
    notesPreviewArea.innerHTML = format(notesTextArea.value);
    topRightPageNumber.innerText = pgN + 1;
    window.history.replaceState({}, '', `${sendThis}?${(pgN + 1)}`);
    updateNotes()
}

function addPage(goBack, amount) {
    if (goBack) {
        if (pgN > 0) {
            pgN -= amount;
            accents()
        }
    } else if(!(book[pgN] === null || book[pgN] === "" || book[pgN] === "undefined")) {
        pgN += amount;
        accents()
    } else {
        notyf.error('You should make sure you have no blank pages before creating a new one')
    }
}

let lastPage;

function jumpTo(desired) {
    let writtenPages = []
    for (let i = 0; i < book.length; i++) {
        if (!(book[i] === null || book[i] === "" || book[i] === "undefined")) {
            writtenPages.push(book[i]);
        }
    }
    if(desired > writtenPages.length) {
        notyf.error('You should make sure you have no blank pages before creating a new one')
    } else {
        pgN = desired;
        accents()
    }
}

let s = "";

async function leftOff(goAgain) {
    if(!atHome) {
            s = document.getElementById("bookSave").innerText;
            book = JSON.parse(localStorage.getItem(sendThis)) || [""]
            accents()
            if (s !== "") {
                localStorage.setItem(sendThis, s);
            }
            if ((notesPreviewArea.innerHTML === "undefined" || notesPreviewArea.innerHTML === "") && goAgain) {
                notesTextArea.readOnly = true;
                leftOff(false);
            }
            syncStatus(s);
            notesTextArea.readOnly = false;
    }
}

function forceUpdate() {
    if(confirm("Are you sure?")) {
        s = document.getElementById("bookSave").innerText;
        localStorage.setItem(sendThis, s);
        book = JSON.parse(localStorage.getItem(sendThis)) || [""]
        accents()
        syncStatus(s);
        hideList();
    }
}

function pagey() {
    let z;
    let content = [topRightPageNumber.innerHTML]
    if (book.length > 9) {
        for (z = 0; z < 9; z++) {
            content.push(`<br><span class = 'whereTo' id = 'whereTo${z}' onmouseover = 'toolTip(this);' onclick = 'jumpTo(${z});'>&nbsp;${z + 1}&nbsp;&nbsp;</span>`);
        }
        content.push(`<br><span class = 'whereTo' id = 'morePages' onclick = 'jumpTo(${book.length - 1});'>&nbsp;...&nbsp;&nbsp;</span>`);
    } else {
        for (z = 0; z < book.length; z++) {
            content.push(`<br><span class = 'whereTo' id = 'whereTo${z}' onmouseover = 'toolTip(this);' onclick = 'jumpTo(${z});'>&nbsp;${z + 1}&nbsp;&nbsp;</span>`);
        }
    }
    content.push(`<br><span class = 'whereTo' id = 'newPage' onclick = 'jumpTo(${book.length});'>&nbsp;+&nbsp;&nbsp;</span>`);
    topRightPageNumber.innerHTML = content.join('');

    tippy('#newPage', {
        content: "New Page",
        placement: 'right-start',
    });
    tippy('#morePages', {
        content: (book.length - 9) + " more pages are hidden",
        placement: 'right-start',
    });
}

function toolTip(ele) {
    let bry = ele.innerText.trim() - 1;
    tippy('#whereTo' + bry, {
        content: format(book[bry].substring(0, 95)) + "...",
        placement: 'right-start',
    });
}

notesTextArea.addEventListener("input", e => {
    let num = 0;
    let start = notesTextArea.selectionStart;
    e.target.value = e.target.value.replaceAll("  ", function(){num = 1; return ' ';});
    notesTextArea.selectionStart = notesTextArea.selectionEnd = start - num;
    updateNotes();
});

document.getElementById("icon8").addEventListener("contextmenu", e => {
    e.preventDefault();
    allowWiki = !allowWiki;
    if(allowWiki) {
        document.getElementById("icon8").style.filter = "inherit";
    } else {
        document.getElementById("icon8").style.filter = "grayscale(1)";
    }
    notyf.success(`allowWiki was set to ${allowWiki}`)
});

function getLinePos() {
    //substring from 0 to caret position
    let toCaret = notesTextArea.value.substring(0, notesTextArea.selectionStart)
    //substring from caret position onwards
    let fromCaret = notesTextArea.value.substring(notesTextArea.selectionStart)
    if(toCaret.substring(toCaret.lastIndexOf("\n")) + fromCaret.substring(0, fromCaret.indexOf("\n")) !== "\n") {
        currLine = toCaret.substring(toCaret.lastIndexOf("\n")+1) + fromCaret.substring(0, fromCaret.indexOf("\n"))
    }
}

// https://stackoverflow.com/a/6637396
notesTextArea.addEventListener('keydown', function (e) {
    if (e.key === 'Tab' && cantab) {
        e.preventDefault();
        let start = this.selectionStart;
        let end = this.selectionEnd;
        this.value = this.value.substring(0, start) + "\t" + this.value.substring(end);
        this.selectionStart = this.selectionEnd = start + 1;
    }
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

function getBlocks(str) {
    let matches = []

    str.replace(/```([\s\S]+?)```/g, function (string, match) {
        matches.push(match)
    });

    return matches;
}

function formatNormal() {
    let str = getBlocks(notesTextArea.value)
    //Formatting code blocks and creating tooltips to delete image
    let blocks = document.getElementsByClassName("codeBlock")
    for (let i = 0, n = blocks.length; i < n; i++) {
        blocks[i].innerText = str[i]
    }
    let userHtml = document.getElementsByClassName("userHtml")
    for (let i = 0; i < userHtml.length; i++) {
        userHtml[i].innerText = userHtml[i].innerHTML
    }
    let imgs = document.getElementsByClassName("userImage")
    for (let i = 0, n = imgs.length; i < n; i++) {
        imgs[i].addEventListener("mouseover", (event) => {
            imageTip(imgs[i])
        });
    }
    let links = document.getElementsByClassName("userLink")
    for (let i = 0, n = links.length; i < n; i++) {
        links[i].href = "https://" + links[i].innerText;
    }
}

function updateNotes() {
    book[pgN] = notesTextArea.value;
    localStorage.setItem(sendThis, JSON.stringify(book));
    formatNormal();
    syncStatus(s);
}

let image;

async function removeImage() {
    let imageTo = image + "";
    let occ = "!(" + imageTo.substring(imageTo.indexOf("/uploads/")) + ")";
    const imageDeleteStatus = await fetch("/api/delete/images/" + imageTo.substring(imageTo.indexOf("/uploads/") + 9), {
        method: "DELETE",
    })
    if (imageDeleteStatus.ok) {
        notesTextArea.value = notesTextArea.value.replaceAll(occ, "");
        updateNotes();
        notePost();
    } else {
        notyf.error(`${imageDeleteStatus.status} Error`)
    }
}

function imageTip(given) {
    image = given.src;
    tippy('.userImage', {
        content: "<span onclick = 'removeImage()' style = 'color: lightblue; cursor: pointer; text-decoration: underline;'>Delete Image</span>",
        placement: 'right-start',
        interactive: true,
    });
}

function format(str) {
    str = str.replace(new RegExp("(<.*?>)(.*?)(</.*?>)", 'g'), "<pre class = 'userHtml'>$1$2$3</pre>")
    str = str.replaceAll("[ ]", "<input type='checkbox' disabled='disabled'></input>")
    str = str.replaceAll("[x]", "<input type='checkbox' disabled='disabled' checked='checked'></input>")
    str = str.replace(/^(?:# )\s*(.+?)[ \t]*$/gm, "<h1>$1</h1>")
    str = str.replace(/^(?:## )\s*(.+?)[ \t]*$/gm, "<h2>$1</h2>")
    str = str.replace(/^(?:### )\s*(.+?)[ \t]*$/gm, "<h3>$1</h3>")
    str = str.replace(/^(?:- )\s*(.+?)[ \t]*$/gm, "<li class = 'unorder'>$1</li>")
    str = str.replace(/^(?:([0-9]*)[.] )\s*(.+?)[ \t]*$/gm, "<li class = 'order'><span class = 'marked'>$1. </span>$2</li>")
    str = str.replace(new RegExp("!!(?! )(.+?)(?<! )!!", 'g'), "<span class = 'red'>$1</span>")
    str = str.replace(new RegExp("\\*\\*(?! )(.+?)(?<! )\\*\\*", 'g'), "<b>$1</b>")
    str = str.replace(new RegExp("__(?! )(.+?)(?<! )__", 'g'), "<u>$1</u>")
    str = str.replace(new RegExp("\\\\\\\\(?! )(.+?)(?<! )\\\\\\\\", 'g'), "<i>$1</i>")
    str = str.replace(new RegExp("https://(?! )(.+?[^\n ]*)", 'g'), "<a class = 'userLink'>$1</a> ")
    str = str.replace(new RegExp("!\\((?! )(.+?)(?<! )\\)", 'g'), "<img class = 'userImage' src = '$1' loading = 'lazy'>")
    str = str.replace(new RegExp("==(?! )(.+?)(?<! )==", 'g'), "<mark>$1</mark>")
    //str = str.replace(new RegExp("\\|\\|(?! )(.+?)(?<! )\\|\\|", 'g'), "<span class ='spoiler'>$1</span>")
    str = str.replace(new RegExp("~~(?! )(.+?)(?<! )~~", 'g'), "<s>$1</s>")
    str = str.replace(new RegExp("\\^(?! )(.+?[^\n )]*)", 'g'), "<sup>$1</sup>")
    str = str.replace(new RegExp("\\((.+?)\\)f\\((.+?)\\)", 'g'), "<sub>$1</sub><span style = 'font-size: 1.25em;'>&int;</span><sup>$2</sup>")
    str = str.replace(/(?:\r\n|\r|\n)/g, '<br>')
    str = str.replace(new RegExp("```(.+?)```", 'g'), "<pre class = 'codeBlock'>$1</pre>")
    return DOMPurify.sanitize(str)
}

async function removeNote() {
    const noteDeleteStatus = await fetch("/api/delete/notebooks/" + sendThis, {
        method: "DELETE",
    })
    if (noteDeleteStatus.ok) {
        notyf.success(`Notebook has been deleted from the database (${noteDeleteStatus.status})`)
        s = "";
        syncStatus(s);
    } else {
        notyf.error(`${noteDeleteStatus.status} Error`)
    }
    createList();
}

async function notePost() {
    book[pgN] = notesTextArea.value;
    let sentArr = [];

    for (let i = 0; i < book.length; i++) {
        if (!(book[i] === null || book[i] === "" || book[i] === "undefined")) {
            sentArr.push(book[i]);
        }
    }
    if (sentArr.length === 0) {
        sentArr.push("")
    }
    book = sentArr;
    localStorage.setItem(sendThis, JSON.stringify(book));
    
    const saveStatus = await fetch("/api/save/notebooks/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: sendThis,
            NOTEBOOKSAVEHERE: localStorage.getItem(sendThis)
        })
    })
    if (saveStatus.ok) {
        document.getElementById("sync").style.animation = "saved 1s ease";
        setTimeout(() => {
            document.getElementById("sync").style.animation = "none";
        }, "1000");
        s = JSON.stringify(book);
        if (pgN > book.length - 1) {
            jumpTo(book.length - 1);
        } else {
            jumpTo(pgN);
        }
        syncStatus(s);
        createList();
        notyf.success(`Notebook saved successfully (${saveStatus.status})`)
    } else {
        notyf.error(`${saveStatus} Error`)
    }

    //Backup notebook to discord, if notebook is too long split it into multiple messages
    if (webhook !== false && webhook !== "") {
        let times = Math.ceil(localStorage.getItem(sendThis).length / 1994)
        backup(times)
        async function backup(times) {
            for (let i = 0; i < times * 1994; i += 1994) {
                let discordMsg = {
                    content: "```" + localStorage.getItem(sendThis).substring(i, i + 1994) + "```",
                    username: sendThis,
                    avatar_url: "https://cdn-icons-png.flaticon.com/512/1046/1046452.png",
                }
                const backupStatus = await fetch(webhook, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(discordMsg)
                })
                if (!backupStatus.ok) {
                    notyf.error(`${backupStatus.status} Error`)
                }
            }
        }
    }
}

function newP() {
    let newBookN = prompt("Enter a notebook name", sendThis)
    location.href = newBookN.replaceAll("/", "")
}

function del() {
    if (confirm("Are you sure you want to delete this notebook from the database?")) {
        removeNote()
    } else {
        notyf.error(`Notebook has not been removed`)
    }
}

function showInd(ele) {
    if (ele.getAttribute("data-pos") === "up") {
        pagey()
        ele.setAttribute("data-pos", "down")
    } else {
        hideInd()
    }
}
function hideInd() {
    if (topRightPageNumber.getAttribute("data-pos") === "down") {
        topRightPageNumber.innerHTML = pgN + 1;
        topRightPageNumber.setAttribute("data-pos", "up")
    }
}

if (!sendThis.includes("/")) {
    recentB = JSON.parse(localStorage.getItem("recents")) || [];
    if (!recentB.includes(sendThis) && recentB.length < 5 && !atHome) {
        recentB.unshift(sendThis)
         localStorage.setItem("recents", JSON.stringify(recentB))
    } else if (!recentB.includes(sendThis) && recentB.length >= 5 && !atHome) {
        recentB.pop()
        recentB.unshift(sendThis)
        localStorage.setItem("recents", JSON.stringify(recentB))
    }
}

if (atHome) {
    topRightPageNumber.style.display = "none";
    document.getElementById("nav").classList.add("homeNav");
    let content = ["# Recent Notes\n"];
    for (let i = 0; i < recentB.length; i++) {
        content.push(`\n${i+1}. ${recentB[i]}`);
    }
    notesTextArea.value = content.join('');
}

function syncStatus(response) {
    let isSynced = false;
    let writtenPages = []
    for (let i = 0; i < book.length; i++) {
        if (!(book[i] === null || book[i] === "" || book[i] === "undefined")) {
            writtenPages.push(book[i]);
        }
    }
    let rip = Math.abs(JSON.stringify(book).length - response.length)
    if (JSON.stringify(writtenPages) === response) {
        document.getElementById("sync").innerHTML = "<i style = 'background: linear-gradient(to right, #61da20, #0ab846 );background-clip: text;-webkit-text-fill-color: transparent;' id = 'grnBox' class='fa fa-cloud-upload'></i>";
        document.getElementById("nav").style.background = "rgba(116, 222, 152, 0.2)"
        tippy('#grnBox', {
            content: 'Notes are saved',
        });
        document.title = sendThis;
        inSynced = true;
    } else {
        document.getElementById("sync").innerHTML = "<i style = 'opacity: .6' id = 'grnBox' class='fa fa-cloud-upload'></i>";
        document.getElementById("nav").style.background = "rgba(138, 138, 138, 0.2)"
        tippy('#grnBox', {
            content: "Notes shown differ from saved notes by " + rip + " chars",
        });
        document.title = sendThis + " *"
    }
    return isSynced;
}

if (!atHome) {
    new Dropzone(document.body, {
        url: "/api/save/images",
        paramName: 'avatar',
        clickable: false,
        acceptedFiles: "image/jpeg,image/png,image/gif,image/webp",
        error: function () {
            notyf.error('There was an error uploading the image')
        },
        success: function (file, response) {
            file.previewElement.innerHTML = "";
            notesTextArea.value += "\n\n!(" + response + ")"
            updateNotes()
            notePost()
        }
    })
}

async function insertImage() {
    const formData = new FormData(document.getElementById("myForm"))
    const imageUploadStatus = await fetch("/api/save/images", {
        method: "POST",
        body: formData
    })
    if (imageUploadStatus.ok) {
        const response = await imageUploadStatus.text()
        notesTextArea.value += "\n\n!(" + response + ")"
        updateNotes()
        notePost()
    } else {
        notyf.error(`${imageUploadStatus.status} Error`)
    }
}

async function wikiSearch(event) {
    let selection = window.getSelection() + "";
    if (!(selection.includes("\n") || selection.length === 0) && allowWiki === true) {
        let wiki = selection.trim().replace(/ /g, '_').toLowerCase()
        document.body.style.cursor = "wait";
        const response = await fetch("https://en.wikipedia.org/api/rest_v1/page/summary/" + wiki + "?redirect=true", {
            method: "GET",
            cache: "default"
        })
        if (response.ok) {
            const result = await response.json()
            let summary = `<u>${selection.trim()}</u>:<br>${DOMPurify.sanitize(result['extract_html'])}<a href = 'https://en.wikipedia.org/wiki/${wiki}' target = '_blank'>Learn More</a> <i class = 'fa fa-external-link'></i>`
            document.getElementById("icon8").innerHTML = '<span id = "wikipedia">🧠</span>'
            tippy('#wikipedia', {
                content: "<div id = 'brain'>" + summary + "</div>",
                interactive: true,
                maxWidth: '500px',
            })
            moneyAnimation(event, "🧠");
        }
        document.body.style.cursor = "inherit"
    }
}

function moneyAnimation(mouseCoords, symbol) {
    document.getElementById("moneyAnimation").style.top = mouseCoords.clientY + "px"
    document.getElementById("moneyAnimation").style.left = mouseCoords.clientX + "px"
    // https://stackoverflow.com/a/69970674
    var moneyAnimation = document.createElement("p");
    moneyAnimation.innerText = symbol;
    document.getElementById("moneyAnimation").appendChild(moneyAnimation);
    moneyAnimation.classList.add("moneyAnimation"); // Add the class that animates
    setTimeout(() => {
        moneyAnimation.remove()
        moneyAnimation.classList.remove("moneyAnimation"); // Add the class that animates
    }, "1000");
}

let listShown = false

function showList() {
    if (listShown) {
        hideList()
    } else {
        document.getElementById("list").style.display = "inherit"
        document.getElementById("tab").style.left = "200px"
        listShown = true
        document.getElementById("mobileMenu").style.height = "4em";
        document.getElementById("mobileMenu").style.width = "4em";
    }
}

function hideList() {
    document.getElementById("list").style.display = "none"
    document.getElementById("tab").style.left = "0px"
    listShown = false
    document.getElementById("mobileMenu").style.height = "3.5em";
    document.getElementById("mobileMenu").style.width = "3.5em";
}

function dropDown(ele) {
    if (ele.getAttribute("data-pos") === "up") {
        ele.style.height = ele.scrollHeight + "px"
        ele.setAttribute("data-pos", "down")
        ele.classList.add('itemWithLinks');
    } else {
        ele.style.height = "40px"
        ele.setAttribute("data-pos", "up")
        ele.classList.remove('itemWithLinks');
    }
}

//toggle visibility of textarea
function toggle() {
    if (localStorage.getItem("viewPref") === null || localStorage.getItem("viewPref") === "visible") notEditable()
    else editable()
}

//check user choice about textarea and apply it.
function inputVisible() {
    if (localStorage.getItem("viewPref") === null || localStorage.getItem("viewPref") === "visible") editable()
    else notEditable()
}

function editable() {
    cantab = true;
    if(!atHome) notesTextArea.readOnly = false;
    notesAreaContainer.classList.add("editable");
    notesAreaContainer.classList.remove("uneditable");
    document.getElementById("tab").style.backgroundColor = "silver"
    document.getElementById("mobileMenu").style.backgroundColor = "silver"
    localStorage.setItem("viewPref", "visible")
}

function notEditable() {
    notesPreviewArea.innerHTML = format(notesTextArea.value);
    formatNormal();
    cantab = false;
    notesTextArea.readOnly = true;
    notesAreaContainer.classList.add("uneditable");
    notesAreaContainer.classList.remove("editable");
    document.getElementById("tab").style.backgroundColor = "rgb(116, 222, 152)"
    document.getElementById("mobileMenu").style.backgroundColor = "rgb(116, 222, 152)"
    localStorage.setItem("viewPref", "invis")
}
