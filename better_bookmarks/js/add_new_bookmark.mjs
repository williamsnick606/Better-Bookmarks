/**
 * @file This file contains code for manipulating the modal,
 *     i.e., popup, that displays when a user clicks the
 *     "add bookmark" button in the primary extension popup.
 *
 */

import { predictCategory, preprocess } from './predictCategory.mjs'
import { addFoldersToSelectionMenu   } from './utils.mjs'

/* The only way to add a bookmark to a certain folder is by knowing
 * the bookmarkID of the folder you want it added to. These variables
 * will keep track of the bookmarkID's of the folders our ML function
 * can recommend.
 */
var art, business, health, society, sports;

/**
*  Creates a new bookmark given a bookmark title
*  and url.
*
*  @author Brady McGrath
*  @author Kyle Head
*
*  @param {string} title - The title of the page being
*      bookmarked.
*  @param {string} url - The url of the page being
*      bookmarked.
*  @return {undefined}
*
*/
function autofiller(title, url, category,
                    modal, closeBtn, saveBtn) {
    console.log("Entering autofiller in add_new_bookmark.js...");

    switch (category) {
        case 0:
            document.getElementById("bmarkDrop")
                    .value = art;
            break;
        case 1:
            document.getElementById("bmarkDrop")
                    .value = business;
            break;
        case 2:
            document.getElementById("bmarkDrop")
                    .value = health;
            break;
        case 3:
            document.getElementById("bmarkDrop")
                    .value = society;
            break;
        case 4:
            document.getElementById("bmarkDrop")
                    .value = sports;
            break;
        default:
            throw "Error (add_new_bookmark.js): Unknown category \"" +
                  category + "\" " + "encountered.";
    }

    // Display the modal.
    modal.style.display = "block";
    // Autofill the site Title as the bookmark name
    document.getElementById("newName")
            .value = title;
    // When the user clicks on <span> (x), close the modal
    closeBtn.onclick = () => {
        modal.style.display = "none";
    }
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }

    const bookURL = document.getElementById("newName");
    // When a user clicks the Create button, save a new bookmark
    saveBtn.onclick = () => {
        const bookT = document.getElementById("newName").value;
        const ID    = document.getElementById("bmarkDrop").value;
        chrome.bookmarks.create({ "parentId" : ID
                                , "title"    : bookT
                                , "url"      : url
                                });
        modal.style.display = "none";
    }
}

/**
 * Displays the modal when the "add bookmark"
 * button is clicked and presents the user with
 * a title (defaults to page title) and folder
 * (defaults to the one recommended by predictCategory).
 *
 * @author Brady McGrath
 * @author Kyle Head
 *
 * @param {Object} btn - the "add bookmark" button object.
 * @return {undefined}
 *
 */
export function addBookmark(btn) {
    return ( () => {
        // All of the buttons/fields in the modal
        const modal          = document.getElementById("bmarkModal");
        const saveBmarkBtn   = document.getElementById("saveBmark");
        const closeSpanBtn   = document.getElementById("bmarkSpan");
        const selectMenu     = document.getElementById("bmarkDrop");
        
        addFoldersToSelectionMenu(selectMenu);

        /* 
        * Since executeScript doesn't seem to like when
        * I set the file property with content equivalent
        * to what follows below, we have to resort to the
        * below solution until we figure out how to use a
        * file with the exact same content, or an even better
        * solution that doesn't require the use of executeScript.
        *
        * NOTE: Chrome doesn't allow the injection of scripts
        *       for any chrome://* URLs, nor does it allow
        *       injection in the default chrome new tab page,
        *       i.e., your homepage.
        */
        const codeToExecute =
            "const metas = document.getElementsByTagName('meta');\n" +
            "let pageDescription;\n" +
            "for (let i = 0; i < metas.length; i++) {\n" +
            "    const meta = metas[i];\n" +
                // Some websites don't conform to the norm,
                // thus requiring toLowerCase().
            "    if (meta.name.toLowerCase() === \"description\"){\n" +
            "        pageDescription = meta.content;\n" +
            "    }\n" +
            "}\n" +
            "pageDescription";

        // Get the current tab's ID, title, and URL.
        // After getting that information, call
        // executeScript to get the description if
        // available.
        chrome.tabs.getSelected(null, (tab) => {
            const tabId   = tab.id;
            const usableT = tab.title;
            const usableU = tab.url;
            let   usableD;

            if (usableU.search("chrome://") !== -1) {
                alert("Bookmarking URLs of the form, \"chrome://*\" " +
                      "is not allowed.");
                return;
            }

            // Get the description for the page being
            // bookmarked.
            chrome.tabs.executeScript(tabId, { code  : codeToExecute
                                             , runAt : "document_start"
                                             }, (results) => {
                try {
                    // Should be the description of the page.
                    const result = results[0];
                    let usableD  = result;

                    console.log("title = " + usableT + "\n" +
                                "url = " + usableU + "\n" +
                                "description = " + usableD);

                    // Get ready to store the description for the
                    // unique tab id being bookmarked.
                    let obj   = {};
                    const key = "_" + tabId;
                    obj[key]  = usableD;

                    console.log("obj." + key + " = " + obj[key]);

                    // The description wasn't null, so it exists
                    // and this is the first time we've injected
                    // the code in our executeScript(...) call.
                    if (usableD) {
                        chrome.storage.sync.set(obj);
                    }
                    // Description was null, so either it doesn't
                    // exist for the given page, or we've already
                    // gotten it and it's in storage.
                    else {
                        chrome.storage.sync.get([key], (result) => {
                            usableD = result[key];

                            console.log("description was null in " +
                                        "executeScript in " +
                                        "add_new_bookmark.js...");
                            console.log("result[" + key + "]: " +
                                        usableD);
                        });
                    }
                    predictCategory(usableT, usableD).then((t) => {
                        const finalCategory = t;
                        autofiller(usableT, usableU,
                                   finalCategory, modal,
                                   closeSpanBtn, saveBmarkBtn);
                    });
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
