// background.js
var url = [];
// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
  // Send a message to the active tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    for(var i =0; i < tabs.length; i++){
      url.push(tabs[i].url);
    }
    chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
  });
});


//Open up new tab with firstHref taken from content.js then prompts user for doge related fun stuff

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "open_new_tab" ) {
      chrome.tabs.create({"url": 'http://reddit.com'});
      alert(url)
      
    }
  }
);

url = [];