chrome.contextMenus.removeAll();
chrome.contextMenus.create({
    id: "first-id",
    title: "first",
    contexts: ["browser_action"]
});
chrome.contextMenus.onClicked.addListener(function(info, tab) {
    alert('first');
});
