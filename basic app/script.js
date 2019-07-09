window.addEventListener('load', function load(event) {
    document.getElementById('send').onclick = function() {
        chrome.bookmarks.getTree(function(itemTree){
            itemTree.forEach(function(item){
                processNode(item);
            });
        });
    };
});

function processNode(node) {
    if(node.children) {
        node.children.forEach(function(child) { processNode(child); });
    }
    if(node.url) {
        document.write(node.url+"\n");
        
    }
}