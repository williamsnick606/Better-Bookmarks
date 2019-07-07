

function printTree() {
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
                text = text + "<li id=" + bmark.id +
                       " class=\"nobull " +
                       "li-space\">" +
                       bmark.title + "</li>";
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

printTree();
