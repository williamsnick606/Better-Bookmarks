const title = document.getElementsByTagName("title")[0];
const metas = document.getElementsByTagName("meta");
const url = document.URL;
<<<<<<< HEAD
var description = undefined;
=======
var description;
>>>>>>> 7956320f75931d32b948ac49708c833c2fc07849
for (let i = 0; i < metas.length; i++) {
    const meta = metas[i];
    // Some websites don't conform to the norm, thus requiring toLowerCase()
    if (meta.name.toLowerCase() == "description"){
        description = meta.content;
    }
}
if(description === undefined){
    chrome.storage.sync.set({title: title.innerText, desc: "", url: url}, function () {});
}
else{
    chrome.storage.sync.set({title: title.innerText, desc: description, url: url}, function () {});
<<<<<<< HEAD
}
=======
}

>>>>>>> 7956320f75931d32b948ac49708c833c2fc07849