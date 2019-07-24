/*
 * file        : utils.mjs
 * description : This file is a JavaScript module intended to
 *               contain utility functions.
 * exports     : [ createTag/1
 *               , createDropdown/1
 *               , createFolder/2
 *               , addBookmarkContent/0
 *               , validateForm/0
 *               ]
 */
/**
 * @file This file is a JavaScript module intended to
 *     contain utility functions.
 *
 * @module utils
 * 
 */

/**
 * Returns a new HTML tag.
 *
 * @author Brady McGrath
 *
 * @param {Object} data           - An object describing the HTML tag
 *     to construct.
 * @param {string}   data.tag     - The HTML tag to create.
 * @param {Object}   data.attrs   - An object of HTML attributes
 *     to set.
 * @param {string[]} data.classes - An array of classes to set.
 * @return a new HTML tag object.
 *
 */
export function createTag(data) {
    const tag     = data.tag;
    const classes = data.classes;
    const attrs   = data.attrs;
    // Create a new new div tag.
    const elem    = document.createElement(tag);
    if (classes) {
        let classVal;
        for (classVal of classes) {
            elem.classList.toggle(classVal);
        }
    }
    if (attrs) {
        let key;
        for (key in attrs) {
            elem[key] = attrs[key];
        }
    }
    return elem;
}

/**
 * Returns a div tag that represents a folder dropdown.
 *
 * @author Brady McGrath
 *
 * @param {string} parentId - the numeric ID of the
 *     parent bookmark node as a string.
 * @return {Object} a dropdown HTML element.
 *
 */
export function createDropdown(parentId) {
    return createTag({ tag: "div"
                     , attrs: { id: "folderDropdown" +
                                    parentId
                              }
                     , classes: ["panel"]
                     });
}

/**
 * Returns an a tag that represents a clickable
 * bookmark to be included in a folder dropdown.
 *
 * @author Brady McGrath
 *
 * @param {string} bookmarkId    - the numeric ID of the bookmark
 *     node as a string.
 * @param {string} bookmarkTitle - the bookmark's title.
 * @return {Object} a bookmark HTML element.
 *
 */
function createBookmark(bookmarkId, bookmarkTitle) {
    const bookmark = createTag({ tag: "a"
                               , id: "bookmark" + bookmarkId
                               , attrs: { href: "#" }
                               });
    const linkIcon = createTag({ tag     : "i"
                               , attrs   : { id        : "linkIcon"
                                           , innerHTML : "link"
                                           }
                               , classes : [ "material-icons" ]
                               });
    bookmark.appendChild(linkIcon);
    bookmark.innerHTML += bookmarkTitle;
    return bookmark;
}

/**
 * Returns a div tag with an inner a tag which
 * represents a clickable, and dropdownable,
 * folder.
 *
 * @author Brady McGrath
 *
 * @param {string} folderId    - the numeric ID of the bookmark folder
 *     node as a string.
 * @param {string} folderTitle - the bookmark folder's title.
 * @return {Object} a folder HTML element.
 *
 */
export function createFolder(folderId, folderTitle) {
    // Create a folder div.
    const folderDiv      = createTag({ tag: "div"
                                     , attrs: { id: "folder" +
                                                    folderId
                                              }
                                     });
                            
    // Add a clickable link, i.e., an "actual"
    // folder.
    const folder         = createTag({ tag: "a"
                                     , attrs: { id: folderId
                                              , name: folderTitle
                                              , href: '#'
                                              }
                                     , classes: ['accordion']
                                     });
    const folderIcon     = createTag({ tag     : "i"
                                     , attrs   : { id        : "folderIcon"
                                                 , innerHTML : "&#xe2c7;"
                                                 }
                                     , classes : ["material-icons"]
                                     });
    folder.appendChild(folderIcon);
    folder.innerHTML    += "<b>" + folderTitle + "</b>";
    if (folderTitle.length === 0) {
        folder.innerHTML = "<b>untitled</b>";
    }
    folderDiv.appendChild(folder);
    return folderDiv;
}

/**
 * Adds all the current bookmark folders to the given
 * HTML selection tag object.
 *
 * @param {Object} selectionMenu - The select tag used for displaying
 *     a user's folders when adding a new bookmark or folder.
 * @return {undefined}
 *
 */
export function addFoldersToSelectionMenu(selectionMenu) {
    function go(nodeId) {
        chrome.bookmarks.getChildren(nodeId, children => {
            for (let child of children) {
                if (!child.url) {
                    const optionTag = createTag({ tag   : "option"
                                                , attrs : { id    : "option" +
                                                                    child.id
                                                          , value : child.id
                                                          , text  : child.title
                                                          }
                                                });
                    selectionMenu.appendChild(optionTag);
                }
                go(child.id);
            }
        });
    }
    go("0");
}

/**
 * Walks the bookmark tree and adds the folders
 * to the popup menu.
 *
 * @author Brady McGrath
 *
 * @return {undefined}
 *
 */
export function addBookmarkContent() {
    var folderDiv, dropdownDiv, bmarkContent;
    const dropdownDivs = [];

    /**
     * Walks the bookmark tree adding
     * list tags for each folder it finds
     * along the way.
     *
     * @author Brady McGrath
     *
     * @param {Object[]} bs - the child array.
     * @return {undefined}
     *
     */
    function walkChildren(bs) {
        // bs is undefined.
        if (!bs) {
            return;
        }
        for (let i = 0; i < bs.length; i++) {
            let node = bs[i];
            // Folder case.
            if (!node.url && node.id !== "0") {
                if (!dropdownDiv && folderDiv) {
                    dropdownDiv = createDropdown(node.parentId);
                    folderDiv.appendChild(dropdownDiv);
                    console.log("Created dropdown div with id " +
                                dropdownDiv.id);
                }
                // Create a folder div.
                folderDiv    = createFolder(node.id, node.title);
                const folder = folderDiv.firstChild;
                folder.addEventListener("click", () => {
                    toggleBookmarks(folder, folder.id); 
                });
                                      
                console.log("Created folder div with id " +
                            folderDiv.id);
                // Add root bookmark folder to bookmarkContent
                // div.
                if (node.parentId === "0") {
                    bmarkContent.appendChild(folderDiv);
                }
                // A dropdown already exists, so this folder
                // should be added to that dropdown.
                if (dropdownDiv) {
                    dropdownDiv.appendChild(folderDiv);
                    console.log("appended folder div " +
                          folderDiv.id +
                          " to dropdown div " +
                          dropdownDiv.id);
                    dropdownDivs.push(dropdownDiv);
                    console.log("pushed dropdown div " +
                                dropdownDiv.id +
                                " to dropdown div stack");
                    dropdownDiv = undefined;
                }
            }
            // Bookmark case.
            if (node.url && node.id !== "0") {
                // In Chrome, no bookmarks have a parentId
                // of zero, so all we need to do is check
                // that dropdownDiv is undefined.
                if (!dropdownDiv) {
                    // Create a new bookmark "list."
                    dropdownDiv = createDropdown(node.parentId);
                    console.log("Created dropdown div with id " +
                          dropdownDiv.id);
                    folderDiv.appendChild(dropdownDiv);
                    console.log("appended dropdown div " +
                          dropdownDiv.id +
                          " to folder div " +
                          folderDiv.id);
                }
                // Create a bookmark element.
                const bmark = createBookmark(node.id, node.title);
                // Add an on-click event listener for
                // launching a clicked-on bookmark in
                // a new tab.
                bmark.addEventListener("click", () => {
                    chrome.tabs.create({ url: node.url });
                });
                console.log("Found bookmark with parentId " +
                            node.parentId);
                console.log("Created bookmark with title " +
                      bmark.innerText);
                // If a dropdown was created, then append
                // the bookmark to that.
                if (dropdownDiv) {
                    dropdownDiv.appendChild(bmark);
                    console.log("appended bookmark \"" +
                          bmark.innerText +
                          "\" to dropdown div " +
                          dropdownDiv.id);
                }
                // Otherwise, add the bookmark to the
                // bookmarkContent div.
                else {
                    bmarkContent.appendChild(bmark);
                    console.log("appended bookmark \"" +
                          bmark.innerText +
                          "\" to bookmarkContent div");
                }
            }
            // Time to moon walk.
            console.log("ABOUT TO WALK CHILDREN OF BOOKMARK " +
                        "NODE WITH ID " + node.id);
            walkChildren(node.children);
            console.log("FINISHED WALK OF CHILDREN FOR NODE " +
                        "WITH ID " + node.id);
        }
        // About to go back up one level, so pop
        // off the dropdown stack.
        if (dropdownDivs.length > 0) {
            dropdownDiv = dropdownDivs.pop();
            console.log("popped dropdown div stack");
            console.log("set dropdown div back to dropdown div " +
                  dropdownDiv.id);
            console.log("stack = " + dropdownDivs);
        }
        // Reached root level, so go back to
        // nothing.
        else {
            console.log("Dropdown stack empty; " +
                        "setting dropdownDiv and " +
                        "folderDiv to undefined.");
            dropdownDiv = undefined;
            folderDiv   = undefined;
        }
    }
    // Get the bookmarkContent div so we can place our
    // folder dropdowns in it.
    bmarkContent = document.getElementById("bookmarkContent");
    // Create the necessary HTML and add it to the DOM.
    console.log("-----STARTING BOOKMARK WALK-----");
    chrome.bookmarks.getTree(function(bs) {
        // Start moon walkin'.
        walkChildren(bs);
        console.log("-----END OF BOOKMARK WALK-----");
    });
}

/**
 * Toggles, i.e., shows, the bookmark titles/folders,
 * that reside in a clicked on folder matching a
 * given ID in the popup menu.
 *
 * @author Brady McGrath
 *
 * @param {Object} folder   - the folder element whose contents
 *     need to be displayed.
 * @param {string} folderID - the ID of the folder that was just
 *     clicked.
 * @return undefined
 *
 */
function toggleBookmarks(folder, folderId) {
    const dropdown = document.getElementById("folderDropdown" +
                                             folderId);
    if (dropdown) {
        dropdown.classList.toggle("active");

        var panel = folder.nextElementSibling;
        if (panel.style.display === "block") {
            panel.style.display = "none";
        }
        else {
            panel.style.display = "block";
        }
    }
}
