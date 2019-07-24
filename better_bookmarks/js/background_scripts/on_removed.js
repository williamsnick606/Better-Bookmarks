/*
 * file        : on_removed.js
 * description :
 *
 */

chrome.bookmarks.onRemoved.addListener((id, removeInfo) => {
    console.log("Bookmark or Folder with id " + id + " " +
                "removed...");
    const node = removeInfo.node;
    console.log("Bookmark or Folder removed has title " +
                node.title);
    chrome.storage.sync.get([ "categories" ], (results) => {
        const categoriesArray = results.categories;
        console.log("categoriesArray.indexOf(node.title) = " +
            categoriesArray.indexOf(node.title));
        if (categoriesArray &&
            (categoriesArray.indexOf(node.title) !== -1)) {
            chrome.storage.sync.set({ createdCategories : false });
            console.log("Set createdCategories to false.");
        }
    });
});
