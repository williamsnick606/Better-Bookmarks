function getTitleUrlDesc(){
    var code = 'var meta = document.querySelector("meta[name=\'Description\']") || document.querySelector("meta[name=\'description\']");' + 
               'if (meta) meta = meta.getAttribute("content");' +
               '({' +
               '    title: document.title,' +
               '    url: document.URL,' +
               '    description: meta || ""' +
               '});';
    chrome.tabs.executeScript({
        code: code
    }, function(results) {
        if (!results) {
            // An error occurred at executing the script. You've probably not got
            // the permission to execute a content script for the current tab
            return;
        }
        var result = results[0];
        alert("Title: " + result.title + "\nURL: " + result.url + "\nDescription: " + result.description);
    });
}
getTitleUrlDesc();