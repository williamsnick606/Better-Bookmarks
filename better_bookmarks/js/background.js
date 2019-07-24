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

// Create the necessary folders on install
chrome.runtime.onInstalled.addListener(function (details) {
	chrome.bookmarks.create({parentId: '1',
	                          'title': 'Art'});

	chrome.bookmarks.create({parentId: '1',
	                          'title': 'Business'});

	chrome.bookmarks.create({parentId: '1',
 	                          'title': 'Health'});

	chrome.bookmarks.create({parentId: '1',
	                          'title': 'Society'});

	chrome.bookmarks.create({parentId: '1',
	                          'title': 'Sports'});
});