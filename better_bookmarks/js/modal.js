/**
 * file        : modal.js
 * description : This file contains code for manipulating the modal,
 *               i.e., popup, that displays when a user clicks the
 *               "add bookmark" button in the primary extension popup.
 *
 */
import {predictCategory} from './predictCategory.mjs'

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the button that creates a bookmark
var btn2 = document.getElementById("makeBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// This will be the tabs title for bookmark naming purposes
var usableT;
// This will be the tabs body for folder choosing
var usableU;
// This will be the tabs description
var usableD;

chrome.storage.sync.get(["title", "desc", "url"], function(result) {
    usableT = result.title;
    usableU = result.url;
    usableD = result.desc;
    console.log("Getting title, description, and url " +
                "inside modal...");
    console.log("title = " + result.title + " | " +
                "desc = " + result.desc);
    autofiller(usableT, usableU);
});

// All the modal functionality has to be a callback function from the chrome.tabs.query
function autofiller(usableT, usableU) {
    // When the user clicks the 'Bookmark' button,
    btn.onclick = function() {
        // Display the modal
        modal.style.display = "block";
        // Autofill the site Title as the bookmark name
        document.getElementById("newName").value = usableT;
    }
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }
    var bookURL = document.getElementById("newName");
    // When a user clicks the Create button, save a new bookmark
    btn2.onclick = function() {
        chrome.bookmarks.create({'parentId': null,
                                 'title':    usableT,
                                 'url':      usableU
                                });
    }
}