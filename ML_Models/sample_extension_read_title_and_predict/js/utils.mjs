/*
 * file        : utils.mjs
 * description : This file is a JavaScript module intended to
 *               contain utility functions.
 *
 *
 */

/*
 * Returns a new HTML tag.
 *
 * @param data : an object consisting of a tag,
 *               array of classes, and an object
 *               of attribute keys and their values.
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

/*
 * Returns a div tag that represents a folder dropdown.
 *
 * @param parentId : the numeric ID of the parent bookmark
 *                   node.
 * @return a dropdown HTML element.
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

/*
 * Returns an a tag that represents a clickable
 * bookmark to be included in a folder dropdown.
 *
 * @param bookmarkId    : the numeric ID of the bookmark
 *                        node.
 * @param bookmarkTitle : the bookmark's title.
 * @return a bookmark HTML element.
 *
 */
function createBookmark(bookmarkId, bookmarkTitle) {
    return createTag({ tag: "a"
                     , id: "bookmark" + bookmarkId
                     , attrs: { href: "#"
                              , innerHTML: bookmarkTitle
                              }
                     });
}

/*
 * Returns a div tag with an inner a tag which
 * represents a clickable, and dropdownable,
 * folder.
 *
 * @param folderId    : the numeric ID of the bookmark folder
 *                      node.
 * @param folderTitle : the bookmark folder's title.
 * @return a folder HTML element.
 *
 */
export function createFolder(folderId, folderTitle) {
    // Create a folder div.
    const folderDiv = createTag({ tag: 'div'
                                , attrs: { id: 'folder' +
                                           folderId
                                         }
                                });
                            
    // Add a clickable link, i.e., an "actual"
    // folder.
    const folder = createTag({ tag: "a"
                             , attrs: { id: folderId
                                      , name: folderTitle
                                      , href: '#'
                                      }
                             , classes: ['accordion']
                             });
    folder.innerHTML = "<b>" + folderTitle + "</b>";
    if (folderTitle.length == 0) {
        folder.innerHTML = "<b>untitled</b>";
    }
    folderDiv.appendChild(folder);
    return folderDiv;
}


/*
 * Walks the bookmark tree and adds the folders
 * to the popup menu.
 *
 * @return undefined
 *
 */
export function addBookmarkContent() {
    var folderDiv, dropdownDiv, bmarkContent;
    const dropdownDivs = [];

    /*
    * Walks the bookmark tree adding
    * list tags for each folder it finds
    * along the way.
    *
    *
    * @param bs: the child array.
    * @return undefined
    *
    */
    function walkChildren(bs) {
        if (bs == undefined) {
            return;
        }
        for (let i = 0; i < bs.length; i++) {
            let node = bs[i];
            // Folder case.
            if (node.url == undefined && node.id != 0) {
                if (!dropdownDiv && folderDiv) {
                    dropdownDiv = createDropdown(node.parentId);
                    folderDiv.appendChild(dropdownDiv);
                    console.log("Created dropdown div with id " +
                                dropdownDiv.id);
                }
                // Create a folder div.
                folderDiv = createFolder(node.id, node.title);
                                      
                console.log("Created folder div with id " + folderDiv.id);
                // Add root bookmark folder to bookmarkContent
                // div.
                if (node.parentId == 0) {
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
                    console.log("pushed dropdown div " + dropdownDiv.id +
                          " to dropdown div stack");
                    dropdownDiv = undefined;
                }
            }
            // Bookmark case.
            if (node.url != undefined && node.id != 0) {
                // Since the above check weeds out the
                // root node, we only need to check if
                // we've already created a dropdown div.
                if (node.parentId != 0 && !dropdownDiv) {
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
                console.log("Found bookmark with parentId " + node.parentId);
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
            console.log("FINISHED WALK OF CHILDREN FOR NODE WITH ID " +
                        node.id);
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
        walkChildren(bs);

        // Attach the listeners for dropdown functionality.
        //const folders = document.getElementsByClassName("dropbtn");
        const folders = document.getElementsByClassName("accordion");
        attachFolderListeners(folders);
        console.log("-----END OF BOOKMARK WALK-----");
    });
}

/*
 * Validates the search bar text and if the
 * input is valid, passes it to a callback
 * that searches for that text in the bookmarks.
 *
 * ==== Still in progress. ====
 *
 * @return undefined
 *
 */
export function validateForm() {
    var val = document.forms["searchForm"]["searchBar"].value;
    alert(val);
}

/*
 * Toggles, i.e., shows, the bookmark titles/folders,
 * that reside in a clicked on folder matching a
 * given ID in the popup menu.
 *
 * @param folder   : the folder element whose contents
 *                   need to be displayed.
 * @param folderID : the ID of the folder that was just
 *                   clicked.
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

/*
 * Attaches on-click listerners to the bookmark
 * folders in the popupmenu.
 *
 * @param folders : the folders to attach an onclick
 *                  listener to.
 * @return undefined
 *
 */
function attachFolderListeners(folders) {
    for (let i = 0; i < folders.length; i++) {
        const folder = folders[i];
        folder.addEventListener("click", () => {
            toggleBookmarks(folder, folder.id); 
        });
    }
}
