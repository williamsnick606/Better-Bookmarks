const title = document.getElementsByTagName("title")[0];
const metas = document.getElementsByTagName("meta");
const url = document.URL;
var description;
for (let i = 0; i < metas.length; i++) {
    const meta = metas[i];
    if (meta.name.toLowerCase() == "description"){
        description = meta.content;
    }
}
if(description === undefined){
    chrome.storage.sync.set({title: title.innerHTML, desc: "", url: url}, function () {});
}
else{
    chrome.storage.sync.set({title: title.innerHTML, desc: description, url: url}, function () {});
}

