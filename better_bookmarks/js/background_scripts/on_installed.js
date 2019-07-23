/*
 * file        : on_installed.js
 * description : This file contains code that is ran in
 *               response to the onInstalled event which
 *               occurs when the user installs the extension.
 *
 */

// Create the necessary folders on install if they haven't
// been already.
chrome.runtime.onInstalled.addListener((details) => {
    chrome.storage.sync.get(["createdCategories"], (result) => {
        if (!result.createdCategories) {
            console.log("Creating folder categories in response " +
                        "to chrome.runtime.onInstalled event...");
            chrome.bookmarks.create({parentId: "1",
                                    "title": "Art"});

            chrome.bookmarks.create({parentId: "1",
                                    "title": "Business"});

            chrome.bookmarks.create({parentId: "1",
                                    "title": "Health"});

            chrome.bookmarks.create({parentId: "1",
                                    "title": "Society"});

            chrome.bookmarks.create({parentId: "1",
                                    "title": "Sports"});

            chrome.storage.sync.set({createdCategories: true});
        }
    });
});
