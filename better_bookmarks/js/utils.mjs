/*
 * file        : utils.mjs
 * description : This file is a JavaScript module intended to
 *               contain utility functions.
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
 * Walks the bookmark tree and adds the folders
 * to the popup menu.
 *
 * @return undefined
 *
 */
export function addBookmarkContent() {
    var folderDiv, dropdownDiv, bmarkContent;
    const folderDivs   = [];
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
        if (bs == undefined || bs.length == 0) {
            return;
        }
        for (let i = 0; i < bs.length; i++) {
            let node = bs[i];
            // Folder case.
            if (node.url == undefined && node.id != 0) {
                // Create a folder div.
                folderDiv = createTag({ tag: 'div'
                                      , attrs: { id: 'folder' +
                                                     node.id
                                               }
                                      });
                                      
                // Add a clickable link, i.e., an "actual"
                // folder.
                var folder = createTag({ tag: "a"
                                       , attrs: { id: node.id
                                                , name: node.title
                                                , href: '#'
                                                }
                                       , classes: ['accordion']
                                       });
                folderDiv.appendChild(folder);
                if (dropdownDiv) {
                    /*
                    alert("appending folderDiv with id " +
                          folderDiv.id + " to dropdownDiv " +
                          "with id " + dropdownDiv.id);
                          */
                    dropdownDiv.appendChild(folderDiv);
                    dropdownDivs.push(dropdownDiv);
                    dropdownDiv = undefined;
                }
                // Only add folders in the root bookmark
                // directory.
                if (node.parentId == 0) {
                    bmarkContent.appendChild(folderDiv);
                }
                // Chrome allows untitled folders, so
                // check for them.
                if (node.title.length > 0) {
                    folder.innerHTML = node.title;
                }
                // Untitled bookmark folder.
                else {
                    folder.innerHTML = "untitled";
                }
            }
            // Bookmark case.
            if (node.url != undefined && node.id != 0) {
                // Since the above check weeds out the
                // root node, we only need to check if
                // we've already created a dropdown div.
                if (node.parentId != 0 && !dropdownDiv) {
                    //alert("Created dropdown for folderId " +
                          //node.parentId);
                    // Create a new bookmark "list."
                    dropdownDiv = createTag({ tag: "div"
                                            , attrs: { id: "folderDropdown" +
                                                   node.parentId }
                                            , classes: ["panel"]
                                            });
                }
                // Create a bookmark element.
                const bmark = createTag({ tag: "a"
                                        , id: "bookmark" + node.id
                                        , attrs: { href: "#"
                                                 , innerHTML: node.title
                                                 }
                                        });
                // Add an on-click event listener for
                // launching a clicked-on bookmark in
                // a new tab.
                bmark.addEventListener("click", () => {
                    chrome.tabs.create({ url: node.url });
                });
                // If a dropdown was created, then append
                // the bookmark to that.
                if (dropdownDiv) {
                    //alert("appending bookmark with id " +
                          //node.id);
                    dropdownDiv.appendChild(bmark);
                    //alert("appending dropdownDiv with id " +
                          //dropdownDiv.id + " to folderDiv with id " +
                          //folderDiv.id);
                    folderDiv.appendChild(dropdownDiv);
                }
                // Otherwise, add the bookmark to the
                // bookmarkContent div.
                else {
                    bmarkContent.appendChild(bmark);
                }
            }
            walkChildren(node.children);
        }
        if (dropdownDivs.length > 0) {
            dropdownDiv = dropdownDivs.pop();
        }
    }
    // Get the bookmarkContent div so we can place our
    // folder dropdowns in it.
    bmarkContent = document.getElementById("bookmarkContent");
    // Create the necessary HTML and add it to the DOM.
    chrome.bookmarks.getTree(function(bs) {
        walkChildren(bs);

    // Attach the listeners for dropdown functionality.
    //const folders = document.getElementsByClassName("dropbtn");
    const folders = document.getElementsByClassName("accordion");
    attachFolderListeners(folders);
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
