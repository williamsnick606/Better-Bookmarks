/*
 * file        : on_installed.js
 * description : This file contains code that is ran in
 *               response to the onInstalled event which
 *               occurs when the user installs the extension.
 *
 */

function createCategoryFolder(categoryTitle, categoryParentId) {
    function callback(node) {
        const obj           = {};
        obj[categoryTitle]  = node.id;
        console.log("Creating category object " + obj);
        chrome.storage.sync.set(obj);
    }
    chrome.bookmarks.create({ parentId : categoryParentId
                            , title    : categoryTitle
                            }, callback
                           );
}

// Create the necessary folders on install if they haven't
// been already.
chrome.runtime.onInstalled.addListener((details) => {
    chrome.storage.sync.get(["createdCategories"], (result) => {
        // Need to setup something to add only those categories
        // that have been deleted.

        // If all categories have been deleted,
        // then create them again.
        if (!result.createdCategories) {
            const categoriesArray = [ "Art"
                                    , "Business"
                                    , "Health"
                                    , "Society"
                                    , "Sports"
                                    ];
            const categoriesDict  = { 0 : "Art"
                                    , 1 : "Business"
                                    , 2 : "Health"
                                    , 3 : "Society"
                                    , 4 : "Sports"
                                    }
            console.log("Creating folder categories in response " +
                        "to chrome.runtime.onInstalled event...");
            for (let category of categoriesArray) {
                createCategoryFolder(category, "1");
            }
            chrome.storage.sync.set({ createdCategories : true
                                    , categories        : categoriesArray
                                    , categoriesMap     : categoriesDict
                                    });
            console.log("Set categoriesMap to " + categoriesDict);
        }
    });
});
