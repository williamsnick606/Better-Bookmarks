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
export function addFoldersToPopup() {
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
        if (bs == undefined || bs.length == 0) {
            return;
        }
        for (let i = 0; i < bs.length; i++) {
            let bmark = bs[i];
            let cs    = bmark.children;
            if (bmark.id != 0 && bmark.url == undefined) {
                text += "<li id=" + bmark.id +
                       "><a href=\"#\">";
                // Chrome allows untitled folders, so
                // check for them.
                if (bmark.title.length > 0) {
                    text += bmark.title + "</a></li>";
                }
                // Untitled bookmark folder.
                else {
                    text += "untitled</a></li>";
                }
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
