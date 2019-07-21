/**
 * file        : modal.js
 * description : This file contains code for manipulating the modal,
 *               i.e., popup, that displays when a user clicks the
 *               "add bookmark" button in the primary extension popup.
 *
 */
/**
 * @file This file contains code for manipulating the modal,
 *     i.e., popup, that displays when a user clicks the
 *     "add bookmark" button in the primary extension popup.
 *
 */
import {predictCategory} from './predictCategory.mjs'
import {preprocess} from './predictCategory.mjs'

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the button that creates a bookmark
var btn2 = document.getElementById("makeBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

/* 
 * Since executeScript doesn't seem to like when
 * I set the file property with content equivalent
 * to what follows below, we have to resort to the
 * below solution until we figure out how to use a
 * file with the exact same content, or an even better
 * solution that doesn't require the use of executeScript.
 */
const codeToExecute =
    "const pageTitle = document.getElementsByTagName(\"title\")[0].innerText;\n" +
    "const pageURL   = document.URL;\n" +
    "const metas     = document.getElementsByTagName('meta');\n" +
    "let pageDescription;\n" +
    "for (let i = 0; i < metas.length; i++) {\n" +
    "    const meta = metas[i];\n" +
        // Some websites don't conform to the norm,
        // thus requiring toLowerCase().
    "    if (meta.name.toLowerCase() === 'description'){\n" +
    "        pageDescription = meta.content;\n" +
    "    }\n" +
    "}\n" +
    "const pageData = {title: pageTitle, description: pageDescription, url: pageURL};\n" +
    "pageData;";

// Collect the relevant page information for the
// tab that "add bookmark" was clicked on.
chrome.tabs.executeScript({ code  : codeToExecute
                          , runAt : "document_end"
                          }, (results) => {
    // This will be the tabs title for bookmark naming purposes
    let usableT;
    // This will be the tabs body for folder choosing
    let usableU;
    // This will be the tabs description
    let usableD;
    const result = results[0];
    usableT      = result.title;
    usableU      = result.url;
    usableD      = result.description;
    console.log("title = " + usableT + "\n" +
                "url = " + usableU + "\n" +
                "description = " + usableD);
    // Fill the title and URL fields that the
    // user sees.
    autofiller(usableT, usableU);
});

/**
 *  Creates a new bookmark given a bookmark title
 *  and url.
 *
 *  @param {string} title - The title of the page being
 *      bookmarked.
 *  @param {string} url - The url of the page being
 *      bookmarked.
 *  @return {undefined}
 *
 */
function autofiller(title, url) {
    console.log("Entering autofiller in modal.js...");
    // When the user clicks the 'Bookmark' button,
    btn.onclick = function() {
        // Display the modal
        modal.style.display = "block";
        // Autofill the site Title as the bookmark name
        document.getElementById("newName").value = title;
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
                                 'title':    title,
                                 'url':      url
                                });
    }
}