/*
 * file        : utils.mjs
 * description : This file is a JavaScript module intended to
 *               contain utility functions.
 *
 */

/*
 * Walks the bookmark tree and adds the folders
 * to the popup menu.
 *
 * @return undefined
 *
 */
export function addBookmarkContent() {
    var folderDiv, dropdownDiv, bmarkContent;
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
            if (node.id != 0 && node.url == undefined) {
                // Create a folder div.
                folderDiv    = document.createElement("div");
                folderDiv.id = "folder" + node.id;
                
                // Add a clickable link, i.e., an "actual"
                // folder.
                var folder  = document.createElement("a");
                folder.id   = node.id;
                folder.name = node.title;
                folder.href = "#";
                folder.classList.toggle("accordion");

                // Chrome allows untitled folders, so
                // check for them.
                if (node.title.length > 0) {
                    folder.innerHTML = node.title;
                }
                // Untitled bookmark folder.
                else {
                    folder.innerHTML = "untitled";
                }
                folderDiv.appendChild(folder);
            }
            // Bookmark case.
            if (node.url != undefined && node.id != 0) {
                // Since the above check weeds out the
                // root node, we only need to check if
                // we've already created a dropdown div.
                if (!dropdownDiv) {
                    // Create a new bookmark "list."
                    dropdownDiv = document.createElement("div");
                    dropdownDiv.id = "folderDropdown" +
                                     node.parentId;
                    dropdownDiv.classList
                               .toggle("panel");
                    
                }
                // Add a bookmark entry to the dropdown.
                const bmark     = document.createElement("a");
                bmark.id        = "bookmark" + node.id;
                bmark.href      = "#";
                bmark.innerHTML = node.title;
                // Add an on-click event listener for
                // launching a clicked-on bookmark in
                // a new tab.
                bmark.addEventListener("click", () => {
                    chrome.tabs.create({ url: node.url });
                });
                dropdownDiv.appendChild(bmark);
            }
            walkChildren(node.children);
        }
        // Close out the folder divs and dropdowns.
        if (dropdownDiv) {
            folderDiv.appendChild(dropdownDiv);
            dropdownDiv = undefined;
        }
        if (folderDiv) {
            bmarkContent.appendChild(folderDiv);
            folderDiv = undefined;
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
