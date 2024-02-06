const sendThis = location.pathname.substring(1);
let haveToUpdateList = false;
let allowWiki = true;
const notyf = new Notyf();
const notesTextArea = document.getElementById("in");
const notesPreviewArea = document.getElementById("notes");
const notesAreaContainer = document.getElementById("notesArea");
const topLeftPageNumber = document.getElementById("pages");
const grnBox = document.getElementById("grnBox");
let list = document.getElementById("list");

const atHome = sendThis ==="home" ? true : false

if (sendThis.includes("/")) {
    location.href = "/" + sendThis.substring(0, sendThis.length - 1);
}

const tips = ['Save (Ctrl + S)', 'Delete', 'Insert Image', 'Switch View (Ctrl + E)', 'Prev Page', 'Next Page']
for(let i = 0; i < 6; i++) {
    tippy(`#icon${i+1}`, {
        theme: 'light',
        content: tips[i],
    }); 
}

let wikipediaTippy = tippy('#wikipedia', {
    theme: 'light',
    content: `<div id = 'brain'>Highlight text in read mode to receive info about it here</div>`,
    interactive: true,
    maxWidth: '500px'
})[0];

let synced = tippy('#grnBox', {
    theme: 'light',
    content: 'Notes are saved',
    interactive: true,
})[0];

let editingMode = tippy('#mode', {
    theme: 'light',
    content: localStorage.getItem("viewPref"),
    placement: 'top',
})[0];

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

function updateCurrentItem() {
    let links = []
    for (let j = 0, n =  book.length; j < n; j++)
    {
        links.push(`<a href = '/sendThis?${(j+1)}'><div class = 'linkWrapper'><span>${book[j].substring(0,35)}...</span></div></a>`)
    }
    links.push(`<div class = "item" data-pos="up" data-bn="${result[i]["name"]}" onclick = "dropDown(this)"><div class = 'listHeader'>${result[i]["name"]}</div>${links.join('')}</div>`)
    document.getElementById("lockedItem").innerHTML = links.join('');
}

function search(term) {
    let items = document.getElementsByClassName("item");
    for(let i = 0, n = items.length; i < n; i++) {
        items[i].style.display = "inherit";
        if(!items[i].getAttribute("data-bn").toLowerCase().includes(term.toLowerCase())) {
            items[i].style.display = "none";
        }
    }
}

function collapseAll() {
    let items = document.getElementsByClassName("item");
    for(let i = 0, n = items.length; i < items.length; i++) {
        items[i].setAttribute("data-pos", "up");
        items[i].style.height = "2em";
        items[i].classList.remove('itemWithLinks');
    }
}

function accents() {
    notesTextArea.value = book[pgN];
    window.history.replaceState({}, '', `${sendThis}?${(pgN + 1)}`);
    updateNotes()
    pagey();
}

function addPage(goBack, amount) {
    if (goBack) {
        if (pgN > 0) {
            pgN -= amount;
            accents()
        }
    } else if(!(book[pgN] == undefined || book[pgN] === "" || book[pgN] === "undefined")) {
        if(pgN === book.length-1 || pgN + amount >= book.length) {
            book.push("")
        }
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
    } else  if (desired < pgN) {
        addPage(true, pgN-desired)
    } else if (desired > pgN) {
        addPage(false, desired-pgN)
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
        hideDiff();
        notyf.success("Notes were pulled from database");
    }
}

function pagey() {
    document.getElementById("page").innerText = pgN+1;
    let content = []
    if (book.length > 9) {
        for (let z = 0; z < 9; z++) {
                content.push(`<span class = 'whereTo' id = 'whereTo${z}' onmouseover = 'toolTip(this);' onclick = 'jumpTo(${z});'>${z + 1}</span>`);      
        }
        content.push(`<span class = 'whereTo' id = 'morePages' onclick = 'jumpTo(${book.length-1});'>.</span>`);
    } else {
        for (let z = 0; z < book.length; z++) {
            content.push(`<span class = 'whereTo' id = 'whereTo${z}' onmouseover = 'toolTip(this);' onclick = 'jumpTo(${z});'>${z + 1}</span>`);     
        }
    }
    content.push(`<span class = 'whereTo' id = 'newPage' onclick = 'jumpTo(${book.length});'>+</span>`);
    topLeftPageNumber.innerHTML = content.join('');
    const currPage = document.getElementById(`whereTo${pgN}`) || document.getElementById(`morePages`)
    currPage.style.backgroundColor = "rgb(116, 222, 152)";
    currPage.style.color = "black";
    
    tippy('#newPage', {
        theme: 'light',
        content: "New Page",
        placement: 'right-start',
    })[0];

    tippy('#morePages', {
        theme: 'light',
        content: `${(book.length - 9)} more pages are hidden, you are on page ${pgN+1}`,
        placement: 'right-start',
    });
}

function toolTip(ele) {
    const bry = ele.innerText.trim() - 1;
    tippy(`#whereTo${bry}`, {
        theme: 'light',
        content: format(book[bry].substring(0, 95)) + "...",
        placement: 'right-start',
    });
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

function pad(str) {
    str = str + ""
    if (str.length > 5) {
        str = "9999+";
    } else if(str.length !== 5) {
        str = "0".repeat(5-str.length) + str;
    }
    return str;
}

function updateNotes() {
    notesPreviewArea.innerHTML = format(notesTextArea.value);
    document.getElementById("letterCount").innerText = pad(notesTextArea.value.length);
    document.getElementById("wordCount").innerText = pad(notesTextArea.value.split(" ").length);
    formatNormal();
    book[pgN] = notesTextArea.value;
    localStorage.setItem(sendThis, JSON.stringify(book));
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
        content: "<span onclick = 'removeImage()' style = 'color: blue; cursor: pointer; text-decoration: underline;'>Delete Image</span>",
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
            content: localStorage.getItem(sendThis),
        })
    })
    if (saveStatus.ok) {
        grnBox.classList.add("saved")
        grnBox.addEventListener('animationend', () => {
            grnBox.classList.remove("saved")
        });
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
    if (list.getAttribute("data-pos") === "hidden") {
        haveToUpdateList = true;
    }
}

function newP() {
    let newBookN = prompt("Enter a notebook name", sendThis)
    try {
        location.href = newBookN.replaceAll("/", "")
    } catch(err) { return }
}

function del() {
    if (confirm("Are you sure you want to delete this notebook from the database?")) {
        removeNote()
    } else {
        notyf.error(`Notebook has not been removed`)
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
    topLeftPageNumber.style.display = "none";
    document.getElementById("nav").classList.add("homeNav");
    let content = ["# Recent Notes\n"];
    for (let i = 0, n = recentB.length; i < n; i++) {
        content.push(`\n${i+1}. [[${recentB[i]}]]`);
    }
    notesTextArea.value = content.join('');
    updateNotes();
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
        grnBox.style.filter = "none"
        fluentemoji.parse("#grnBox");

        synced.setContent("Notes are saved")
        document.title = sendThis;
    } else {
        grnBox.style.filter = "grayscale(1)"
        fluentemoji.parse("#grnBox");
        synced.setContent(
            `Notes shown differ from saved notes by ${Math.abs(JSON.stringify(book).length - response.length)} chars
            <br><br>
            <span onclick = 'diff()' style = 'color: darkcyan; cursor: pointer; text-decoration: underline;'>More details</span>
            <br><br>
            <span onclick = 'forceUpdate()' style = 'color: orange; cursor: pointer; text-decoration: underline;'>Force update</span>`
        )
        document.title = sendThis + " *"
    }
}

function getDiff(one, other) {
    let span = null;

    const diff = Diff.diffChars(one, other);
    const fragment = document.createDocumentFragment();

    diff.forEach((part) => {
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
            fluentemoji.parse("#wikipedia");
            wikipediaTippy.setContent(`<div id = 'brain'>${summary}</div>`);
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
    moneyAnimation.addEventListener('animationend', () => {
        moneyAnimation.remove()
    });
}

function toggleList() {
    if (list.getAttribute("data-pos") === "shown") {
        notesAreaContainer.style.width = "calc(100% - 1em)";
        list.style.display = "none"
        list.setAttribute("data-pos", "hidden");
    } else {
        notesAreaContainer.style.width = "calc(100% - 1em - 15%)";
        list.setAttribute("data-pos", "shown");
        list.style.display = "inline"
        if(haveToUpdateList) {
            createList();
            haveToUpdateList = false;
        }
    }
}

function dropDown(ele) {
    if (ele.getAttribute("data-pos") === "up") {
        ele.style.height = ele.scrollHeight + "px"
        ele.setAttribute("data-pos", "down")
        ele.classList.add('itemWithLinks');
    } else if(ele.getAttribute("data-pos") === "down") {
        ele.style.height = "2em"
        ele.setAttribute("data-pos", "up")
        ele.classList.remove('itemWithLinks');
    }
}

//check user choice about textarea and apply it.
function inputVisible() {
    let viewPref = localStorage.getItem("viewPref");
    if (viewPref === null) {
        localStorage.setItem("viewPref", "split");
    } else {
        editingWindow(viewPref)
    }
}

//toggle visibility of textarea
function toggle() {
    let viewPref = localStorage.getItem("viewPref");
    if(viewPref === "split") {
        localStorage.setItem("viewPref", "write");
    } else if (viewPref === "write") {
        localStorage.setItem("viewPref", "read");
    } else if (viewPref === "read") {
        localStorage.setItem("viewPref", "split");
    }
    editingWindow(localStorage.getItem("viewPref"))
}

function editingWindow(choice) {
    const mode = document.getElementById("mode");
    if(choice === "read") {
        mode.innerText = "R";
        notesTextArea.readOnly = true;
        notesPreviewArea.style.display = "inline";
        notesTextArea.style.display = "none";
        notesPreviewArea.style.width = "100%";
        notesPreviewArea.style.paddingLeft = "20%";
        notesPreviewArea.style.paddingRight = "20%";
        localStorage.setItem("viewPref", "read")
    } else if (choice === "write") {
        mode.innerText = "W";
        notesTextArea.readOnly = false;
        notesPreviewArea.style.display = "none";
        notesTextArea.style.display = "inline";
        notesTextArea.style.width = "100%";
        notesTextArea.style.paddingLeft = "20%";
        notesTextArea.style.paddingRight = "20%";
        localStorage.setItem("viewPref", "write")
    } else {
        mode.innerText = "S";
        notesTextArea.readOnly = false;
        notesPreviewArea.style.display = "inline";
        notesTextArea.style.display = "inline";
        notesPreviewArea.style.width = "50%";
        notesTextArea.style.width = "50%";
        notesTextArea.style.paddingLeft = "5%";
        notesTextArea.style.paddingRight = "5%";
        notesPreviewArea.style.paddingLeft = "5%";
        notesPreviewArea.style.paddingRight = "5%";
        localStorage.setItem("viewPref", "split")
    }
    notesPreviewArea.scrollTop = 0;
    notesTextArea.scrollTop = 0;
    notesAreaContainer.focus();
    editingMode.setContent(choice);
}

leftOff(true);
inputVisible();
createList()
pagey();
fluentemoji.parse("#nav");
if(book[pgN] == null || book[pgN] === "" || book[pgN] === "undefined") {
    pgN = 0;
    leftOff(false)
    accents();
}