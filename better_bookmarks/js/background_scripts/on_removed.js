/*
 * file        : on_removed.js
 * description : This file contains code that set the "createdCategories"
 *               value in storage to false if the user deletes any of the
 *               category folders created during install.
 *
 */

chrome.bookmarks.onRemoved.addListener((id, removeInfo) => {
    console.log("Bookmark or Folder with id " + id + " " +
                "removed...");
    const node = removeInfo.node;
    console.log("Bookmark or Folder removed has title " +
                node.title);

    chrome.storage.sync.get([ "categories"
                            , "categoriesMap"
                            , "deletedCategories"
                            ], results => {
        const categoriesArray = results.categories;
        const categoriesDict  = results.categoriesMap;
        const categoryIndex   = categoriesArray.indexOf(node.title);

        console.log("categoriesArray.indexOf(node.title) = " +
            categoryIndex);

        if (categoriesArray &&
            categoryIndex !== -1) {
            delete categoriesDict[categoryIndex];
            const newCategories =
                categoriesArray.filter(val => { return val !== node.title });


            console.log("Deleted " + node.title + " from categoriesArray.");
            console.log("newCategoriesArray = " + newCategories);

            if (newCategories.length === 0) {
                chrome.storage.sync.set({ createdCategories : false
                                        , categories        : null
                                        , categoriesMap     : null
                                        });

                console.log("Set createdCategories to false.");
                console.log("Set categories to null.");
                console.log("Set categoriesMap to null.");
            }

            chrome.storage.sync.set({ categories        : newCategories
                                    , categoriesMap     : categoriesDict
                                    });
        }
    });
});
