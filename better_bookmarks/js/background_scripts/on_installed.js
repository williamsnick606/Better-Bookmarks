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
        if (!result.createdCategories) {
            const categoriesArray = [ "Art"
                                    , "Business"
                                    , "Health"
                                    , "Society"
                                    , "Sports"
                                    ];
            const categoriesDict  = { 0 : "Bookmarks bar"
                                    , 1 : "Art"
                                    , 2 : "Business"
                                    , 3 : "Health"
                                    , 4 : "Society"
                                    , 5 : "Sports"
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
