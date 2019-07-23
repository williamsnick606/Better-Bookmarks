/*
 * file        : folderModal.js
 * description : This file contains code for manipulating the modal,
 *               i.e., popup, that displays when a user clicks the
 *               "add folder" button in the primary extension popup.
 *
 */

// This initializes all the variables we need for the modal.
var modal      = document.getElementById("folderModal");
var newFolder  = document.getElementById("newFolder");
var saveFolder = document.getElementById("saveFolder");
var span       = document.getElementById("folderSpan");
var select     = document.getElementById('folderDrop');

/*
 * Description: This function goes through the user's bookmark tree, adding
 *              their folders as options to our folder dropdown, so that they
 *              can save a bookmark to any bookmark folder they want.
 * Inputs:      "id" == a number corresponding to the bookmarkID of the node
 *              whose children you want added to the dropdown list.
 * Output:      None.
 */
grabFolders('0');
function grabFolders(id) {
    chrome.bookmarks.getChildren(id, function(children) {
        children.forEach(function(bookmark) { 
            if(bookmark.url == null){
                var option = document.createElement('option');
                option.value = bookmark.id;
                option.text = bookmark.title;
                select.appendChild(option);
            }
            grabFolders(bookmark.id);
        });
    });
}

newFolder.onclick = function() {
    modal.style.display = "block";
}

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

saveFolder.onclick = function() {
    var folderT = document.getElementById("newNameF").value;
    var selection = document.getElementById("folderDrop").text;
    var ID = document.getElementById("folderDrop").value;
    chrome.bookmarks.create({'parentId': ID,
                             'title':    folderT
    });
    modal.style.display = "none";
}