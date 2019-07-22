/*
 * file        : bookmark_event_listener.js
 * description : This file contains various event listeners
 *               for bookmark related activities such as
 *               creation, movement, deletion, etc.
 */
/**
 * @file This file contains various event listeners
 *     for bookmark related activities such as
 *     creation, movement, deletion, etc.
 */

/**
 * Will make some type of call to a function that
 * uses machine learning to automatically organize
 * bookmarks.
 *
 * @author Brady McGrath
 *
 * @param {string} id - The bookmark's id.
 * @param {Object} node - The bookmark's bookmark tree node.
 * @return {undefined}
 *
 */
function handleBmarkCreation(id, node) {
    alert("You created a bookmark with id=" + id +
          " title=" + node.title + " url=" + node.url);
}

// Bookmark creation event listener.
chrome.bookmarks.onCreated.addListener(handleBmarkCreation);
