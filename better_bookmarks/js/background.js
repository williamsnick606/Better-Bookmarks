/*
 * file        : background.js
 * description : This file contains various event listeners and
 *               their associated callback functions to be ran
 *               in the background.
 *
 */

// Create context menu items.
chrome.contextMenus.removeAll();
chrome.contextMenus.create({
    id: "first-id",
    title: "first",
    contexts: ["browser_action"]
});
// Context menu onClicked listener.
chrome.contextMenus.onClicked.addListener(function(info, tab) {
    alert('first');
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log("Tab " + tabId + " updated...");
    console.log("URL = " + changeInfo.url);
    console.log("Title = " + changeInfo.title);
    chrome.tabs.executeScript(tabId, {code: 'document.getElementsByTagName("title")[0];',
                                      runAt: "document_end"},
                              function(result) {
        alert("result = " + result);
        /*
        usableT = result.title;
        usableD = result.description;
        usableU = result.url;
        */
    });
});
