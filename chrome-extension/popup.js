var doge;
var re = new RegExp("^(http|https)://", "i"); //regex to check if we
var userGroups = [];
var tabGroupID;
var textTbL;
var JsonTbL;
var allTabs;
// these two arrays hold the user tab group names and their ID's we use these in the addTab functions to make calls
var dogeID = [];
var dataID = [];
var openSome = false;
var bkg = chrome.extension.getBackgroundPage();



// on document ready we insert the login page
document.addEventListener('DOMContentLoaded', function() {
  loadLogin();
    var template = document.querySelector('#Buttons').content.querySelector('#backUserStuff').cloneNode(true);
    $('#tabsList').append(template);
});

// sets a cookie that takes variable min that sets cookie to expire after min minutes currently this is disabled
function set_cookie(min) {
    var now = new Date();
    var exp = new Date(now.getTime() + min*60*1000);
    var status = '';
    document.cookie = 'ExpirationCookieTest=1; expires='+exp.toUTCString();
    if (document.cookie && document.cookie.indexOf('ExpirationCookieTest=1') != -1) {
        alert('Cookie successfully set. Expiration in '+min+' minutes');

    } else {
        alert('Cookie NOT set. Please make sure your browser is accepting cookies');
    }

    
}

// checkes if extension cookie exists, if so returns True, else returns false
function get_cookie() {
    if (document.cookie && document.cookie.indexOf('ExpirationCookieTest=1') != -1) {
        return true
    } else {
        return false
    }  
}

// makes a call to the database to update the tabGroup and data ID lists
function getTabGroupInfo(){
    var temp;
    $.ajax({
        async: false,
        type: 'GET',
        url: 'http://crossoverdev.parseapp.com/getTabGroups',
        success: function(data) {
            temp = data;
            JsonTGL = temp.tabGroups;
            for(i=0; i < doge.tabGroups.length; i++){
                dogeID.push(doge.tabGroups[i].title);
                dataID.push(doge.tabGroups[i].id);
            }
        },
        error: function(){
            bkg.console.log("failed to load tab groups");
        }
    });
}


//Makes a call to the database to get tab info
function getTabsInfo(tabGroupTitle){
    var temp;
    $.ajax({
        async: false,
        type: 'GET',
        url: 'http://crossoverdev.parseapp.com/getTabGroupTabs',
        success: function(data) {
            temp = data;
            JsonTbL = temp.tabs;
        },
        error: function(data){
            //bkg.console.log(data.message);
        },
        data: {
            tabGroup: tabGroupTitle
        }
    });
}


//Loads the login view
function loadLogin(){
    var text = $("#loginStuff").html()
    clearHTML();
    $('#loginInfo').append(text);
    var title = document.querySelector('#Titles').content.querySelector('#greeting').cloneNode(true);
    $('#displayBody').append(title);
}


// loads in the option bar and populates the field with user tab groups
function loadTabGroups(){
    $('#displayBody').html('');
    var title =  document.querySelector('#Titles').content.querySelector('#titleForTGs').cloneNode(true);
    $('#displayBody').append(title);

    $('#optionBar').html('');
    var addAll = document.querySelector('#Buttons').content.querySelector('#addSaveAllTabs').cloneNode(true);
    var addSom = document.querySelector('#Buttons').content.querySelector('#addSaveSomeTabs').cloneNode(true);
    var addGrp = document.querySelector('#Buttons').content.querySelector('#addNewGroup').cloneNode(true);
    var addTab = document.querySelector('#Buttons').content.querySelector('#addView').cloneNode(true);

    $('#optionBar').append(addAll);
    $('#optionBar').append(addSom);
    $('#optionBar').append(addGrp);
    $('#optionBar').append(addTab);
    
    $('#tabsList').html('');
    
    var backButton = document.querySelector('#Buttons').content.querySelector('#backUserStuff').cloneNode(true);
    
    //Populates the view with buttons that are the tab groups
    var tGList = JsonTGL;
    for(i=0; i < tGList.length; i++){
        var template = document.querySelector('#Buttons').content.querySelector('#GroupButton').cloneNode(true);
        template.value = tGList[i].title;
        template.dataset.id = tGList[i].id;
        $('#tabsList').append(template);
        $('#tabsList').append("<br>");
    }
}

// populates the option bar with various buttons
function loadTabButtons(groupButton){
    $('#tabsList').html('');
    var inputTabs;
    var group = groupButton.value;
    
    $('#displayBody').html('');
    var title =  document.querySelector('#Titles').content.querySelector('#TabGroupTitle').cloneNode(true);
    title.innerHTML = group;
    $('#displayBody').append(title);
    

    getTabsInfo(groupButton.dataset.id);
    inputTabs = JsonTbL;
    
    $('#optionBar').html('');
    var backButton = document.querySelector('#Buttons').content.querySelector('#backGroupStuff').cloneNode(true);
    $('#optionBar').append(backButton);
    var AddButton = document.querySelector('#Buttons').content.querySelector('#addView').cloneNode(true);
    $('#optionBar').append(AddButton);
    var openAllButton = document.querySelector('#Buttons').content.querySelector('#OpenAll').cloneNode(true);
    openAllButton.dataset.group = group;
    $('#optionBar').append(openAllButton);
    var openSomeButton = document.querySelector('#Buttons').content.querySelector('#OpenSome').cloneNode(true);
    $('#optionBar').append(openSomeButton);
    
    $('#optionBar').append("<br>");
    
    //Populates page with buttons that are the tabs of the group
    for (i=0; i<inputTabs.length; i++){
        var template = document.querySelector('#Buttons').content.querySelector('#TabButton').cloneNode(true);
        
        template.value=inputTabs[i].title;
        template.setAttribute("href",inputTabs[i].url);
        template.dataset.group = group;
        
        $('#tabsList').append(template);
        $('#tabsList').append("<br>");
    }
}

//Opens a tab from a given url
function openSpecificTab(tab){
    chrome.tabs.create({"url":tab.getAttribute("href")});
}

//Opens all the tabs from a specific group
function openAllInCurrentGroup(){
    for(var j=0; j<JsonTbL.length; j++){
        chrome.tabs.create({"url":JsonTbL[j].url});
    }
}

//Loads the save all and save some view
function loadSaveAllTabView(saveType){
    var text = $("#saveAllTabView").html();
    $('#loginInfo').html("");
    $('#loginInfo').append(text);
    fillGroupDropDown();
    if(saveType === "all"){
        var saveButton = document.querySelector('#Buttons').content.querySelector('#saveAllTabs').cloneNode(true);
        $('#loginInfo').append(saveButton);
    } else if (saveType === "some"){
        var saveButton = document.querySelector('#Buttons').content.querySelector('#saveSomeTabs').cloneNode(true);
        $('#loginInfo').append(saveButton);
        var tabsList = document.querySelector('#tabGroups').content.querySelector('#tabsList').cloneNode(true);
        $('#loginInfo').append(tabsList);
        getAllTabs();
        chrome.runtime.onMessage.addListener(
            function(request, sender, sendResponse) {
                if( request.message === "GotTabs" ) {
                    openSome = true;
                    for (i=0; i<allTabs.length; i++){
                        var template = document.querySelector('#Buttons').content.querySelector('#TabButton').cloneNode(true);
                        
                        template.value=allTabs[i].title;
                        template.setAttribute("href",allTabs[i].url);
                        
                        $('#tabsList').append(template);
                        $('#tabsList').append("<br>");
                    }
                }
            }
        );
    }
}

//Gets all of the tabs from the current window
function getAllTabs(){
    allTabs = [];
    chrome.tabs.query({currentWindow: true}, function(tabs) {
        for(var i =0; i < tabs.length; i++){
            allTabs.push({
                title: tabs[i].title,
                url: tabs[i].url
            });
        }
        for(var i=0; i<allTabs.length; i++){
            bkg.console.log(allTabs[i].title + " " + allTabs[i].url);
        }
        chrome.runtime.sendMessage({"message": "GotTabs"});
    });
}



// login page, we also inject the user actions template here
$('#loginInfo').on('click', '#subButton', function() {
  var name = $("#name").val();
  var pass = $("#pass").val();
  var text = $("#tabGroups").html();
  //fake@gmail.com 1234 (Test account)
  $.post("http://crossoverdev.parseapp.com/user", {
        email: name,
        password: pass
      }, function(response) {
        if(response.success) {
          getTabGroupInfo();
          $('#loginInfo').html("");
          $('#loginInfo').append(text);
          loadTabGroups();
          //set_cookie(1); sets the cookie to expire after 1 minute
        }
        else {
          alert("Too Bad");
        }
      });
  });


// loads the tab groups template into the extension
$('#loginInfo').on('click', '#openGroups', function() {
    var groups = $("#tabGroups").html();
    $('#loginInfo').html("");
    $('#loginInfo').append(groups);
    loadTabGroups();

  });

//Injects the add a tab view which lets the user add new tabs to a selected group
$('#loginInfo').on('click', '#addView', function() {
    clearHTML();
    injectAddTabs();
  });


//Logic for the back button that returns user to the list of tab groups  
  $('#loginInfo').on('click', '#backGroupStuff', function() {
    if($('#tabGROUP').length){
        clearHTML();
        getTabGroupInfo();
        var text = $("#tabGroups").html();
        $('#loginInfo').append(text);
    }
    loadTabGroups();
    openSome = false;
});


//Loads the tabs inside of a selected group
$('#loginInfo').on('click', '#GroupButton', function() {
    loadTabButtons(this);
});


// lets the user select a tabs to be opend from a tab group
$('#loginInfo').on('click', '#TabButton', function() {
    if(openSome){
        if(this.className === "popButton"){
            this.className = "popButtonChecked";
        } else if (this.className === "popButtonChecked") {
            this.className = "popButton";
        } else {
            bkg.console.log("not correct class");
        }
    } else {
        openSpecificTab(this);
    }
});

//Opens all tabs in a group
$('#loginInfo').on('click', '#OpenAll', function(){
    var tabButtons = $('.popButton');
    var tabLength = tabButtons.length;
    for(var b = 0; b<tabLength; b++){
        if(tabButtons[b].getAttribute("id")==="TabButton"){
            chrome.tabs.create({"url":tabButtons[b].getAttribute("href")});
        }
    }
})

//This changes the class of the tab button, if changed we select multiple tabs to be opened.
$('#loginInfo').on('click', '#OpenSome', function(){
    if(openSome){
        var tabButtons = $('.popButtonChecked');
        var tabLength = tabButtons.length;
        for(var k = 0; k<tabLength; k++){
            tabButtons[k].className = "popButton";
        }
        $('#OpenSelect').remove();
    } else {
        var selectButton = document.querySelector('#Buttons').content.querySelector('#OpenSelect').cloneNode(true);
        $('#OpenSome').after(selectButton);
    }
    openSome = !openSome;
});


//Opens the selected tabs from the above function
$('#loginInfo').on('click', '#OpenSelect', function(){
    var tabButtons = $('.popButtonChecked');
    var tabLength = tabButtons.length;
    for(var b = 0; b<tabLength; b++){
        chrome.tabs.create({"url":tabButtons[b].getAttribute("href")});
    }
});


//Saves all current open tabs
$('#loginInfo').on('click', '#addSaveAllTabs', function(){
    clearHTML();
    loadSaveAllTabView("all");
});

//Saves some tabs from current window
$('#loginInfo').on('click', '#addSaveSomeTabs', function(){
    clearHTML();
    loadSaveAllTabView("some");
});


//Saves all selected tabs
$('#loginInfo').on('click', '#saveAllTabs', function(){
    getAllTabs();
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            if( request.message === "GotTabs" ) {
                addTabBunch();
            }
        }
    );
});

$('#loginInfo').on('click', '#saveSomeTabs', function(){
    var tabButtons = $('.popButtonChecked');
    var tabLength = tabButtons.length;
    allTabs = [];
    for(var i =0; i < tabButtons.length; i++){
        allTabs.push({
            title: tabButtons[i].getAttribute("value"),
            url: tabButtons[i].getAttribute("href")
        });
    }
    for(var j = 0; j<allTabs.length; j++){
        bkg.console.log(allTabs[j].title +" "+ allTabs[j].url);
    }
    addTabBunch();
    openSome = false;
});

// adds a selected group of tabs
function addTabBunch(){
    var groupId = $("#tabGROUP").val();
    for(var i=0; i<allTabs.length; i++){
        var putTab = [allTabs[i]];
        $.ajax({
            async: false,
            type: 'POST',
            url: 'http://crossoverdev.parseapp.com/newTabs',
            success: function(data) {
                bkg.console.log("You made a new tab!");
            },
            error: function(data){
                alert(data.message);
            },
            data: {
                newTabs: putTab,
                tabGroup: groupId
            }
        });
    }
    
    var text = $("#tabGroups").html();
    dogeID = [];
    dataID = [];
    clearHTML();
    getTabGroupInfo();
    $('#loginInfo').append(text);
    loadTabGroups();
    loadTabGroups();
}

// logic that shows or hides the custom group input in the addTabView
$('#loginInfo').on('click', '#tabGROUP', function(){
  var groupId = $("#tabGROUP").val();

  if(groupId == "newGroup"){
    $('#newTabGROUP').show();
  }
  else{
     $('#newTabGROUP').hide();
  }
});


// adds a new tab/ tab group. I think I need to add the group, then make a get to 
// see what the group ID is then I can make another post request to add the tab to the group.

$('#loginInfo').on('click', '#addTab', function() {
  var groupId = $("#tabGROUP").val();
  var customID =  $('#newTabGROUP').val();
  var taburl = $("#tabURL").val(); 
  var tabtitle = $("#tabTITLE").val();
  var match = re.test(taburl);

  if(!match){
    taburl = "https://" + taburl;
    }
  
  var tab = {
            title: tabtitle,
            url: taburl
          }
  var newTab = [tab];

  if(groupId == "newGroup"){
    $.post("http://crossoverdev.parseapp.com/newTabGroup", {
        title: customID
      }, function(response) {
        if(response.success) {
         
         $.get("http://crossoverdev.parseapp.com/getTabGroups" ,  function(data) {
            doge = data;
        
            customID = doge.tabGroups[doge.tabGroups.length -1].id;
          });

         setTimeout(function(){  //setting a timeout to ensure database has registered the new group
            $.post("http://crossoverdev.parseapp.com/newTabs", {
                newTabs: newTab,
                tabGroup: customID
                }, function(response) {
                  if(response.success) {
                      alert("You made a new tab!");
                  }
                  else {
                      alert("shit is all fucked up!");
                    }
            });

        }, 2000); //end here
        clearHTML();
        getTabGroupInfo();
        injectAddTabs();
        }
        else {
          alert("There was an error!");
        }
      });

  }
  else{
    $.post("http://crossoverdev.parseapp.com/newTabs", {
        newTabs: newTab,
        tabGroup: groupId
      }, function(response) {
        if(response.success) {
         alert("You made a new tab!");
         clearHTML();
         getTabGroupInfo();
         injectAddTabs();
        }
        else {
          alert("There was an error!");
        }
      });
  }  
  });



//Injects the add group view, here the user can create new tab groups for their  profile
$('#loginInfo').on('click', '#addNewGroup', function() {
    $("#displayBody").html("");
    var text = $("#addGroupView").html();
    clearHTML();
    $('#loginInfo').append(text);
    var addBack = document.querySelector('#Buttons').content.querySelector('#backUserStuff').cloneNode(true);
    $('#loginInfo').append(addBack);
  });


// Lets the user create a new tab group for their profile
$('#loginInfo').on('click', '#addGRP', function() {
    var groupName = $("#groupTITLE").val();

    $.post("http://crossoverdev.parseapp.com/newTabGroup", {
        title: groupName
      }, function(response) {
        if(response.success) {
         alert("You made a new tab Group");
        }
        else {
          alert("There was an error!");
        }
      });
  });

//Adds a tab to a group in the database
function addNewTab(group, tab){
  $.post("http://crossoverdev.parseapp.com/newTabs", {
        newTabs: tab,
        tabGroup: group
      }, function(response) {
        if(response.success) {
         alert("You made a new tab!");
         clearHTML();
         injectAddTabs();
        }
        else {
          alert("There was an error!");
        }
      });

}

//function that lets a user create a new group.
function addNewGroup(group) {
  var groupName = group

    $.post("http://crossoverdev.parseapp.com/newTabGroup", {
        title: groupName
      }, function(response) {
        if(response.success) {
         alert("You made a new tab Group");
        }
        else {
          alert("There was an error!");
        }
      });
}



//Logic for the back buttion in the addGroupView
$('#loginInfo').on('click', '#backUserStuff', function() {
  var text = $("#tabGroups").html();
  dogeID = [];
  dataID = [];
  clearHTML();
  getTabGroupInfo();
  $('#loginInfo').append(text);
  loadTabGroups();
  });

//clears the viewing area of its contents
function clearHTML(){
  $('#loginInfo').html("");
}

//Injects the add tab view into the viewing area
function injectAddTabs(){
  $("#displayBody").html("");
  var text = $("#addTabView").html();
  $('#loginInfo').html("");
  $('#loginInfo').append(text);
  
  fillGroupDropDown();
}

//Fills in the dropdown menu with the titles and info for tab groups
function fillGroupDropDown(){
  var addOption;
  for(i=0; i < JsonTGL.length + 1; i++){
    if(i == 0){
      //$('#tabGROUP').append("<option value='newGroup'>Add a new group</option>");
    }
    else{
      addOption = document.querySelector('#Misc').content.querySelector('#addTabOption').cloneNode(true);
      addOption.value = JsonTGL[i-1].id;
      addOption.innerHTML = JsonTGL[i-1].title;
      $('#tabGROUP').append(addOption);
    }
   }
   $('#tabGROUP').append("<option value='newGroup'>Add a new group</option>");
}



