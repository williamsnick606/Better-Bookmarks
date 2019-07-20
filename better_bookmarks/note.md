# Temporary Fix for Bookmarking With Multiple Tabs Open

In order to allow the user to open a tab, open another
new tab, switch back to the first tab, and then bookmark
the first tab, I can just have to content script log the
tab id.  Using the tab id, the code for adding a bookmark—
in modal.js—can run:

    ```javascript
    let pageTitle, pageDescription, pageURL;
    chrome.storage.sync.get([tabId], (result) => {
        const pageObj   = result[tabId];
        pageTitle       = pageObj.title;
        pageDescription = pageObj.description;
        pageURL         = pageObj.URL;
    });
    ```

Using the above method, while not the most efficient in
terms of memory usage—the content script will do this for
every single page the user visits, and it is likely that
hardly any of the visited pages will be bookmarked—, should
get the job done.  At the very least, this method will provide
us with a temporary solution until we can figure out and
implement a more optimal solution.
