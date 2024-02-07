let mediaScreen = window.matchMedia("(max-width: 390px) and (max-height: 844px) and (-webkit-device-pixel-ratio: 3)")

// if(mediaScreen.matches) {
//     document.getElementById("icon1").innerHTML = "<i class = 'fa fa-save' style = 'color: violet'></i>"
//     document.getElementById("icon2").innerHTML = "<i class = 'fa fa-folder-open' style = 'color: tan'></i>"
//     document.getElementById("icon3").innerHTML = "<i class = 'fa fa-trash' style = 'color: silver;'></i>"
//     document.getElementById("labelForImage").innerHTML = "<i class = 'fa fa-image' style = 'color: orange;'></i>"
//     document.getElementById("icon5").innerHTML = "<i class = 'fa fa-pencil' style = 'color: yellow;'></i>"
//     document.getElementById("icon6").innerHTML = "<i class = 'fa fa-arrow-circle-left' style = 'color: rgba(116, 222, 152)'></i>"
//     document.getElementById("icon7").innerHTML = "<i class = 'fa fa-arrow-circle-right' style = 'color: rgba(116, 222, 152)'></i>"
// }

const sendThis = location.pathname.substring(1);
let cantab;
let allowWiki = true;
let currLine = "";
const notyf = new Notyf({
    position: {
        y: 'top'
    },
    dismissible: true
});
const notesTextArea = document.getElementById("in");
const notesPreviewArea = document.getElementById("notes");
const notesAreaContainer = document.getElementById("notesArea");
const topLeftPageNumber = document.getElementById("pageNumber");

const atHome = sendThis ==="home" ? true : false

if (sendThis.includes("/")) {
    location.href = "/" + sendThis.substring(0, sendThis.length - 1);
}

tippy('#icon1', {
    theme: 'light',
    content: 'Save (Ctrl + S)',
});
tippy('#icon2', {
    theme: 'light',
    content: 'Open',
});
tippy('#icon3', {
    theme: 'light',
    content: 'Delete',
});
tippy('#icon4', {
    theme: 'light',
    content: 'Insert Image',
});
tippy('#icon5', {
    theme: 'light',
    content: 'Toggle Preview (Ctrl + E)',
});
tippy('#icon6', {
    theme: 'light',
    content: 'Prev Page',
});
tippy('#icon7', {
    theme: 'light',
    content: 'Next Page',
});

let pgN = parseInt(location.search.substring(1)) - 1 || 0;
let book = [""];

async function createList() {
    let currBook;
    const response = await fetch("/api/get/everything")
    const json = await response.json();
    const result = json["data"];
    let listedItems = [];
    for (let i = result.length-1; i >= 0; i--) {
        let links = []
        for (let j = 0, n =  result[i]["length"]; j < n; j++)
        {
            links.push(`<a href = '/${result[i]["name"]}?${(j+1)}'><div class = 'linkWrapper'><span>${result[i]["excerpt"][j]}...</span></div></a>`)
        }
        if(result[i]["name"] === sendThis) {
            currBook = `<div class = "item" id = "lockedItem" data-pos="up" data-bn="${result[i]["name"]}" onclick = "dropDown(this)"><div class = 'listHeader'>${result[i]["name"]}</div>${links.join('')}</div>`
        } else {
            listedItems.push(`<div class = "item" data-pos="up" data-bn="${result[i]["name"]}" onclick = "dropDown(this)"><div class = 'listHeader'>${result[i]["name"]}</div>${links.join('')}</div>`);
        }
    }
    listedItems.unshift(currBook)
    listedItems.unshift(`<div class = "searchItem"><input placeholder="Search..." id = "searchBar" oninput="search(this.value)"></div>`)
    list.innerHTML = listedItems.join('');
    ele = document.getElementById("lockedItem")
    ele.style.height = ele.scrollHeight + "px"
    ele.setAttribute("data-pos", "locked")
    ele.classList.add('itemWithLinks');
}

function search(term) {
    let items = document.getElementsByClassName("item");
    for(let i = 0; i < items.length; i++) {
        items[i].style.display = "inherit";
        if(!items[i].getAttribute("data-bn").toLowerCase().includes(term.toLowerCase())) {
            items[i].style.display = "none";
        }
    }
}

function collapseAll(e) {
    let items = document.getElementsByClassName("item");
    for(let i = 0, n = items.length; i < n; i++) {
        items[i].setAttribute("data-pos", "up");
        items[i].style.height = "2em";
        items[i].classList.remove('itemWithLinks');
    }
}

function accents() {
    notesTextArea.value = book[pgN];
    notesPreviewArea.innerHTML = format(notesTextArea.value);
    topLeftPageNumber.innerText = pgN + 1;
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

function jumpTo(desired) {
    let writtenPages = []
    for (let i = 0, n = book.length; i < n; i++) {
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
            if ((notesTextArea.value === "undefined" || notesTextArea.value === "") && goAgain) {
                notesTextArea.readOnly = true;
                leftOff(false);
            }
            //syncStatus(s);
            notesTextArea.readOnly = false;
    }
}

async function forceUpdate() {
    if(confirm("Are you sure?")) {
        const response = await fetch(`/api/get/notebooks/${sendThis}`)
        const json = await response.json();
        document.getElementById("bookSave").innerText = json["data"];
        s = document.getElementById("bookSave").innerText;
        localStorage.setItem(sendThis, s);
        book = JSON.parse(localStorage.getItem(sendThis)) || [""]
        accents()
        //syncStatus(s);
        hideList();
        hideDiff();
        notyf.success("Notes were pulled from database");
    }
}

function pagey() {
    let z;
    let content = [topLeftPageNumber.innerHTML]
    if (book.length > 9) {
        for (z = 0, n = 9; z < n; z++) {
            content.push(`<br><span class = 'whereTo' id = 'whereTo${z}' onmouseover = 'toolTip(this);' onclick = 'jumpTo(${z});'>&nbsp;${z + 1}&nbsp;&nbsp;</span>`);
        }
        content.push(`<br><span class = 'whereTo' id = 'morePages' onclick = 'jumpTo(${book.length - 1});'>&nbsp;...&nbsp;&nbsp;</span>`);
    } else {
        for (z = 0; z < book.length; z++) {
            content.push(`<br><span class = 'whereTo' id = 'whereTo${z}' onmouseover = 'toolTip(this);' onclick = 'jumpTo(${z});'>&nbsp;${z + 1}&nbsp;&nbsp;</span>`);
        }
    }
    content.push(`<br><span class = 'whereTo' id = 'newPage' onclick = 'jumpTo(${book.length});'>&nbsp;+&nbsp;&nbsp;</span>`);
    topLeftPageNumber.innerHTML = content.join('');

    tippy('#newPage', {
        theme: 'light',
        content: "New Page",
        placement: 'right-start',
    });
    tippy('#morePages', {
        theme: 'light',
        content: `${(book.length - 9)} more pages are hidden`,
        placement: 'right-start',
    });
}

function toolTip(ele) {
    let bry = ele.innerText.trim() - 1;
    tippy(`#whereTo${bry}`, {
        theme: 'light',
        content: format(book[bry].substring(0, 95)) + "...",
        placement: 'right-start',
    });
}

function getLinePos() {
    //substring from 0 to caret position
    let toCaret = notesTextArea.value.substring(0, notesTextArea.selectionStart)
    //substring from caret position onwards
    let fromCaret = notesTextArea.value.substring(notesTextArea.selectionStart)
    currLine = toCaret.substring(toCaret.lastIndexOf("\n")+1) + fromCaret.substring(0, fromCaret.indexOf("\n"))
}

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
    let occ = `!(${imageTo.substring(imageTo.indexOf("/uploads/"))})`;
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
        theme: 'light',
        content: "<span onclick = 'removeImage()' style = 'color: darkcyan; cursor: pointer; text-decoration: underline;'>Delete Image</span>",
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
    str = str.replace(new RegExp("\\|\\|(?! )(.+?)(?<! )\\|\\|", 'g'), "<span class ='spoiler'>$1</span>")
    str = str.replace(new RegExp("~~(?! )(.+?)(?<! )~~", 'g'), "<s>$1</s>")
    str = str.replace(new RegExp("\\[\\[(?! )(.+?)(?<! )\\]\\]", 'g'), "<a class = 'reference' href = '/$1'>$1</a>")
    str = str.replace(new RegExp("\\^(?! )(.+?[^\n )]*)", 'g'), "<sup>$1</sup>")
    str = str.replace(new RegExp("\\((.+?)\\)f\\((.+?)\\)", 'g'), "<sub>$1</sub><span style = 'font-size: 1.25em;'>&int;</span><sup>$2</sup>")
    str = str.replace(/(?:\r\n|\r|\n)/g, '<br>')
    str = str.replace(new RegExp("```(.+?)```", 'g'), "<pre class = 'codeBlock'>$1</pre>")
    return DOMPurify.sanitize(str)
}

async function removeNote() {
    const noteDeleteStatus = await fetch(`/api/delete/notebooks/${sendThis}`, {
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

    for (let i = 0, n = book.length; i < n; i++) {
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
            content: localStorage.getItem(sendThis)
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
        //syncStatus(s);
        createList();
        notyf.success(`Notebook saved successfully (${saveStatus.status})`)
    } else {
        notyf.error(`${saveStatus} Error`)
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
    topLeftPageNumber.innerHTML = pgN + 1;
    topLeftPageNumber.setAttribute("data-pos", "up")
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
    topLeftPageNumber.style.display = "none";
    document.getElementById("nav").classList.add("homeNav");
    let content = ["# Recent Notes\n"];
    for (let i = 0, n = recentB.length; i < n; i++) {
        content.push(`\n${i+1}. [[${recentB[i]}]]`);
    }
    notesTextArea.value = content.join('');
}

function syncStatus(response) {
    let writtenPages = []
    for (let i = 0, n = book.length; i < n; i++) {
        if (!(book[i] === null || book[i] === "" || book[i] === "undefined")) {
            writtenPages.push(book[i]);
        }
    }
    if(writtenPages.length === 0) {
        writtenPages.push("");
    }
    if (JSON.stringify(writtenPages) === response) {
        document.getElementById("sync").innerHTML = "<i id = 'grnBox'>&#9851;&#65039;</i>";
        fluentemoji.parse("#grnBox");
        document.getElementById("mobileSync").style.background = "#61da20";
        tippy('#grnBox', {
            theme: 'light',
            content: 'Notes are saved',
            interactive: true,
        });
        document.title = sendThis;
    } else {
        document.getElementById("sync").innerHTML = "<i style = 'filter: grayscale(1)' id = 'grnBox'>&#9851;&#65039;</i>";
        fluentemoji.parse("#grnBox");
        document.getElementById("mobileSync").style.background = "gray";
        tippy('#grnBox', {
            theme: 'light',
            content: `Notes shown differ from saved notes by ${Math.abs(JSON.stringify(book).length - response.length)} chars
            <br><br>
            <span onclick = 'diff()' style = 'color: darkcyan; cursor: pointer; text-decoration: underline;'>More details</span>
            <br><br>
            <span onclick = 'forceUpdate()' style = 'color: orange; cursor: pointer; text-decoration: underline;'>Force update</span>`,
            interactive: true,
        });
        document.title = sendThis + " *"
    }
}

function getDiff(one, other) {
    let span = null;

    const diff = Diff.diffChars(one, other);
    const fragment = document.createDocumentFragment();

    diff.forEach((part) => {
        // green for additions, red for deletions
        // grey for common parts
        const color = part.added ? '#33ff96 ' :
        part.removed ? '#ff5e5e' : 'rgba(0,0,0,0)';
        span = document.createElement('span');
        span.style.background = color;
        span.appendChild(document.createTextNode(part.value));
        fragment.appendChild(span);
    });
    return fragment;
}

function diff() {
    document.getElementById("currDiff").style.opacity = "1";
    document.getElementById("currDiff").style.visibility = "visible";
    const currDiff = document.getElementById("currDiff");
    let content = [];
    for(let i = 0, n = book.length; i < n; i++) {
        content.push(`<h3>Page ${i+1}</h3><div class = "pageDiff" id = "pageDiff${i}"></div><br>`);
    }
    currDiff.innerHTML = content.join("");
    for(let i = 0, n = book.length; i < n; i++) {
        try {
            document.getElementById(`pageDiff${i}`).appendChild(getDiff(JSON.parse(s)[i], book[i]))
        } catch(err) {
            const fragment = document.createDocumentFragment();
            span = document.createElement('span');
            span.style.background = "#21b6f7";
            span.appendChild(document.createTextNode(book[i]));
            fragment.appendChild(span);
            document.getElementById(`pageDiff${i}`).appendChild(fragment);
        }
    }
    notyf.success("Comparing your notes vs saved notes");
}

function hideDiff() {
    document.getElementById("currDiff").innerHTML = "";
    document.getElementById("currDiff").style.opacity = "0";
    document.getElementById("currDiff").style.visibility = "hidden"; 
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
            notesTextArea.value += `\n\n!(${response})`;
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
        notesTextArea.value += `\n\n!(${response})`;
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
        const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${wiki}?redirect=true`, {
            method: "GET",
            cache: "default"
        })
        if (response.ok) {
            const result = await response.json()
            let summary = `<u>${selection.trim()}</u>:<br>${DOMPurify.sanitize(result['extract_html'])}<a href = 'https://en.wikipedia.org/wiki/${wiki}' target = '_blank'>Learn More</a>`
            document.getElementById("icon8").innerHTML = '<span id = "wikipedia">&#129504;</span>'
            fluentemoji.parse("#wikipedia");
            tippy('#wikipedia', {
                theme: 'light',
                content: `<div id = 'brain'>${summary}</div>`,
                interactive: true,
                maxWidth: '500px',
            })
            moneyAnimation(event, "&#129504;");
        }
        document.body.style.cursor = "inherit"
    }
}

function moneyAnimation(mouseCoords, symbol) {
    document.getElementById("moneyAnimation").style.top = mouseCoords.clientY + "px"
    document.getElementById("moneyAnimation").style.left = mouseCoords.clientX + "px"
    // https://stackoverflow.com/a/69970674
    var moneyAnimation = document.createElement("p");
    moneyAnimation.innerHTML = symbol;
    document.getElementById("moneyAnimation").appendChild(moneyAnimation);
    moneyAnimation.classList.add("moneyAnimation"); // Add the class that animates
    fluentemoji.parse(".moneyAnimation");
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
        collapseAll();
        document.getElementById("list").style.display = "inherit"
        document.getElementById("tab").style.left = "15%"
        document.getElementById("mobileMenu").style.height = "4em";
        document.getElementById("mobileMenu").style.width = "4em";
        listShown = true
    }
}

function hideList() {
    document.getElementById("list").style.display = "none"
    document.getElementById("tab").style.left = "0px"
    document.getElementById("mobileMenu").style.height = "3.5em";
    document.getElementById("mobileMenu").style.width = "3.5em";
    listShown = false
}

function dropDown(ele) {
    if (ele.getAttribute("data-pos") === "up") {
        ele.style.height = ele.scrollHeight + "px"
        ele.setAttribute("data-pos", "down")
        ele.classList.add('itemWithLinks');
    } else {
        ele.style.height = "2em"
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
    document.getElementById("mobileMenu").style.backgroundColor = "rgb(116, 222, 152)"
    localStorage.setItem("viewPref", "invis")
}

leftOff(true);
inputVisible();
createList()
fluentemoji.parse("#nav");

let idk;

function getMessageEncoding() {
    let message = "Testing Testing 123";
    let enc = new TextEncoder();
    return enc.encode(message);
  }

async function encryptMessage() {
    let encoded = getMessageEncoding();
    idk = await window.crypto.subtle.encrypt(
      {
        name: "RSA-OAEP",
      },
      keyPair.publicKey,
      encoded,
    );
}

let msg;

async function decryptMessage() {
    msg = await window.crypto.subtle.decrypt(
      { name: "RSA-OAEP" },
      keyPair.privateKey,
      idk,
    );
    const str = new TextDecoder().decode(msg);
    return str;
  }
  

let keyPair;

async function keyGen() {
    let keys = await window.crypto.subtle.generateKey(
    {
        name: "RSA-OAEP",
        modulusLength: 4096,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"],
    );

    keyPair = keys;
}