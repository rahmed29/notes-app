const sendThis = location.pathname.substring(1);

let cantab;
let allowWiki = true;
let currLine = "";
const notyf = new Notyf();
const notesTextArea = document.getElementById("in");
const notesPreviewArea = document.getElementById("notes");
const notesAreaContainer = document.getElementById("notesArea");
const topLeftPageNumber = document.getElementById("pages");

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
    content: 'Switch View (Ctrl + E)',
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
    const response = await fetch("/api/get/everything")
    const json = await response.json();
    const result = json["data"];
    let listedItems = [`<div class = "searchItem"><input placeholder="Search..." id = "searchBar" oninput="search(this.value)"></div>`];
    for (let i = result.length-1; i >= 0; i--) {
        let links = []
        for (let j = 0, n =  result[i]["length"]; j < n; j++)
        {
            links.push(`<a href = '/${result[i]["name"]}?${(j+1)}'><div class = 'linkWrapper'><span>${result[i]["excerpt"][j]}...</span></div></a>`)
        }
        listedItems.push(`<div class = "item" data-pos="up" data-bn="${result[i]["name"]}" onclick = "dropDown(this)"><div class = 'listHeader'>${result[i]["name"]}</div>${links.join('')}</div>`)
    }
    document.getElementById("list").innerHTML = listedItems.join('');
    let items = document.getElementsByClassName("item");
    for(let i = 0, n = items.length; i < n; i++) {
        if(items[i].getAttribute("data-bn") === sendThis) {
            items[i].style.height = items[i].scrollHeight + "px"
            items[i].setAttribute("data-pos", "locked")
            items[i].classList.add('itemWithLinks');
            items[i].classList.add('lockedItem');
            break;
        }
    }
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
    // topLeftPageNumber.innerText = pgN + 1;
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
        hideDiff();
        notyf.success("Notes were pulled from database");
    }
}

function pagey() {
    let content = []
    for (let z = 0; z < book.length; z++) {
        if(z == pgN) {
            content.push(`<br><span style = 'background-color: rgba(116, 222, 152); color: #000;' class = 'whereTo' id = 'whereTo${z}' onmouseover = 'toolTip(this);' onclick = 'jumpTo(${z});'>${z + 1}</span>`);
        } else {
            content.push(`<br><span class = 'whereTo' id = 'whereTo${z}' onmouseover = 'toolTip(this);' onclick = 'jumpTo(${z});'>${z + 1}</span>`);
        }
    }
    content.push(`<br><span class = 'whereTo' id = 'newPage' onclick = 'jumpTo(${book.length});'>+</span>`);
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
    notesPreviewArea.innerHTML = format(notesTextArea.value);
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
        document.getElementById("sync").classList.add("saved")
        document.getElementById("sync").addEventListener('animationend', () => {
            document.getElementById("sync").classList.remove("saved")
          });
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
        document.getElementById("sync").innerHTML = "<i id = 'grnBox'>&#9851;&#65039;</i>";
        fluentemoji.parse("#grnBox");
        tippy('#grnBox', {
            theme: 'light',
            content: 'Notes are saved',
            interactive: true,
        });
        document.title = sendThis;
    } else {
        document.getElementById("sync").innerHTML = "<i style = 'filter: grayscale(1)' id = 'grnBox'>&#9851;&#65039;</i>";
        fluentemoji.parse("#grnBox");
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

function toggleList() {
    let list = document.getElementById("list");
    if (list.getAttribute("data-pos") === "shown") {
        notesAreaContainer.style.width = "calc(100% - 1em)";
        list.style.display = "none"
        list.setAttribute("data-pos", "hidden");
    } else {
        notesAreaContainer.style.width = "calc(100% - 1em - 15%)";
        list.setAttribute("data-pos", "shown");
        list.style.display = "inline"
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
    inputVisible()
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

function editingWindow(choice) {
    if(choice === "read") {
        notesTextArea.readOnly = true;
        notesPreviewArea.style.display = "inline";
        notesTextArea.style.display = "none";
        notesPreviewArea.style.width = "100%";
        notesPreviewArea.style.paddingLeft = "20%";
        notesPreviewArea.style.paddingRight = "20%";
        localStorage.setItem("viewPref", "read")
    } else if (choice === "write") {
        notesTextArea.readOnly = false;
        notesPreviewArea.style.display = "none";
        notesTextArea.style.display = "inline";
        notesTextArea.style.width = "100%";
        notesTextArea.style.paddingLeft = "20%";
        notesTextArea.style.paddingRight = "20%";
        localStorage.setItem("viewPref", "write")
    } else {
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
}

leftOff(true);
inputVisible();
createList()
pagey();
fluentemoji.parse("#nav");