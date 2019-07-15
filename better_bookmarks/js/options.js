document.querySelector("#addBtn").addEventListener("click", () => {
    if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
    }
    else {
        window.open(chrome.runtime.getURL("options.html"));
    }
});