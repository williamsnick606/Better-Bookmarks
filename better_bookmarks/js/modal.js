/**
 * file        : modal.js
 * description : This file contains code for manipulating the modal,
 *               i.e., popup, that displays when a user clicks the
 *               "add bookmark" button in the primary extension popup.
 *
 */
import {addBookmark} from './add_new_bookmark.mjs'

// Get the "add bookmark" button that opens the modal
const addBmarkbtn = document.getElementById("addBookmarkBtn");
addBmarkbtn.addEventListener("click", addBookmark(addBmarkbtn));