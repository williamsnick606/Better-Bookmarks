README for the better_bookmarks extension
-to load this extension, go to the extensions page in chrome, turn on developer mode, 
 and click "load unpacked" then select the folder this readme in in, "better_bookmarks"

CONTENTS:

bb_model:
	-shards, idk what those are

	-model.json, I presume this is the final ML model o;ur prediction function uses

bb_model_strong:
	-similar to the previous file

css:
	-modal.css, contains all of the HTML styling for the modals that pop up when a user
	 clicks "new bookmark" or "add folder"

	-popup.css, contains all of the styling for the main extension window

js:
	-add_content.mjs, small file that contains the function for adding all of the user's
	 bookmarks and folders to the dropdown part of the main extension

	-background.js, contains background listeners for functions that need to be functional
	 even when the popup isn't clicked.

	-bmarkModal.js, formerly modal.js until recently when I made a new modal. This file
	 handles all of the functionality for when a user clicks the "New Bookmark" button
	 in our extension. It is the place where the page info is parsed and passed to the 
	 predictor, the place that autofills the "new bookmark" form, and the place that 
	 saves the bookmark when the user clicks "create". 

	-bookmark_listener.js, this file creates an alert popup when a bookmark is made that
	 lists the date fields of the bookmark that was just created. Useful when developing,
	 but we should definitely remove this file for our final product

	-content_script.js, this is Robert's file that grabs page data. Hopefully he is able to
	 get this function auto-updating on scheduled intervals, because as it stands, the data
	 isn't refreshed when you click to a different tab.

	-folderModal.js, this file is super similar to bmarkModal.js as it handles the
	 functionality for creating new folders. It's way smaller because fortunately, we dont'
	 have to do any sort of predictions here.

	-handle_search.js, this file wil eventually(?) contain the functionality for searching
	 through the bookmarks dropdown in our GUI. Right now it is but a stub.

	-options.js, this was like V1 of our ideas for creating a new bookmark popup. It is
	 outdated and should be deleted from the final project.

	-predictCategory.mjs, this one is pretty self explanatory. Contains the library and
	predict funtion that we need to accurately predict categories.

	-tf.min.js, this file i guess is an impoort of the tensorflow library?

	-utils.mjs, this file contains all of the functions Brady uses to display bookmarks and
	 folders in the extension GUI, make folders toggle-able, link to websites, et cetera.

	-validate.mjs, i think this file will also be used to help display search results in 
	 the extension GUI.

views:
	-options.html, like the other 'options' files, is outdated and can be scrapped.

	-popup.html, contains all of the HTML for our popup and modals and imports the JS/MJS 
	scripts and CSS stylesheets.

-BBlogo.png is the picture that sits at the top of the extension.

-icon.png is the star shaped extension icon.

-manifest.json is like main() but for our extension. Lists the version, permissions, scripts,
 etc.