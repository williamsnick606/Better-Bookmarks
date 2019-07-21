/*
 * File        : bmarkModal.js
 * Description : This file contains code for manipulating the modal,
 *               i.e., popup, that displays when a user clicks the
 *               "new bookmark" button in the primary extension popup.
 */

import {predictCategory} from './predictCategory.mjs'

// This initializes all the variables we need for the modal.
var modal    = document.getElementById("bmarkModal");
var newBook  = document.getElementById("newBmark");
var saveBook = document.getElementById("saveBmark");
var span     = document.getElementById("bmarkSpan");
var select   = document.getElementById('bmarkDrop');

/* The only way to add a bookmark to a certain folder is by knowing
 * the bookmarkID of the folder you want it added to. These variables
 * will keep track of the bookmarkID's of the folders our ML function
 * can recommend.
 */
var art, business, health, society, sports;

/*
 * Description: This function goes through the user's bookmark tree, adding
 *              their folders as options to our folder dropdown, so that they
 *              can save a bookmark to any bookmark folder they want.
 * Inputs:      "id" == a number corresponding to the bookmarkID of the node
 *              whose children you want added to the dropdown list.
 * Output:      None.
 */
grabFolders('0');
function grabFolders(id) {
    chrome.bookmarks.getChildren(id, function(children) {
        children.forEach(function(bookmark) { 
            if(bookmark.url == null){
                var option = document.createElement('option');
                option.value = bookmark.id;
                option.text = bookmark.title;
                if(option.text == "Art") {
                    art = option.value;
                } else if(option.text == "Business") {
                    business = option.value;
                } else if(option.text == "Health") {
                    health = option.value;
                } else if(option.text == "Society") {
                    society = option.value;
                } else if(option.text == "Sports") {
                    sports = option.value;
                }
                select.appendChild(option);
            }
            grabFolders(bookmark.id);
        });
    });
}

/* These variables will hold the Title, URL, and Description of the 
 * web page being bookmarked. The last two variables are used to 
 * choose which Category will be chosen by the ML function and shown
 * as the preset value in the folder dropdown when creating a bookmark.
 */
var usableT;
var usableU;
var usableD;
var o = ["art", "business", "health", "society", "sports"];
var prediction;

/*
 * Description: This function grabs the current page's info from Chrome's
 *              storage API, where a different function had sent it.
 * Inputs:      "title" grabs the title from storage.
 *              "url" grabs the url.
 *              "desc" grabs the description.
 * Outputs:     "UsableT", the title. Can be passed to a callback.
 *              "UsableU", the url. Can be passed to the callback.
 */
chrome.storage.sync.get(["title", "url", "desc"], function(result) {
    usableT = result.title;
    usableU = result.url;
    usableD = result.desc;
    console.log("Getting title, description, and url " +
                "inside modal...");
    console.log("title = " + result.title + " | " +
                "desc  = " + result.desc);
    predictCategory(usableT, usableD).then(function(p){
        autofiller(usableT, usableU, prediction);
    })
});

// I'm keeping my data grabbing function here until Roberts is able to update itself
// automatically instead of on a page refresh
/*
//Get access to
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var tab = tabs[0];
    var title = tab.title;
    var url = tab.url;
    usableT = title;
    usableU = url;
    //usableB = body;
    autofiller(usableT, usableU);
})
*/

/*
 * Description: This function is responsible for saving a new bookmark
 *              with all of the corect information. Basically it makes
 *              sure that the modal's fields show the right presets,
 *              and stores the correct information as a bookmark.
 * Inputs:      "usableT" is the title of the current page.
 *              "usableU" is the URL of the current page.
 *              "prediction" is the category that the ML function
 *              decided was the best fir for this page.
 * Outputs:     None.
 */
function autofiller(usableT, usableU, prediction) {
    document.getElementById("newName").value = usableT;

    if(prediction == 'art') {
        document.getElementById("folderDrop").value = art;
    } else if (prediction == 'business') {
        document.getElementById("folderDrop").value = business;
    } else if (prediction == 'health') {
        document.getElementById("folderDrop").value = health;
    } else if (prediction == 'society') {
        document.getElementById("folderDrop").value = society;
    } else if (prediction == 'sports') {
        document.getElementById("folderDrop").value = sports;
    }

    newBook.onclick = function() {
        modal.style.display = "block";
    }

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    saveBook.onclick = function() {
        var bookT = document.getElementById("newName").value;
        var selection = document.getElementById("bmarkDrop").text;
        var ID = document.getElementById("bmarkDrop").value;
        chrome.bookmarks.create({'parentId': ID,
                                 'title':    bookT,
                                 'url':      usableU
        });
    }
}