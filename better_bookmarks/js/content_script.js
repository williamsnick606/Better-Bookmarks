/**
 * file        : content_script.js
 * description : This file contains code that grabs, whenever
 *               available, the title, description, and url of
 *               the website that the user has currently visited.
 *
 * NOTE: When a user opens a tab, opens another tab, and then
 *       switches back to the first tab, the page information
 *       for the first tab is lost.
 *
 *       A non-optimal temporary solution to this, is saving
 *       each tab id and associating the page data with the
 *       corresponding tab id.  For example,
 *
 *           chrome.storage.sync.set({ _tabId: { title: pageTitle
 *                                               ...
 *                                             }
 *                                   });
 *
 *       Then in modal.js, we would run:
 *
 *           
 *           let currentTabId;
 *           chrome.tabs.query({ active: true, currentWindow: true},
 *                             (tabs) => {
 *               let currentTab = tabs[0];
 *               currentTabId   = currentTab.id;
 *           });
 *           let pageTitle;
 *           let pageURL;
 *           ...
 *           chrome.storage.sync.get(["_" + currentTabId],
 *                                   (result) => {
 *               pageTitle = result.title
 *               pageURL   = result.url
 *               ...
 *           });
 *           ...
 *
 */
const title = document.getElementsByTagName("title")[0];
const metas = document.getElementsByTagName("meta");
const url = document.URL;
var description;
for (let i = 0; i < metas.length; i++) {
    const meta = metas[i];
    // Some websites don't conform to the norm, thus requiring toLowerCase()
    if (meta.name.toLowerCase() == "description"){
        description = meta.content;
    }
}
console.log("Got title = " + title + " | " +
            "description = " + description);
if(!description){
    description = "";
}
chrome.storage.sync.set({ title: title.innerText
                        , desc: description
                        , url: url
                        });
