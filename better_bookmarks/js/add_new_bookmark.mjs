/**
 * @file This file contains code for manipulating the modal,
 *     i.e., popup, that displays when a user clicks the
 *     "add bookmark" button in the primary extension popup.
 *
 */

import {predictCategory, preprocess} from './predictCategory.mjs'

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
function autofiller(title, url,
                    modal, span,
                    btn2) {
    console.log("Entering autofiller in add_new_bookmark.js...");
    // When the user clicks the 'Bookmark' button,
    // Display the modal
    modal.style.display = "block";
    // Autofill the site Title as the bookmark name
    document.getElementById("newName").value = title;
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
    const bookURL = document.getElementById("newName");
    // When a user clicks the Create button, save a new bookmark
    btn2.onclick = function() {
        chrome.bookmarks.create({ "parentId" : null
                                , "title"    : title
                                , "url"      : url
                                });
    }
}

/**
 * Displays the modal when the "add bookmark"
 * button is clicked and presents the user with
 * a title (defaults to page title) and folder
 * (defaults to the one recommended by predictCategory).
 *
 * @return {undefined}
 *
 */
export function addBookmark(btn) {
    return ( () => {
        // Get the modal
        const modal = document.getElementById("myModal");

        // Get the button that creates a bookmark
        const btn2  = document.getElementById("makeBtn");

        // Get the <span> element that closes the modal
        const span  = document.getElementsByClassName("close")[0];

        /* 
        * Since executeScript doesn't seem to like when
        * I set the file property with content equivalent
        * to what follows below, we have to resort to the
        * below solution until we figure out how to use a
        * file with the exact same content, or an even better
        * solution that doesn't require the use of executeScript.
        */
        const codeToExecute =
            //"const pageTitle = document.getElementsByTagName(\"title\")[0].innerText;\n" +
            //"const pageURL   = document.URL;\n" +
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
            //"const pageData = {title: pageTitle, description: pageDescription, url: pageURL};\n" +
            //"pageData;";
            //"alert(\"desc = \" + pageDescription);\n" +
            "pageDescription";


        //chrome.tabs.reload();

        chrome.tabs.getSelected(null, (tab) => {
            const tabId   = tab.id;
            const usableT = tab.title;
            const usableU = tab.url;
            let usableD;
            //alert("codeToExecute =\n" + codeToExecute);
            // Collect the relevant page information for the
            // tab that "add bookmark" was clicked on.
            chrome.tabs.executeScript(tabId, { code  : codeToExecute
                                             , runAt : "document_start"
                                             }, (results) => {
                try {
                    const result = results[0];
                    //let usableD  = result.description;
                    let usableD  = result;


                    console.log("title = " + usableT + "\n" +
                                "url = " + usableU + "\n" +
                                "description = " + usableD);

                    let obj = {};
                    const key = "_" + tabId;
                    obj[key] = usableD;
                    console.log("obj." + key + " = " + obj[key]);

                    if (usableD) {
                        chrome.storage.sync.set(obj);
                    }

                    else {
                        chrome.storage.sync.get([key], (getResult) => {
                            console.log("description was null in " +
                                        "executeScript in " +
                                        "add_new_bookmark.js...");
                            console.log("getResult[" + key + "]: " +
                                        getResult[key]);
                        });
                    }
                    autofiller(usableT, usableU, modal, span, btn2);
                }
                catch(err) {
                    console.log("Caught error in executeScript callback " +
                                "in file modal.js.");
                    console.log("Error: " + err);
                }
            });
        });
    // Close out the arrow function being returned.
    });
// Close out addBookmark function
}
