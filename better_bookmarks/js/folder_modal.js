/*
 * file        : folder_modal.js
 * description : This file contains code that launches and populates
 *               the modal window for adding new bookmark folders.
 *
 */
import {addFoldersToModal} from './add_new_folder.mjs'

// Get the "add bookmark" button that opens the modal
const addBmarkbtn = document.getElementById("addNewBookmarkFolderBtn");
addBmarkbtn.addEventListener("click", addFoldersToModal);
