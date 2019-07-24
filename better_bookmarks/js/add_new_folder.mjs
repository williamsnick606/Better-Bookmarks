/*
 * file        : folder_modal.js
 * description : This file contains a function that, when called,
 *               adds all the bookmark folders a user had to the
 *               modal window used for adding new folders.
 *
 */
/**
 * @file This file contains a function that, when called,
 *     adds all the bookmark folders a user had to the
 *     modal window used for adding new folders.
 *
 * @module add_new_folder
 *
 */

import { addFoldersToSelectionMenu } from './utils.mjs'

/**
 * Adds all the user's folders to the modal so
 * one can be selected by the user so they can
 * choose where to place their newly created
 * folder in.
 *
 * @author Brady McGrath
 * @author Kyle Head
 *
 * @return {undefined}
 */
export function addFoldersToModal() {
    // This initializes all the variables we need for the modal.
    const modal      = document.getElementById("folderModal");
    const newFolder  = document.getElementById("newFolder");
    const saveFolder = document.getElementById("saveFolder");
    const span       = document.getElementById("folderSpan");
    const folderMenu = document.getElementById("folderDrop");

    modal.style.display = "block";

    addFoldersToSelectionMenu(folderMenu);

    span.onclick = () => {
        modal.style.display = "none";
    }

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    saveFolder.onclick = () => {
        const folderT         = document.getElementById("newNameF").value;
        const folderSelection = folderMenu.text;
        const ID              = folderMenu.value;
        chrome.bookmarks.create({ "parentId" : ID
                                , "title"    : folderT
                                });
        modal.style.display = "none";
    }
}
