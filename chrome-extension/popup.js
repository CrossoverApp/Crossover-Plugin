// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */

 /**
function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });

  // Most methods of the Chrome extension APIs are asynchronous. This means that
  // you CANNOT do something like this:
  //
  // var url;
  // chrome.tabs.query(queryInfo, function(tabs) {
  //   url = tabs[0].url;
  // });
  // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}

/**
 * @param {string} searchTerm - Search term for Google Image search.
 * @param {function(string,number,number)} callback - Called when an image has
 *   been found. The callback gets the URL, width and height of the image.
 * @param {function(string)} errorCallback - Called when the image is not found.
 *   The callback gets a string that describes the failure reason.
 */

 /**
function getImageUrl(searchTerm, callback, errorCallback) {
  // Google image search - 100 searches per day.
  // https://developers.google.com/image-search/
  var searchUrl = 'https://ajax.googleapis.com/ajax/services/search/images' +
    '?v=1.0&q=' + encodeURIComponent(searchTerm);
  var x = new XMLHttpRequest();
  x.open('GET', searchUrl);
  // The Google image search API responds with JSON, so let Chrome parse it.
  x.responseType = 'json';
  x.onload = function() {
    // Parse and process the response from Google Image Search.
    var response = x.response;
    if (!response || !response.responseData || !response.responseData.results ||
        response.responseData.results.length === 0) {
      errorCallback('No response from Google Image search!');
      return;
    }
    var firstResult = response.responseData.results[0];
    // Take the thumbnail instead of the full image to get an approximately
    // consistent image size.
    var imageUrl = firstResult.tbUrl;
    var width = parseInt(firstResult.tbWidth);
    var height = parseInt(firstResult.tbHeight);
    console.assert(
        typeof imageUrl == 'string' && !isNaN(width) && !isNaN(height),
        'Unexpected respose from the Google Image Search API!');
    callback(imageUrl, width, height);
  };
  x.onerror = function() {
    errorCallback('Network error.');
  };
  x.send();
}

function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(function(url) {
    // Put the image URL in Google search.
    renderStatus('Performing Google Image search for ' + url);

    getImageUrl(url, function(imageUrl, width, height) {

      renderStatus('Search term: ' + url + '\n' +
          'Google image search result: ' + imageUrl);
      var imageResult = document.getElementById('image-result');
      // Explicitly set the width/height to minimize the number of reflows. For
      // a single image, this does not matter, but if you're going to embed
      // multiple external images in your page, then the absence of width/height
      // attributes causes the popup to resize multiple times.
      imageResult.width = width;
      imageResult.height = height;
      imageResult.src = imageUrl;
      imageResult.hidden = false;

    }, function(errorMessage) {
      renderStatus('Cannot display image. ' + errorMessage);
    });
  });
});
**/
var userTabs = ['http://reddit.com', 'http://google.com', 'http://pcpartpicker.com/'];
var userTabs2 = ['https://www.youtube.com/', 'http://gmail.com', 'http://yahoo.com'];
var userTabs3 = ['http://memebase.com', 'http://http://www.w3schools.com/', 'http://slack.com'];

var textTGL = '{"tabGroups":[{"id":"Acji5m8nYc","title":"Group 1"},{"id":"s5s17T89aq","title":"Group 2"},{"id":"asdfjkl;","title":"Group 3"}],"success":true}';
var JsonTGL = JSON.parse(textTGL);

$('#openTab').click( function() {
    //window.open('http://www.google.com','GoogleWindow', 'width=800, height=600');
    for(i=0; i < userTabs.length; i++){
    chrome.tabs.create({"url": userTabs[i]});
  }
});

$('#logIn').click( function() {
  var text = $("#loginStuff").html()
  
   $('#loginInfo').append(text);
   $('#loginInfo').toggle("show");
});

/*function getTabsofGroups(title){ //Change it later to grab actuall tabs of groups from parse
    //var result = ['temp'];
    if(title === "Group 1"){
        return userTabs;
    } else if(title === "Group 2"){
        return userTabs2;
    } else if(title === "Group 3"){
        return userTabs3;
    } else {
        return ['bad'];
    }
}*/

//if ('content' in document.createElement('template')) {
    
//}

function bgcl(string){
    chrome.extension.getBackgroundPage().console.log(string);
}
var bkg = chrome.extension.getBackgroundPage();

document.addEventListener('DOMContentLoaded', function() {
    bkg.console.log("Start");
    //if(){ //doesn't have session token
        loadLogin();
    //}else if(){ //does have session token
        bkg.console.log("Middle");
        loadTabGroups();
        removeLogin();
    //}else{ //error
        //error code here
    //}
    bkg.console.log("End");
});

function loadLogin(){ //loads login textboxes and submit button
    var template = document.querySelector('#tabGroupElement').content.querySelector('#loginInfo');
    var inputDiv = document.querySelector('#tabGroupList');
    
    var clone = document.importNode(template,true);
    inputDiv.appendChild(clone);
    bkg.console.log("I Happened!");
}

function removeLogin(){
    var inputDiv = document.querySelector('#tabGroupList');
    var tBDiv = inputDiv.querySelector('#loginInfo');
    inputDiv.removeChild(tBDiv);
}

var toggle = 0;

function loadTabGroups(){
    var template = document.querySelector('#tabGroupElement').content.querySelector('.listingTGs').cloneNode(true);
    var inputDiv = document.querySelector('#tabGroupList');
    
    //var title = template.querySelector('#titleForPage');
    //title.innerHTML = "List of Tab Groups";
    
    var tGList = JsonTGL.tabGroups;
    for(var i=0; i<tGList.length; i++){
        var gButton = template.querySelector('.tabGroup').cloneNode(true);
        gButton.value = tGList[i].title;
        //gButton.innnerHTML =
        var buttonClone = document.importNode(gButton,true);
        template.appendChild(buttonClone);
        template.innerHTML+= "<br>";
    }
    template.removeChild(template.querySelector('input'));
    var clone = document.importNode(template,true);
    inputDiv.appendChild(clone);
    bkg.console.log(document);
}

function removeTabGroups(){
    var inputDiv = document.querySelector('#tabGroupList');
    //var tGButtons = inputDiv.getElementsByClassName('tabGroup');
    var tGBDiv = inputDiv.querySelector('.listingTGs');
    //bkg.console.log(tGButtons);
    //while(tGButtons[0]){
        bkg.console.log("hi");
    //    tGButtons.parentNode.removeChild(tGButtons[0]);
    //}
    //var j = tGButtons.length;
    //for(var i=0; i < j; i++){
    //    bkg.console.log("maybe");
    //    bkg.console.log(i);
    //    inputDiv.removeChild();
    //    bkg.console.log("bye");
    //}
    inputDiv.removeChild(tGBDiv);
    bkg.console.log("bye");
}

//$('.tabGroup').click( function(event){
    //event.target gets the element
function tabGroupAction(event){
//if ('content' in document.createElement('template')) {
    $('#openTab').toggle("show");
    //if(toggle === 0){
        //toggle = 1;
        //$('#openTab').toggle("show");
        var template = document.querySelector('#tabGroupElement').content.querySelector('.listingTabs').cloneNode(true);
        var buttonDiv = template.querySelector('.tabButtons');
        var inputDiv = document.querySelector('#tabGroupList');
        
        var title = template.querySelector('#titleForTabs');
        title.innerHTML = event.target.value;
        
        var inputTabs;
        if(event.target.value === "Group 1"){
            inputTabs = userTabs;
        } else if(event.target.value === "Group 2"){
            inputTabs = userTabs2;
        } else {
            inputTabs = userTabs3;
        }
        for (i=0; i<inputTabs.length; i++){//tab in userTabs){
            //input.href=userTabs[i];//tab;
            //var title = "chrome.tabs.create({\"url\":"+userTabs[i]+"})";
            var input = template.querySelector(".tab");
            input.value=inputTabs[i];
            input.setAttribute("href",inputTabs[i]);
            //input.setAttribute("id","tab");
            var clone = document.importNode(input,true);
            buttonDiv.appendChild(clone,true);
            buttonDiv.innerHTML += "<br>";
            //var s = document.querySelector('#tabGroupList');
            bkg.console.log(document);
            bkg.console.log(i);
        }
        //chrome.extension.getBackgroundPage().console.log(document);
    /*}else{
        toggle = 0;
        var tabs = document.getElementsByClassName("tab");
        var length = tabs.length;
        for(i=0; i<length; i++){
            //alert(i);
            tabs[0].remove();
        }
    }*/
    bkg.console.log("done");
    buttonDiv.removeChild(buttonDiv.querySelector('.tab'));
    var cloneF = document.importNode(template,true);
    inputDiv.appendChild(cloneF);
    bkg.console.log(document);
    removeTabGroups();
}

function removeTabButttons(){
    var inputDiv = document.querySelector('#tabGroupList');
    var tBDiv = inputDiv.querySelector('.listingTabs');
    inputDiv.removeChild(tBDiv);
}
//});

/*$('#viewGroups').click( function(){
    $('#openTab').toggle("show");
    var tabs = document.getElementsByClassName("tab");
    var length = tabs.length;
    for(i=0; i<length; i++){
        //alert(i);
        tabs[0].remove();
        /*if(tabs[0].className="tab"){
            tabs[0].className="tabh";
        }else{
            tabs[0].className="tab";
        }
        //tabs[i].toggle("show");
    }
});*/


//tabGroupList
$('.tabGroupList').click(function(event){
    bkg.console.log("clicked");
    if(event.target.getAttribute("class") === "tabGroup"){
        tabGroupAction(event);
    }else if(event.target.getAttribute("class") === "tab"){
        //$('#openTab').toggle("show");
        chrome.tabs.create({"url":event.target.getAttribute("href")});
    }else if(event.target.getAttribute("class") === "backTab"){
        bkg.console.log("Y");
        loadTabGroups();
        bkg.console.log("N");
        removeTabButttons();
        bkg.console.log("M");
    }else{
        alert(event.target.getAttribute("class") + "not a correct button");
    }
});

/*for(i=0; i< document.getElementById('tab).length; i++){
    if(document.getElementsByClassName('tab')[i].onclick=function(){
        $('#openTab').toggle("show");
        chrome.tabs.create({"url":event.target.getAttribute("href")});
    }
}*/
