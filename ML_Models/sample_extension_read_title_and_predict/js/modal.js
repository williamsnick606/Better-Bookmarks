/*
 * file        : modal.js
 * description : This file contains code for manipulating the modal,
 *               i.e., popup, that displays when a user clicks the
 *               "add bookmark" button in the primary extension popup.
 *
 */
import {predictCategory} from './predictCategory.mjs'

// Make variable's for the modal and all of its buttons
var modal    = document.getElementById("myModal");
var newBook  = document.getElementById("newBook");
var saveBook = document.getElementById("saveBook");
var span     = document.getElementsByClassName("close")[0];
var select   = document.getElementById('folderDrop');
// These will help keep track of the folder ID's of the folders added
// by the extensioon so the ML predictor knows which folder to 
//use as a recommendation
var art, business, health, society, sports;
// This adds all bookmark folders as options in the modal's folder
// selection dropdown. '0' means it starts @ the root node
grabFolders('0');
function grabFolders(id) {
    // Gets each bookmark item by id
    chrome.bookmarks.getChildren(id, function(children) {
        children.forEach(function(bookmark) { 
            // If the url is null (it's a folder)
            if(bookmark.url == null){
                // Create an option to add to our dropdown
                var option = document.createElement('option');
                // Copy the info over from folder to the new option
                option.value = bookmark.id;
                option.text = bookmark.title;
                // When we run into a predictable folder, make note
                // of the folder's ID
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
                // Add the option to the dropdown
                select.appendChild(option);
            }
            // Recursive call on the folder's children
            grabFolders(bookmark.id);
        });
    });
}

// This will be the tabs Title for bookmark naming purposes
var usableT;
var usableU;
var usableD;
var o = ["art", "business", "health", "society", "sports"];
var prediction;


chrome.storage.sync.get(["title", "url", "desc"], function(result) {
    usableT = result.title;
    usableU = result.url;
    usableD = result.desc;
    console.log("Getting title, description, and url " +
                "inside modal...");
    console.log("title = " + result.title + " | " +
                "desc  = " + result.desc);
    predictCategory(usableT, usableD).then(function(p) {
        prediction = o[p];
    });
    autofiller(usableT, usableU);
});

// I'm keeping my data grabbing function here until Roberts is able to update itself
// automatically instead of on a page refresh
/*
//Get access to
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var tab = tabs[0];
    var title = tab.title;
    var url = tab.url;
    //var body = tab.title;   // document.queryselector('body').innertext
    usableT = title;
    usableU = url;
    //usableB = body;
    autofiller(usableT, usableU);
})
*/

// All the modal functionality has to be a callback function from the chrome.tabs.query
function autofiller(usableT, usableU, prediction) {

    // Autofill the site Title as the bookmark name
    document.getElementById("newName").value = usableT;

    // Autofill the category prediction as the folder preset
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

    // When the user clicks the 'Bookmark' button,
    newBook.onclick = function() {
        // Display the modal
        modal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // When a user clicks the Create button
    saveBook.onclick = function() {
        // Grab the current bookmark name
        var bookT = document.getElementById("newName").value;
        // Grab the current bookmark folder
        var selection = document.getElementById("folderDrop").text;
        var ID = document.getElementById("folderDrop").value;
        // Save the bookmark
        chrome.bookmarks.create({'parentId': ID,
                                 'title':    bookT,
                                 'url':      usableU
        });
    }
}