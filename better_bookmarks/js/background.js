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


/*
 * This shit is supposed to check to see if the necessary folders exist before
 * adding them to your bookmarks on startup. Nothing i have tried works, though, 
 * so Im commenting it out. Take a look if you feel like it
 *
// Will keep track of which folders aleady exist
var checkArt, checkBus, checkHealth, checkSoc, checkSports, option;
checkArt = 0;
checkBus = 0
checkHealth = 0;
checkSoc = 0;
checkSports = 0;

//What happens when the extension is installed?
chrome.runtime.onInstalled.addListener(function(details){
    // Call grabFolders to see which categories don't exist yet
    grabFolders('1');
    function grabFolders(id) {
        // Gets each bookmark item by id
        chrome.bookmarks.getChildren(id, function(children) {
            children.forEach(function(bookmark) { 
                // If the url is null (it's a folder)
                var checker = bookmark.url;
                if(checker == null) {
                    option = bookmark.title;
                    // Copy the info over from folder to the new option
                    // When we run into a predictable folder, make note that
                    // we don't have to install it on startup
                    if(option == 'Art') {
                        checkArt = 1;
                    } else if(option == 'Business') {
                        checkBus = 1;
                    } else if(option == 'Health') {
                        checkHealth = 1;
                    } else if(option == 'Society') {
                        checkSoc = 1;
                    } else if(option == 'Sports') {
                        checkSports = 1;
                    }
                }
            // Recursive call on the folder's children
            grabFolders(bookmark.id);
            });
        });
    }
    // Create the necessary folders after confirming they don't exist yet
    if(checkArt == 0){
        chrome.bookmarks.create({parentId: '1',
                             'title':   'Art'});
    }
    if(checkBus == 0){
        chrome.bookmarks.create({parentId: '1',
                             'title':   'Business'});
    }
    if(checkHealth == 0){
        chrome.bookmarks.create({parentId: '1',
                             'title':   'Health'});
    }
    if(checkSoc == 0){
        chrome.bookmarks.create({parentId: '1',
                             'title':   'Society'});
    }
    if(checkSports == 0){
        chrome.bookmarks.create({parentId: '1',
                             'title':   'Sports'});
    }
});

*/