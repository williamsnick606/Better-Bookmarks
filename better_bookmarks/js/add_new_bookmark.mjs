/**
 * @file This file contains code for manipulating the modal,
 *     i.e., popup, that displays when a user clicks the
 *     "add bookmark" button in the primary extension popup.
 *
 */

import {predictCategory, preprocess} from './predictCategory.mjs'

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
                    modal, span, save) {
    console.log("Entering autofiller in add_new_bookmark.js...");
    // When the user clicks the 'Bookmark' button,
    // Display the modal

    if(category == 0) {
        document.getElementById("bmarkDrop").value = art;
    } else if (category == 1) {
        document.getElementById("bmarkDrop").value = business;
    } else if (category == 2) {
        document.getElementById("bmarkDrop").value = health;
    } else if (category == 3) {
        document.getElementById("bmarkDrop").value = society;
    } else if (category == 4) {
        document.getElementById("bmarkDrop").value = sports;
    }

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
    save.onclick = function() {
        var bookT = document.getElementById("newName").value;
        var ID = document.getElementById("bmarkDrop").value;
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
        const modal  = document.getElementById("bmarkModal");
        const save   = document.getElementById("saveBmark");
        const span   = document.getElementById("bmarkSpan");
        const select = document.getElementById("bmarkDrop");

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


        // Get the current tab's ID, title, and URL.
        // After getting that information, call
        // executeScript to get the description if
        // available.
        chrome.tabs.getSelected(null, (tab) => {
            const tabId   = tab.id;
            const usableT = tab.title;
            const usableU = tab.url;
            let   usableD;
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
                    predictCategory(usableT, usableD).then(function(t) {
                        var finalCategory = t;
                        autofiller(usableT, usableU, finalCategory, modal, span, save);
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