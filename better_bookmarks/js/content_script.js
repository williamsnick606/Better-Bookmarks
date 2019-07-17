var port = chrome.runtime.connect();

window.addEventListener("message", (event) => {
    if (event.source != window)
        return;

    if (event.data.type && (event.data.type == "FROM_PAGE")) {
        console.log("Content script received: " + event.data.text);
        port.postMessage(event.data.text);
    }
}, false);

const title = document.getElementsByTagName("title")[0];
const metas = document.getElementsByTagName("meta");
const url = document.URL;
for (let i = 0; i < metas.length; i++) {
    const meta = metas[i];
    if (meta.name.toLowerCase() == "description"){
        var description = meta.content;
    }
}
if(description === undefined){
    chrome.storage.sync.set({title: title.innerHTML, desc: "", url: url}, function () {});
}
else{
    chrome.storage.sync.set({title: title.innerHTML, desc: description, url: url}, function () {});
}

