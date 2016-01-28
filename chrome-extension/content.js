// content.js


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
      var firstHref = $("a[href^='http']").eq(0).attr("href");

      console.log("this is working");


      //passing url back to background.js to open a new tab with firstHref
      chrome.runtime.sendMessage({"message": "open_new_tab", "url": firstHref});
    }
  }
);

