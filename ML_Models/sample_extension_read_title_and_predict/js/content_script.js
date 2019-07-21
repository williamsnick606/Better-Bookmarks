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
