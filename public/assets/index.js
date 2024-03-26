// Create global variables.
const sendThis = location.pathname.substring(1);
let allowWiki = true;
const notyf = new Notyf({
    position: {
        y: 'top'
    },
    dismissible: true
});
const mediaScreen = window.matchMedia("(max-width: 390px) and (max-height: 844px) and (-webkit-device-pixel-ratio: 3)")
// set a global variable telling other function if we are on mobile or not
const onMobile = mediaScreen.matches ? true : false; 
// set to true when the list is not shown but needs to be updated to due to saved or deleted notebooks. On mobile is is hidden by default
let haveToUpdateList = onMobile ? true : false;
// set a global variable telling other function if we are on the home menu
const atHome = sendThis ==="home" ? true : false

let history
let iterator 

const notesTextArea = document.getElementById("notesTextArea");
const notesPreviewArea = document.getElementById("notesPreviewArea");
const notesAreaContainer = document.getElementById("notesAreaContainer");
const mainContainer = document.getElementById("mainContainer");
const topLeftPageNumber = document.getElementById("topLeftPageNumbers");
const areNotesSavedIcon = document.getElementById("areNotesSavedIcon");
const bookDiffPopup = document.getElementById("bookDiffPopup");
const list = onMobile ? document.getElementById("mobileList") :  document.getElementById("listOfBooks");
const listContainer = onMobile ? document.getElementById("mobileListContainer") : document.getElementById("listContainer")
const noteBookFromDb = document.getElementById("noteBookFromDb-ejs");
const wikipediaBrainAnimation = document.getElementById("wikipediaBrainAnimation")
const bottomLeftGeneralInfo = document.getElementById("bottomLeftGeneralInfo")
const generalInfoPageNumberEle = document.getElementById("generalInfoPageNumber")

const indentAmount = onMobile ? 2 : 4;

let going = false;
function asyncInnerHTML(HTML, callback) {
    let temp = document.createElement('div')
    let frag = document.createDocumentFragment()
    temp.innerHTML = format(HTML);
    (function(){
        if(temp.firstChild){
            frag.appendChild(temp.firstChild);
            setTimeout(arguments.callee, 0);
        } else {
            callback(frag);
        }
    })();
}

const one = new RegExp("(<.*?>)(.*?)(</.*?>)", 'g')
const two = /^(?:# )\s*(.+?)[ \t]*$/gm
const three = /^(?:## )\s*(.+?)[ \t]*$/gm
const four = /^(?:### )\s*(.+?)[ \t]*$/gm
const five = /^(?:\t*- )\s*(.+?)[ \t]*$/gm
const six = /^(?:\t*([0-9]*)[.] )\s*(.+?)[ \t]*$/gm
const seven = new RegExp("\\*\\*(?! )(.+?)(?<! )\\*\\*", 'g')
const eight = new RegExp("__(?! )(.+?)(?<! )__", 'g')
const nine = new RegExp("\\*(?! )(.+?)(?<! )\\*", 'g')
const ten = new RegExp("https://(?! )(.+?[^\n) ]*)", 'g')
const eleven = new RegExp("!\\((?! )(.+?)(?<! )\\)", 'g')
const twelve = new RegExp("==(?! )(.+?)(?<! )==", 'g')
const thirteen = new RegExp("\\|\\|(?! )(.+?)(?<! )\\|\\|", 'g')
const fourteen = new RegExp("~~(?! )(.+?)(?<! )~~", 'g')
const fifteen = new RegExp("\\[\\[(?! )(.+?)(?<! )\\]\\]", 'g')
const sixteen = /(?:\r\n|\r|\n)/g
const seventeen = new RegExp("```(.+?)```", 'g')
function format(str) {
    str = str.replace(one, "<pre class = 'userHtml'>$1$2$3</pre>")
    str = str.replace(five, (txt) => {
        const indents = txt.substring(0,txt.indexOf("- ")).length+1
        let listStyle = ""
        switch(indents) {
            case 1:
                listStyle = ""
                break;
            case 2:
                listStyle = "circle"
                break;
            default:
                listStyle = "square"
        }
        return `<span class = 'unorder ${listStyle}' style = 'margin-left: ${indents*indentAmount}em;'>${txt.substring(txt.indexOf("- ")+2)}</span>`
    })

    str = str.replace(six, (txt) => {
        let numAsText = txt.substring(0,txt.indexOf(".")).replaceAll("\t", "")
        let count = txt.substring(0, txt.indexOf(numAsText)).length + 1
        return `<span class = 'order' style = 'margin-left: ${count*indentAmount}em;'><span class = 'marked'>${txt.substring(0, txt.indexOf(". "))}. </span>${txt.substring(txt.indexOf(". ")+2)}</span>`
    })
    str = str.replaceAll("[ ]", "<input type='checkbox' disabled='disabled'></input>")
    str = str.replaceAll("[x]", "<input type='checkbox' disabled='disabled' checked='checked'></input>")
    str = str.replace(two, "<h1>$1</h1>")
    str = str.replace(three, "<h2>$1</h2>")
    str = str.replace(four, "<h3>$1</h3>")
    str = str.replace(seven, "<strong>$1</strong>")
    str = str.replace(eight, "<strong>$1</strong>")
    str = str.replace(nine, "<em>$1</em>")
    str = str.replace(ten, "<a class = 'userLink'>$1</a>")
    str = str.replace(eleven, "<img class = 'userImage' src = '$1' loading = 'lazy'>")
    str = str.replace(twelve, "<mark>$1</mark>")
    str = str.replace(thirteen, "<span class ='spoiler'>$1</span>")
    str = str.replace(fourteen, "<s>$1</s>")
    str = str.replace(fifteen, "<a class = 'reference' href = '/$1'>$1</a>")
    str = str.replace(sixteen, '<br>')
    str = str.replace(seventeen, "<pre class = 'codeBlock'>$1</pre>")
    return DOMPurify.sanitize(str)
}

// remove /'s from the path as it causes CSS to not load
if (sendThis.includes("/")) {
    location.href = "/" + sendThis.substring(0, sendThis.length - 1);
}

// Create tool tips
const toolBarTips = ['Save (Ctrl + S)', 'Open', 'Delete', 'Insert Image', 'Switch View (Ctrl + E)', 'Prev Page', 'Next Page']
for (let i = 0; i < 7; i++) {
    tippy(`#icon${i+1}`, {
        theme: 'light',
        content: toolBarTips[i],
    });
}

tippy('#wordCount', {
    theme: 'light',
    content: 'Word Count',
})

tippy('#letterCount', {
    theme: 'light',
    content: 'Character Count',
})

tippy('#timeToFormat', {
    theme: 'light',
    content: 'Format time',
})

tippy('#newPage', {
    theme: 'light',
    content: "New Page",
    placement: 'right-start',
});

let wikipediaTippy = tippy('#wikipedia', {
    theme: 'light',
    content: `<div id = 'brain'>Highlight text in read mode to receive info about it here (right click to toggle this function)</div>`,
    interactive: true,
    maxWidth: '500px'
})[0];

let synced = tippy('#areNotesSavedIcon', {
    theme: 'light',
    content: 'Notes are saved',
    interactive: true,
})[0];

let editingMode = tippy('#generalInfoViewMode', {
    theme: 'light',
    content: localStorage.getItem("viewPref"),
    placement: 'top',
})[0];

let generalInfoPageNumber = tippy('#generalInfoPageNumber', {
    theme: 'light',
    content: localStorage.getItem("viewPref"),
    placement: 'top',
})[0];

let pgN = parseInt(location.search.substring(1)) - 1 || 0;
let book = [""];

let listHandlers = []

function dropWrapper(e) {
    e.currentTarget.parentNode.classList.toggle("down")
}

function mobileDropWrapper(e) {
    handleListDropDowns(e.currentTarget)
}

function jumpWrapper(e) {
    jumpToDesiredPage(e.currentTarget.getAttribute("data-page"))
}

function mobileJumpWrapper(e) {
    jumpToDesiredPage(e.currentTarget.getAttribute("data-page"))
    toggleList();
}

const createList = !onMobile ? async () => {
    listHandlers.forEach(({ element, type, listener }) => {
        element.removeEventListener(type, listener);
    });
    listHandlers = []
    while (listContainer.firstChild) {
        listContainer.firstChild.remove();
    }
    const response = await fetch("/api/get/everything")
    const json = await response.json();
    const result = json["data"];
    for (let i = result.length-1; i >= 0; i--) {
        const item = document.createElement("div")
        item.classList.add("item")
        item.setAttribute("data-bn", result[i]["name"])
        const header = document.createElement("div")
        header.addEventListener("click", dropWrapper)
        listHandlers.push({ element: header, type: 'click', listener: dropWrapper});
        header.innerText = result[i]["name"]
        header.classList.add("folderName")
        item.appendChild(header)
        const ul = document.createElement("ul")
        item.appendChild(ul)
        for (let j = 0, n = result[i]["excerpt"].length; j < n; j++)
        {   
            const link = document.createElement("a")
            link.setAttribute("data-page", j)
            if(result[i]["name"] === sendThis) {
                link.addEventListener("click", jumpWrapper)
                listHandlers.push({ element: link, type: 'click', listener: jumpWrapper});
            } else {
                link.href = `/${result[i]["name"]}?${j+1}`
            }
            link.innerText = `${result[i]["excerpt"][j].replaceAll("\n", " ").replaceAll("#", "")}`
            const li = document.createElement("li")
            li.appendChild(link)
            ul.appendChild(li)
        }
        if(result[i]["name"] === sendThis) {
            listContainer.prepend(item)
            item.classList.add("down")
        } else {
            listContainer.appendChild(item)
        }
    }
} : async () => {
    listHandlers.forEach(({ element, type, listener }) => {
        element.removeEventListener(type, listener);
    });
    listHandlers = []
    while (listContainer.firstChild) {
        listContainer.firstChild.remove();
    }
    const response = await fetch("/api/get/everything")
    const json = await response.json();
    const result = json["data"];
    for (let i = result.length-1; i >= 0; i--) {
        const item = document.createElement("div")
        item.classList.add("item")
        item.setAttribute("data-pos", "up")
        item.setAttribute("data-bn", result[i]["name"])
        item.addEventListener("click", mobileDropWrapper)
        listHandlers.push({ element: item, type: 'click', listener: mobileDropWrapper});
        const header = document.createElement("div")
        header.innerText = result[i]["name"]
        header.classList.add("listHeader")
        item.appendChild(header)
        for (let j = 0, n = result[i]["excerpt"].length; j < n; j++)
        {   
            const link = document.createElement("a")
            link.setAttribute("data-page", j)
            const linkWrapper = document.createElement("div")
            const bookExcerpt = document.createElement("span")
            if(result[i]["name"] === sendThis) {
                link.addEventListener("click", mobileJumpWrapper)
                listHandlers.push({ element: link, type: 'click', listener: mobileJumpWrapper});
            } else {
                link.href = `/${result[i]["name"]}?${j+1}`
            }
            linkWrapper.classList.add("linkWrapper")
            bookExcerpt.innerText = `${result[i]["excerpt"][j].replaceAll("\n", " ").replaceAll("#", "")}`
            linkWrapper.appendChild(bookExcerpt)
            link.appendChild(linkWrapper)
            item.appendChild(link)
        }
        if(result[i]["name"] === sendThis) {
            listContainer.prepend(item)
            item.style.height = item.scrollHeight + "px"
            item.setAttribute("data-pos", "down")
            item.classList.add('itemWithLinks');
        } else {
            listContainer.appendChild(item)
        }
    }
}

// // Creates the list of notebooks, keeping the current notebook at the top below the search bar
// async function createList() {
//     listHandlers.forEach(({ element, type, listener }) => {
//         element.removeEventListener(type, listener);
//     });
//     listHandlers = []
//     while (listContainer.firstChild) {
//         listContainer.firstChild.remove();
//     }
//     const response = await fetch("/api/get/everything")
//     const json = await response.json();
//     const result = json["data"];
//     for (let i = result.length-1; i >= 0; i--) {
//         const item = document.createElement("div")
//         item.classList.add("item")
//         item.setAttribute("data-bn", result[i]["name"])
//         const header = document.createElement("div")
//         header.addEventListener("click", dropWrapper)
//         listHandlers.push({ element: header, type: 'click', listener: dropWrapper});
//         header.innerText = result[i]["name"]
//         header.classList.add("folderName")
//         item.appendChild(header)
//         const ul = document.createElement("ul")
//         item.appendChild(ul)
//         for (let j = 0, n = result[i]["excerpt"].length; j < n; j++)
//         {   
//             const link = document.createElement("a")
//             link.setAttribute("data-page", j)
//             if(result[i]["name"] === sendThis) {
//                 link.addEventListener("click", jumpWrapper)
//                 listHandlers.push({ element: link, type: 'click', listener: jumpWrapper});
//             } else {
//                 link.href = `/${result[i]["name"]}?${j+1}`
//             }
//             link.innerText = `${result[i]["excerpt"][j].replaceAll("\n", " ").replaceAll("#", "")}`
//             const li = document.createElement("li")
//             li.appendChild(link)
//             ul.appendChild(li)
//         }
//         if(result[i]["name"] === sendThis) {
//             listContainer.prepend(item)
//         } else {
//             listContainer.appendChild(item)
//         }
//     }
// }

// handles the search bar in the list of notebooks
function search(term) {
    for(const item of document.getElementsByClassName("item")) {
        item.style.display = "inherit";
        if(!item.getAttribute("data-bn").toLowerCase().includes(term.toLowerCase())) {
            item.style.display = "none";
        }
    }
}

// Update the textarea value, update the url search [?], update the notes and update the page numbers
function accents(navigating) {
    notesTextArea.value = book[pgN];
    history = [[notesTextArea.value, 0]]
    window.history.replaceState({}, '', `${sendThis}?${(pgN + 1)}`);
    updateAndSaveNotesLocally(navigating)
    createPageNumbers();
}

// Handles moving between pages
function handlePageMovement(goBack, amount, shouldCreateNewPage) {
    if (goBack && pgN > 0) {
         pgN -= amount;
        accents(true)
    } else if (!goBack){
        if(pgN + amount >= book.length && shouldCreateNewPage) {
            book.push("")
            pgN += amount;
                accents(true)
        } else if (!(pgN+amount >= book.length)) {
            pgN += amount;
            accents(true)
        }
    }
}

// Jumps to a certain page by calling the handlePageMovement function
function jumpToDesiredPage(desired) {
    if (desired < pgN) {
        handlePageMovement(true, pgN-desired, true)
    } else if (desired > pgN) {
        handlePageMovement(false, desired-pgN, true)
    }
}

// Global variable representing the notebook save that is in the DB
let s = "";

// Set the displayed notes to whatever is in local storage, then replace local storage with whatever is in database. This way,
// The user has a change to still save any unsaved notes from last session. If the page is blank (like it will be on the first load
// after clearing cookies), call this function again with the goAgain parameter set to false.
async function initializeNotes() {
    if(!atHome) {
        s = noteBookFromDb.innerText;
        book = JSON.parse(localStorage.getItem(sendThis)) || [""]
        accents(true)
        if (s !== "") {
            localStorage.setItem(sendThis, s);
        }
        // if ((notesTextArea.value === "undefined" || notesTextArea.value === "") && goAgain) {
        //     notesTextArea.readOnly = true;
        //     initializeNotes(false);
        // }
        notesTextArea.readOnly = false;
    }
}

// Forecefully pull the notes from the database and update the user's notes
async function forceUpdateNotes() {
    if(confirm("Are you sure?")) {
        const response = await fetch(`/api/get/notebooks/${sendThis}`)
        const json = await response.json();
        noteBookFromDb.innerText = json["data"];
        s = noteBookFromDb.innerText;
        localStorage.setItem(sendThis, s);
        book = JSON.parse(localStorage.getItem(sendThis)) || [""]
        accents()
        hideBookDiffPopup()
        updateList()
        notyf.success("Notes were pulled from database");
    }
}

// storing a few tooltips so we can delete them when creating new ones. didn't use setContent here because it creates the tooltips on every hover since some elements with tooltips often gets re-rendered
let lastDynamicTippy

let pageHandlers = []

function pagePreviewWrapper(e) {
    pagePreviewToolTip(e.currentTarget)
}

let lastMorePagesTippy

// Create the page numbers in the top left
function createPageNumbers() {
    pageHandlers.forEach(({ element, type, listener }) => {
        element.removeEventListener(type, listener);
    });
    pageHandlers = []
    while (topLeftPageNumber.firstChild) {
        topLeftPageNumber.firstChild.remove();
    }
    generalInfoPageNumberEle.innerText = pgN+1;
    generalInfoPageNumber.setContent(`Page ${pgN + 1}`)
    if (book.length > 9) {
        for (let z = 0; z < 9; z++) {
                const box = document.createElement("div")
                box.classList.add("whereTo")
                box.id = `whereTo${z}`
                box.setAttribute("data-page", z)
                box.addEventListener("mouseover", pagePreviewWrapper)
                pageHandlers.push({ element: box, type: 'mouseover', listener: pagePreviewWrapper});
                box.addEventListener("click", jumpWrapper)
                pageHandlers.push({ element: box, type: 'click', listener: jumpWrapper});
                box.innerText = z+1
                topLeftPageNumber.appendChild(box)
        }
        const morePages = document.createElement("div");
        morePages.classList.add("whereTo")
        morePages.id = 'morePages'
        morePages.setAttribute("data-page", book.length-1)
        morePages.addEventListener("click", jumpWrapper)
        pageHandlers.push({ element: morePages, type: 'click', listener: jumpWrapper});
        morePages.innerText = '...'
        topLeftPageNumber.appendChild(morePages)
        try {
            lastMorePagesTippy.destroy();
        } catch (err) {
            console.log("No previous 'more pages' tippy to delete")
        }
        lastMorePagesTippy = tippy('#morePages', {
            theme: 'light',
            content: `${(book.length - 9)} more pages are hidden, you are on page ${pgN+1}`,
            placement: 'right-start',
        })[0];
    } else {
        for (let z = 0; z < book.length; z++) {
            const box = document.createElement("div")
            box.classList.add("whereTo")
            box.id = `whereTo${z}`
            box.addEventListener("mouseover", pagePreviewWrapper)
            pageHandlers.push({ element: box, type: 'mouseover', listener: pagePreviewWrapper});
            box.setAttribute("data-page", z)
            box.addEventListener("click", jumpWrapper)
            pageHandlers.push({ element: box, type: 'click', listener: jumpWrapper});
            box.innerText = z+1
            topLeftPageNumber.appendChild(box)
        }
    }
    const currPage = document.getElementById(`whereTo${pgN}`) || document.getElementById(`morePages`)
    currPage.style.background = "rgb(116, 222, 152)";
    currPage.style.color = "black";
}

// Create the page previews when hovering over the page numbers in top left
function pagePreviewToolTip(ele) {
    try {
        lastDynamicTippy.destroy();
    } catch (err) {
        console.log("no previous dynamic tippy to destroy")
    }
    const bry = ele.innerText.trim() - 1;
    lastDynamicTippy = tippy(`#whereTo${bry}`, {
        theme: 'light',
        content: `<div class = 'pagePreviewContainer'>${marked.parse(book[bry])}</div>`,
        placement: 'right-start',
        interactive: true,
    })[0];
}

// Find all code blocks
function matchCodeBlocks(str) {
    let matches = []

    str.replace(/```([\s\S]+?)```/g, function (string, match) {
        matches.push(match)
    });

    return matches;
}

function typeSet(eles) {
    try {
        MathJax.texReset(eles);
        MathJax.typesetClear(eles)
        MathJax.typeset(eles);
    } catch (err) {
        console.log(err)
        setTimeout(() => {
            typeSet(eles)
        }, "1");
    }
}

let imageHandlers = []
let refHandlers = []

function imageRemoveWrapper(e) {
    removeImageToolTip(e.currentTarget)
}

function referTipWrapper(e) {
    referToolTip(e.currentTarget)
}

//Formatting code blocks and creating tooltips to delete image, also adds hrefs to anchors (helps to prevent anchors from having HTML in them after format() function)
function formatNonText() {
    const blocks = document.getElementsByClassName("codeBlock")
    let str = matchCodeBlocks(notesTextArea.value)
    for (let i = 0, n = blocks.length; i < n; i++) {
        blocks[i].innerText = str[i]
    }
    for (const block of document.getElementsByClassName("userHtml")) {
       block.innerText = block.innerHTML
    }
    for (const img of document.getElementsByClassName("userImage")) {
        img.addEventListener("mouseover", imageRemoveWrapper);
        imageHandlers.push({ element: img, type: 'mouseover', listener: imageRemoveWrapper});
    }
    for (const link of document.getElementsByClassName("userLink")) {
        link.href = "https://" + link.innerText;
        link.setAttribute("rel", "noopener noreferrer nofollow")
    }
    for (const ref of document.getElementsByClassName("reference")) {
        ref.addEventListener("mouseover", referTipWrapper);
        refHandlers.push({ element: ref, type: 'mouseover', listener: referTipWrapper});
    }
    let arr = []
    for (const child of notesPreviewArea.childNodes) {
        if(child.tagName !== "BR") {
            arr.push(child);
        }
    }
    for (let i = 0, n = arr.length-1; i < n; i++) {
        if((arr[i].tagName === "H3" || arr[i].tagName === "H2" || arr[i].tagName === "H1") && (arr[i+1].tagName === "H3" || arr[i+1].tagName === "H2" || arr[i+1].tagName === "H1")) {
            arr[i].style.marginBottom = "-1em";
        } else if (arr[i].nodeName === "#text") {
            let wrapper = document.createElement("span")
            wrapper.classList.add("textNode")
            wrap(arr[i], wrapper)
        }
    }
    typeSet([notesPreviewArea]);
}

function wrap(el, wrapper) {
    if (el && el.parentNode) {
      el.parentNode.insertBefore(wrapper, el);
      wrapper.appendChild(el);
    }
  }

// Pad the letter and word count with 0s
function padWithZeroes(str) {
    str = str + ""
    if (str.length > 5) {
        str = "9999+";
    } else if(str.length !== 5) {
        str = "0".repeat(5-str.length) + str;
    }
    return str;
}

const letterCount = document.getElementById("letterCount")
const wordCount = document.getElementById("wordCount")

getColor = () => {
    let R = Math.floor((Math.random() * 127) + 127);
    let G = Math.floor((Math.random() * 127) + 127);
    let B = Math.floor((Math.random() * 127) + 127);
    
    let rgb = (R << 16) + (G << 8) + B;
    return `#${rgb.toString(16)}`;      
  }
  
  document.querySelectorAll('#palette div').forEach( elem => {
    elem.style.backgroundColor = generatePastelColor();
  });

let num = 0

const timer = ms => new Promise(res => setTimeout(res, ms))
// format notes for preview area, update word and letter count, format code blocks and images, update the book global variable
// save notes to local storage and check if notes match with DB. Triggered every time the user types
async function updateAndSaveNotesLocally(navigating) {
    book[pgN] = notesTextArea.value;
    localStorage.setItem(sendThis, JSON.stringify(book));
    syncStatus(s);
    imageHandlers.forEach(({ element, type, listener }) => {
        element.removeEventListener(type, listener);
    });
    imageHandlers = []
    refHandlers.forEach(({ element, type, listener }) => {
        element.removeEventListener(type, listener);
    });
    refHandlers = []
    if(navigating) {
        const color = getColor()
        notesPreviewArea.innerHTML = `
            <div class="lds-grid">
                <div style = 'background: ${color}'></div> <div style = 'background: ${color}'></div> <div style = 'background: ${color}'></div>
                <div style = 'background: ${color}'></div> <div style = 'background: ${color}'></div> <div style = 'background: ${color}'></div>
                <div style = 'background: ${color}'></div> <div style = 'background: ${color}'></div> <div style = 'background: ${color}'></div>
            </div>`
    }
    if(!going) {
        going = true;
        asyncInnerHTML((notesTextArea.value), function(fragment){
            while(notesPreviewArea.firstChild) {
               notesPreviewArea.firstChild.remove()
           }
           notesPreviewArea.appendChild(fragment); // myTarget should be an element node.
           formatNonText();
           wordCount.innerText = padWithZeroes(notesPreviewArea.innerText.replaceAll("\n", " ").replace(/  +/g, ' ').split(" ").length-1);
           going = false;
       })
    } else {
        while(going) {
            console.log(num++)
            await timer(100)
        }
        asyncInnerHTML((notesTextArea.value), function(fragment){
            while(notesPreviewArea.firstChild) {
               notesPreviewArea.firstChild.remove()
           }
           notesPreviewArea.appendChild(fragment); // myTarget should be an element node.
           formatNonText();
           wordCount.innerText = padWithZeroes(notesPreviewArea.innerText.replaceAll("\n", " ").replace(/  +/g, ' ').split(" ").length-1);
           going = false;
       })
    }
    letterCount.innerText = padWithZeroes(notesTextArea.value.replaceAll(" ", "").replaceAll("\n", "").length);
}

// Store the src of the image that the user is currently hovering over so that it can be deleted
let lastHoveredImageSrc;

async function deleteImageFromDb() {
    let imageTo = lastHoveredImageSrc + "";
    let occ = `!(${imageTo.substring(imageTo.indexOf("/uploads/"))})`;
    const imageDeleteStatus = await fetch("/api/delete/images/" + imageTo.substring(imageTo.indexOf("/uploads/") + 9), {
        method: "DELETE",
    })
    if (imageDeleteStatus.ok) {
        notesTextArea.value = notesTextArea.value.replaceAll(occ, "");
        updateAndSaveNotesLocally();
        saveNoteBookToDb();
    } else {
        notyf.error(`${imageDeleteStatus.status} Error`)
    }
}

// tooltip to delete image
function removeImageToolTip(given) {
    try {
        lastDynamicTippy.destroy();
    } catch (err) {
        console.log("no previous dynamic tippy to destroy")
    }
    lastHoveredImageSrc = given.src;
    lastDynamicTippy = tippy([given], {
        theme: 'light',
        content: "<span onclick = 'deleteImageFromDb()' style = 'color: blue; cursor: pointer; text-decoration: underline;'>Delete Image</span>",
        placement: 'right-start',
        interactive: true,
    })[0];
}

async function getAnyBookContent(bookName) {
    const response = await fetch(`api/get/notebooks/${bookName}`, {
        method: "get",
    })
    if(response.ok) {
        let json = await response.json();
        return json["data"]
    } else if(response.status === 404) {
        return false
    } else {
        return `Error ${response.status}`
    }
}

async function referToolTip(given) {
    try {
        lastDynamicTippy.destroy();
    } catch (err) {
        console.log("no previous dynamic tippy to destroy")
    }
    lastDynamicTippy = tippy([given], {
        theme: 'light',
        content: 'Loading...',
        placement: 'right',
        interactive: true,
    })[0];
    let content
    try {
        content = marked.parse(JSON.parse(await getAnyBookContent(given.innerText))[0])
        lastDynamicTippy.setContent(`<div class = 'pagePreviewContainer'>${content}</div>`)
    } catch (err) {
        lastDynamicTippy.destroy()
    }
}

async function deleteNoteBookFromDb() {
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
    updateList()
    hideBookDiffPopup()
}

function updateList() {
    // Refetch data and re render the list. If the list is not shown, make sure it is updated next time it is shown
    if (list.getAttribute("data-pos") === "hidden") {
        haveToUpdateList = true;
    } else {
        createList();
    }
}

function pageIsNull(i) {
    if((book[i] === null || book[i] === "" || book[i] === "undefined")) {
        return true
    } else {
        return false
    }
}

async function saveNoteBookToDb() {
    book[pgN] = notesTextArea.value;
    let sentArr = [];

    for (let i = 0, n = book.length; i < n; i++) {
        if (!pageIsNull(i)) {
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
        areNotesSavedIcon.classList.add("saved")
        s = JSON.stringify(book);
        if (pgN > book.length - 1) {
            jumpToDesiredPage(book.length - 1);
        } else {
            accents();
        }
        syncStatus(s);
        notyf.success(`Notebook saved successfully (${saveStatus.status})`)
    } else {
        notyf.error(`${saveStatus} Error`)
    }
    hideBookDiffPopup()
    updateList()
}


function confirmBookDeletion() {
    if (confirm("Are you sure you want to delete this notebook from the database?")) {
        deleteNoteBookFromDb()
    } else {
        notyf.error(`Notebook has not been removed`)
    }
}

let recentB

// Update list of recent notes to be displayed on home screen
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

// Prompt user for opening notebook
function openNoteBookPrompt() {
    let newBookN = prompt("Enter a notebook name", sendThis)
    location.href = newBookN.replaceAll("/", "")
}

const mobileSync =  document.getElementById("mobileSync")

// Determine whether the notes the user is currently editing match with what is in the DB
function syncStatus(response) {
    let writtenPages = []
    for (let i = 0, n = book.length; i < n; i++) {
        if (!pageIsNull(i)) {
            writtenPages.push(book[i]);
        }
    }
    if(writtenPages.length === 0) {
        writtenPages.push("");
    }
    if (JSON.stringify(writtenPages) === response) {
        areNotesSavedIcon.style.filter = "none"
        mobileSync.style.background = "#61da20";
        synced.destroy()
        synced = tippy('#areNotesSavedIcon', {
            theme: 'light',
            content: `Notes are saved`,
            interactive: true,
        })[0];
        document.title = sendThis;
    } else {
        areNotesSavedIcon.style.filter = "grayscale(1)"
        mobileSync.style.background = "gray";
        synced.destroy()
        synced = tippy('#areNotesSavedIcon', {
            theme: 'light',
            content: `Notes shown differ from saved notes by ${Math.abs(JSON.stringify(book).length - response.length)} chars
            <br><br>
            <span onclick = 'showBookDiffPopup()' style = 'color: darkcyan; cursor: pointer; text-decoration: underline;'>More details</span>
            <br><br>
            <span onclick = 'forceUpdateNotes()' style = 'color: orange; cursor: pointer; text-decoration: underline;'>Force update</span>`,
            interactive: true,
        })[0];
        document.title = sendThis + " *"
    }
}

// Determine and format the differences between the user's notebook and the saved notebook
function getDiff(one, other) {
    let span = null;

    const diff = Diff.diffChars(one, other);
    const fragment = document.createDocumentFragment();

    diff.forEach((part) => {
        const color = part.added ? ['#33ff96', 'black'] :
        part.removed ? ['#ff5e5e', 'black'] : ['rgba(0,0,0,0)', 'whitesmoke'];
        span = document.createElement('span');
        span.style.background = color[0];
        span.style.color = color[1];
        span.appendChild(document.createTextNode(part.value));
        fragment.appendChild(span);
    });
    return fragment;
}

const bookDiffContent = document.getElementById("bookDiffContent")

// *maybe make this less hacky*, displays the popup showing the differences in the DB and currently displayed notebook
function showBookDiffPopup() {
    bookDiffPopup.classList.add("bookDiffPopupVisible")
    let content = [];
    const timesToRepeat = JSON.parse(s).length > book.length ? JSON.parse(s).length : book.length;
    const missingPage = timesToRepeat === JSON.parse(s).length ? JSON.parse(s) : book
    const colorIndicator = timesToRepeat === JSON.parse(s).length ? ['#ff5e5e', 'black'] :  ['#33ff96', 'black']
    for (let i = 0, n = timesToRepeat; i < n; i++) {
        content.push(`<h2>Page ${i+1}</h2><div class = "pageDiff" id = "pageDiff${i}"></div><br>`);
    }
    bookDiffContent.innerHTML = content.join("");
    for (let i = 0, n = timesToRepeat; i < n; i++) {
        try {
            document.getElementById(`pageDiff${i}`).appendChild(getDiff(JSON.parse(s)[i], book[i]))
        } catch(err) {
            const fragment = document.createDocumentFragment();
            span = document.createElement('span');
            span.style.background = colorIndicator[0];
            span.style.color = colorIndicator[1]
            span.appendChild(document.createTextNode(missingPage[i]));
            fragment.appendChild(span);
            document.getElementById(`pageDiff${i}`).appendChild(fragment);
        }
    }
    notyf.success("Comparing your notes vs saved notes");
}

// Hide the popup displaying the differences
function hideBookDiffPopup() {
    bookDiffPopup.classList.remove("bookDiffPopupVisible")
}

const myForm = document.getElementById("myForm")

// Handles native image uploading
async function insertAndSaveImage() {
    const formData = new FormData(myForm)
    const imageUploadStatus = await fetch("/api/save/images", {
        method: "POST",
        body: formData
    })
    if (imageUploadStatus.ok) {
        const response = await imageUploadStatus.text()
        notesTextArea.value += `\n\n!(${response})`;
        updateAndSaveNotesLocally()
        saveNoteBookToDb()
    } else {
        notyf.error(`${imageUploadStatus.status} Error`)
    }
}

// Triggered when the user clicks in the note preview area, gets the user selection and contact the wikipedia summary API with said selection
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
            let summary = `<b>${selection.trim()}</b>:<br>${DOMPurify.sanitize(result['extract_html'])}<a href = 'https://en.wikipedia.org/wiki/${wiki}' target = '_blank'>Learn More</a>`
            wikipediaTippy.setContent(`<div id = 'brain'>${summary}</div>`);
            moneyAnimation(event, "&#129504;");
        }
        document.body.style.cursor = "inherit"
    }
}

// Displays the little brain animation when the user select text and if the wikipedia api returns an OK status
function moneyAnimation(mouseCoords, symbol) {
    wikipediaBrainAnimation.style.top = mouseCoords.clientY + "px"
    wikipediaBrainAnimation.style.left = mouseCoords.clientX + "px"
    // https://stackoverflow.com/a/69970674
    const moneyAnimation = document.createElement("p");
    moneyAnimation.innerHTML = symbol;
    wikipediaBrainAnimation.appendChild(moneyAnimation);
    moneyAnimation.classList.add("wikipediaBrainAnimation"); // Add the class that animates
    fluentemoji.parse(".wikipediaBrainAnimation");
    moneyAnimation.addEventListener('animationend', () => {
        moneyAnimation.remove()
    }, { once: true });
}

const mobileMenu = document.getElementById("mobileMenu")

// Toggles the visibility of the list of notebooks. if the list was not shown when the notebook was saved or deleted, it updates.
// On mobile the function is a little different because of the size and z-index of the list
const toggleList = !onMobile ? () => {
    if (list.getAttribute("data-pos") === "shown") {
        notesAreaContainer.style.width = "calc(100% - 20px)";
        bottomLeftGeneralInfo.style.left = "30px"
        list.style.display = "none"
        list.setAttribute("data-pos", "hidden");
    } else {
        notesAreaContainer.style.width = "calc(100% - 20px - 300px)";
        bottomLeftGeneralInfo.style.left = "calc(30px + 300px)"
        list.setAttribute("data-pos", "shown");
        list.style.display = "inline"
        if(haveToUpdateList) {
            createList();
            haveToUpdateList = false;
        }
    }
} : () => {
    if (list.getAttribute("data-pos") === "shown") {
        list.style.display = "none"
        list.setAttribute("data-pos", "hidden");
        mobileMenu.style.height = "3.5em"
        mobileMenu.style.width = "3.5em"
    } else {
        list.setAttribute("data-pos", "shown");
        list.style.display = "inline"
        if(haveToUpdateList) {
            createList();
            haveToUpdateList = false;
        }
        mobileMenu.style.height = "4em"
        mobileMenu.style.width = "4em"
    }
}

// Handle drop down for items in list
function handleListDropDowns(ele) {
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
function applyViewPreference() {
    let viewPref = localStorage.getItem("viewPref");
    if (viewPref === null) {
        viewPref = "read"
        localStorage.setItem("viewPref", "read");
    }
    editingWindow(viewPref)
}

//Cycle through visibility optionss
// On mobile the function disallows the split mode
const cycleViewPreferences = !onMobile ? () => {
    let viewPref = localStorage.getItem("viewPref");
    switch (viewPref) {
        case "split":
            localStorage.setItem("viewPref", "write");
            break;
        case "write":
            localStorage.setItem("viewPref", "read");
            break;
        default:
            localStorage.setItem("viewPref", "split");
            break;
    }
    editingWindow(localStorage.getItem("viewPref"))
} : () => {
    let viewPref = localStorage.getItem("viewPref");
    if (viewPref === "write") {
        localStorage.setItem("viewPref", "read");
    } else {
        localStorage.setItem("viewPref", "write");
    }
    editingWindow(localStorage.getItem("viewPref"))
}

const mode = document.getElementById("generalInfoViewMode");

// Handle what the view preference should be
function editingWindow(choice) {
    switch(choice) {
        case "read":
            mode.innerText = "R";
            notesTextArea.readOnly = true;
            notesAreaContainer.classList.add("readMode")
            notesAreaContainer.classList.remove("writeMode")
            notesAreaContainer.classList.remove("splitMode")
            localStorage.setItem("viewPref", "read")
            break;
        case "write":
            mode.innerText = "W";
            notesTextArea.readOnly = false;
            notesAreaContainer.classList.remove("readMode")
            notesAreaContainer.classList.add("writeMode")
            notesAreaContainer.classList.remove("splitMode")
            localStorage.setItem("viewPref", "write")
            break;
        default: 
            mode.innerText = "S";
            notesTextArea.readOnly = false;
            notesAreaContainer.classList.remove("readMode")
            notesAreaContainer.classList.remove("writeMode")
            notesAreaContainer.classList.add("splitMode")
            localStorage.setItem("viewPref", "split")
    }
    notesPreviewArea.scrollTop = 0;
    notesTextArea.scrollTop = 0;
    notesAreaContainer.focus();
    editingMode.setContent(`View Mode: ${choice}`);
}

// When the page loads, grab the notes, appy the users choice of textarea visibility, create the list and create the page numbers
// Also, parse the emojis in the top menu and if the current page that the user is on is null, go to page one.
function checkStart() {
    if(pageIsNull(pgN) && !going) {
        pgN = 0;
        initializeNotes()
        accents();
    } else if (pageIsNull(pgN) && going) {
        checkStart();
    }
}

initializeNotes();
applyViewPreference();
if(!onMobile) {
    createList()
}
createPageNumbers();
fluentemoji.parse("#toolBar");
fluentemoji.parse("#bookDiffPopup")
checkStart()

// Display the home screen when the user is at the /home path
if (atHome) {
    document.getElementById("goHome").style.color = "gray"
    topLeftPageNumber.style.display = "none";
    document.getElementById("toolBar").classList.add("homeToolBar");
    document.getElementById("newPage").style.display = "none";
    let content = ["# Recent Notes\n"];
    for (let i = 0, n = recentB.length; i < n; i++) {
        content.push(`\n${i+1}. [[${recentB[i]}]]`);
    }
    notesTextArea.value = content.join('');
    updateAndSaveNotesLocally();
} else {
    // Create the dropzone for drag and drop image uploading if the user is not on the home page
    new Dropzone(document.body, {
        url: "/api/save/images",
        paramName: 'avatar',
        clickable: false,
        acceptedFiles: "image/jpeg,image/png,image/gif,image/webp",
        error: function () {
            notyf.error('There was an error uploading the image')
        },
        success: function (file, response) {
            file.previewElement.remove();
            notesTextArea.value += `\n\n!(${response})`;
            updateAndSaveNotesLocally()
            saveNoteBookToDb()
        }
    })
}

const emptyOlist = /^\t*[0-9]+\.\s$/i;
const olist = /^\t*[0-9]+\.\s.+$/i;
const ulist = /^\t*-\s.+$/i;
const emptyUList = /^\t*-\s$/i;
let currLine

function handleHistory(item) {
    if(history.length > 100) {
        history.shift();
    }
    history.push([item.value, item.selectionStart]);
    iterator = history.length-1
}

function handleIterator(num, textarea) {
    if(iterator+num >= 0 && iterator+num <= history.length-1) {
        iterator = iterator+num;
        textarea.value = history[iterator][0];
        textarea.selectionStart = textarea.selectionEnd = history[iterator][1];
        updateAndSaveNotesLocally();
    }
}

function getLinePos() {
    //substring from 0 to caret position
    let toCaret = notesTextArea.value.substring(0, notesTextArea.selectionStart)
    //substring from caret position onwards
    let fromCaret = notesTextArea.value.substring(notesTextArea.selectionStart)
    if(toCaret.substring(toCaret.lastIndexOf("\n")) + fromCaret.substring(0, fromCaret.indexOf("\n")) !== "\n") {
        currLine = toCaret.substring(toCaret.lastIndexOf("\n")+1) + fromCaret.substring(0, fromCaret.indexOf("\n"))
    }
    currLine = toCaret.substring(toCaret.lastIndexOf("\n")+1) + fromCaret.substring(0, fromCaret.indexOf("\n"))
}

notesTextArea.addEventListener('keyup', function (e) {
    history[history.length-1][1] = this.selectionStart
    getLinePos();
});

notesTextArea.addEventListener('mouseup', function (e) {
    history[history.length-1][1] = this.selectionStart
    getLinePos();
});

notesTextArea.addEventListener('keydown', function (e) {
    let start = this.selectionStart;
    let end = this.selectionEnd;
    if (e.ctrlKey && e.altKey && e.key === 'z') {
        e.preventDefault();
        handleIterator(1, this)
    } else if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        handleIterator(-1, this)
    } else if (e.key === 'Tab') {
        handleHistory(this);
        e.preventDefault();
        if(emptyUList.test(currLine)) {
            this.value = this.value.substring(0, start - 2) + `\t- ` + this.value.substring(end);
            this.selectionStart = this.selectionEnd = start + 1;
        } else if (emptyOlist.test(currLine)) {
            let numAsText = currLine.substring(0,currLine.indexOf(".")).replaceAll("\t", "")
            this.value = this.value.substring(0, start - 2 - 1) + `\t1. ` + this.value.substring(end);
            this.selectionStart = this.selectionEnd = start + numAsText.length;
        } else {
            this.value = this.value.substring(0, start) + "\t" + this.value.substring(end);
            this.selectionStart = this.selectionEnd = start + 1;
        }
    } else if (e.key === "Enter" && !e.shiftKey && !onMobile) {
        handleHistory(this);
        if (emptyOlist.test(currLine)) {
            // leave empty ordered list
            e.preventDefault()
            let back = currLine.substring(0, currLine.indexOf(". ")).length + 2;
            this.value = this.value.substring(0, start-back) + this.value.substring(end);
            this.selectionStart = this.selectionEnd = start - back;
        } else if (emptyUList.test(currLine)) {
            //leave empty unordered list
            e.preventDefault()
            let count = currLine.substring(0, currLine.indexOf("- ")).length
            this.value = this.value.substring(0, start-2-count) + this.value.substring(end);
            this.selectionStart = this.selectionEnd = start - 2 - count;
        } else if(olist.test(currLine)) {
            // Add item to ordered list
            e.preventDefault()
            let numAsText = currLine.substring(0,currLine.indexOf(".")).replaceAll("\t", "")
            let count = currLine.substring(0, currLine.indexOf(numAsText)).length
            this.value = this.value.substring(0, start) + `\n${"\t".repeat(count)}` + (parseInt(numAsText) + 1) + ". " + this.value.substring(end);
            this.selectionStart = this.selectionEnd = start + numAsText.length + 3 + count;
        } else if (ulist.test(currLine)) {
            // Add item to unordered list
            e.preventDefault()
            let count = currLine.substring(0, currLine.indexOf("- ")).length
            this.value = this.value.substring(0, start) + `\n${"\t".repeat(count)}- ` + this.value.substring(end);
            this.selectionStart = this.selectionEnd = start + 3 + count;
        }
        updateAndSaveNotesLocally();
        syncStatus(s);
    }
});

async function saveStickyNotes() {
    const saveStatus = await fetch("/api/save/notebooks/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: "sticky__notes",
            content: JSON.stringify([document.getElementById("stickyNotes").firstChild.value])
        })
    })
}

function showStickyNotes(ele) {
        ele.style.borderRadius = "0px"
        ele.style.width = "300px"
        ele.style.height = "300px"
        ele.style.padding = "10px"
        ele.style.zindex = "1000";
        ele.innerText = ""
        const ta = document.createElement("textarea")
        ta.value = ele.getAttribute("data-text")
        ta.style.height = "300px"
        ta.style.width = "300px"
        ta.style.position = "relative"
        ta.style.outline = "none"
        ta.style.border = "none"
        ta.style.resize = "none"
        ta.style.backgroundColor = "palegoldenrod"
        ta.addEventListener('input', saveStickyNotes)
        ele.appendChild(ta)
        ele.setAttribute("data-pos", "visible")
        ta.focus()
}

function hideStickyNotes() {
    ele = document.getElementById("stickyNotes")
    if(ele.getAttribute("data-pos") === "visible") {
        ele.addEventListener('click', function(e) {
            showStickyNotes(this);
        }, {once: true});
        ele.setAttribute("data-text", ele.firstChild.value)
        ele.firstChild.removeEventListener("input", saveStickyNotes)
        ele.firstChild.remove()
        ele.style.borderRadius = "3.5em"
        ele.style.width = "3.5em"
        ele.style.height = "3.5em"
        ele.style.padding = "0px"
        ele.innerText = "..."
        ele.setAttribute("data-pos", "hidden")
    }
}

async function retrieveStickyNotes() {
    let sticky = JSON.parse(await getAnyBookContent("sticky__notes"))[0]
    document.getElementById("stickyNotes").setAttribute("data-text", sticky)
}

retrieveStickyNotes();

notesTextArea.addEventListener("beforeinput", function (e) {
    handleHistory(this);
});

notesTextArea.addEventListener("input", function (e) {
    updateAndSaveNotesLocally();
    hideBookDiffPopup();
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
    if ((e.ctrlKey && (e.key === 's' || e.key === 'S')) && !atHome) {
        e.preventDefault();
        saveNoteBookToDb();
    } 
    else if ((e.ctrlKey && (e.key === 'e' || e.key === 'E'))) {
        e.preventDefault();
        cycleViewPreferences();
    }
});

areNotesSavedIcon.addEventListener('animationend', () => {
    areNotesSavedIcon.classList.remove("saved")
});

document.getElementById("icon1").addEventListener('click', function(e) {
    saveNoteBookToDb();
});

document.getElementById("icon2").addEventListener('click', function(e) {
    openNoteBookPrompt();
});

document.getElementById("icon3").addEventListener('click', function(e) {
    confirmBookDeletion();
});

document.getElementById("getFile1").addEventListener('change', function(e) {
    insertAndSaveImage();
});

document.getElementById("icon5").addEventListener('click', function(e) {
    cycleViewPreferences();
});

document.getElementById("icon6").addEventListener('click', function(e) {
    handlePageMovement(true, 1, false);
});

if(onMobile) {
    document.getElementById("icon7").addEventListener('click', function(e) {
        handlePageMovement(false, 1, true);
    });
} else {
    document.getElementById("icon7").addEventListener('click', function(e) {
        handlePageMovement(false, 1, false);
    });
}

document.getElementById("sideBarRetractList").addEventListener('click', function(e) {
    toggleList();
});

document.getElementById("mobileMenu").addEventListener('click', function(e) {
    toggleList();
});

document.getElementById("mobileSyncContainer").addEventListener('click', function(e) {
    forceUpdateNotes();
});

document.getElementById("newPage").addEventListener('click', function(e) {
    jumpToDesiredPage(book.length);
});

mainContainer.addEventListener('click', function(e) {
    hideBookDiffPopup();
    hideStickyNotes();
});

notesPreviewArea.addEventListener('click', function(e) {
    wikiSearch(e);
});

document.getElementById("bookDiffExit").addEventListener('click', function(e) {
    hideBookDiffPopup();
});

document.getElementById("stickyNotes").addEventListener('click', function(e) {
    showStickyNotes(this);
}, {once: true});