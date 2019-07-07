/*
 * file        : add_bookmarks.js
 * description : This file contains a function for adding bookmark
 *               folders to the extension's popup menu.
 *
 */

/*
 * Walks the bookmark tree and adds the folders
 * to the popup menu.
 *
 * @return undefined
 *
 */
function addFoldersToPopup() {
    var text, bmarks;
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
        if (bs.length == 0) {
            return;
        }
        for (let i = 0; i < bs.length; i++) {
            let bmark = bs[i];
            let cs    = bmark.children;
            if (bmark.url == undefined &&
                bmark.title.length > 0) {
                text = text + "<li id=" + bmark.id + " " +
                       "class=\"nobull " +
                       "li-space\"><a href=\"#\">" +
                       bmark.title + "</a></li>";
            }
            walkChildren(bmark.children);
        }
    }
    bmarks = document.getElementById('folders');
    chrome.bookmarks.getTree(function(bs) {
        text = "<ul id=\"bookmarkList\">";
        walkChildren(bs);
        text = text + "</ul>";
        bmarks.innerHTML = text;
    });
}

addFoldersToPopup();
