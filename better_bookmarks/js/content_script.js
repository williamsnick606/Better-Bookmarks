/**
 * file        : content_script.js
 * description : This file contains code that grabs, whenever
 *               available, the title, description, and url of
 *               the website that the user has currently visited.
 *
 * NOTE: This file is not currently used.
 *
 */

const title = document.getElementsByTagName("title")[0];
const url   = document.URL;
const metas = document.getElementsByTagName("meta");

let pageDescription;
for (let i = 0; i < metas.length; i++) {
    const meta = metas[i];
    // Some websites don't conform to the norm,
    // thus requiring toLowerCase()
    if (meta.name.toLowerCase() == "description"){
        pageDescription = meta.content;
    }
}

console.log("Got title = " + title + " | " +
            "description = " + pageDescription);

if(!pageDescription){
    pageDescription = "";
}

chrome.storage.sync.set({ title: title.innerText
                        , desc: description
                        , url: url
                        });
{ title       : pageTitle
, description : pageDescription
, url         : pageURL
};
