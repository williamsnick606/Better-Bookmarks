# Temporary Fix for Bookmarking With Multiple Tabs Open

In order to get the correct/expected behavior when
a user either:

- opens a new tab, opens another new tab, switches back to
the first tab and bookmarks that page; or
- opens the extension, clicks to add a bookmark, closes the
extenson, reopens the extension, followed by bookmarking the page;

we associate, with each unique tab ID, the first non-null description
that we encounter and store it using the Chrome storage API.

Script injection, and therefore storing the first valid description
received, only happens when the user clicks the button to create a
new bookmark.  Therefore, this is currently the most optimal solution.
From what I gathered during my research, any other optimal solution to
the problem that our current technique solves would likely vary only
marginally.

    ```javascript
    let pageTitle, pageDescription, pageURL;
    chrome.storage.sync.get([tabId], (result) => {
        const pageObj   = result[tabId];
        pageTitle       = pageObj.title;
        pageDescription = pageObj.description;
        pageURL         = pageObj.URL;
    });
    ```
