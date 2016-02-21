
var doge;

//var geturl = new RegExp("(http|ftp|https|www)://[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?", "g");


var userTabs = ['http://reddit.com', 'http://google.com', 'http://pcpartpicker.com/'];
var userTabs2 = ['https://www.youtube.com/', 'http://gmail.com', 'http://yahoo.com'];
var userTabs3 = ['http://memebase.com', 'http://http://www.w3schools.com/', 'http://slack.com'];
var userTabs4 = ['http://memebase.com', 'http://http://www.w3schools.com/', 'http://slack.com'];

var userGroups = [userTabs, userTabs2, userTabs3, userTabs4];
var tabGroupID;

var textTGL = '{"tabGroups":[{"id":"Acji5m8nYc","title":"Group 1"},{"id":"s5s17T89aq","title":"Group 2"},{"id":"asdfjkl;","title":"Group 3"}],"success":true}';
var JsonTGL = JSON.parse(textTGL);

var textTbL;
var JsonTbL;

var allTabs;

// these two arrays hold the user tab group names and their ID's we use these in the addTab functions to make calls
var dogeID = [];
var dataID = [];

var openSome = false;

var bkg = chrome.extension.getBackgroundPage();

document.addEventListener('DOMContentLoaded', function() {
    //bkg.console.log("Start");
    //if(){ //doesn't have session token
        loadLogin();
    //}else if(){ //does have session token
        //bkg.console.log("Middle");
        //loadTabGroups();
        //removeLogin();
    //}else{ //error
        //error code here
    //}
    var template = document.querySelector('#Buttons').content.querySelector('#backUserStuff').cloneNode(true);
    $('#tabsList').append(template);
    //bkg.console.log("End");
});

/*function getTabGroupInfo(){
    //bkg.console.log("Hello");
      $.get("http://crossoverdev.parseapp.com/getTabGroups" ,  function(data) {
        doge = data;

        //alert(doge.tabGroups[0].title); 
        //alert(doge.tabGroups.length);    
        //doge = data.tabGroups;
        //alert(doge[0].url);
        // we can use a for loop now to catch all of the urls and names!   
        for(i=0; i < doge.tabGroups.length; i++){
        //alert(doge.tabGroups[1].title);
        dogeID.push(doge.tabGroups[i].title);
        dataID.push(doge.tabGroups[i].id);
        }
        //alert(dogeID);
      });
    bkg.console.log("Bye");
}*/

function getTabGroupInfo(){
    //bkg.console.log("Hello");
    var temp;
    $.ajax({
        async: false,
        type: 'GET',
        url: 'http://crossoverdev.parseapp.com/getTabGroups',
        success: function(data) {
            //bkg.console.log("Made it");
            temp = data;
            JsonTGL = temp.tabGroups;
            for(i=0; i < doge.tabGroups.length; i++){
                //alert(doge.tabGroups[1].title);
                dogeID.push(doge.tabGroups[i].title);
                dataID.push(doge.tabGroups[i].id);
            }
        },
        error: function(){
            bkg.console.log("failed to load tab groups");
        }
    });
    //bkg.console.log("Bye");
}

function getTabsInfo(tabGroupTitle){
    var temp;
    $.ajax({
        async: false,
        type: 'GET',
        url: 'http://crossoverdev.parseapp.com/getTabGroupTabs',
        success: function(data) {
            //bkg.console.log("Made it2");
            temp = data;
            JsonTbL = temp.tabs;
            bkg.console.log(temp.tabs);
        },
        error: function(data){
            //bkg.console.log(data.message);
        },
        data: {
            tabGroup: tabGroupTitle
        }
    });
}

function loadLogin(){
    var text = $("#loginStuff").html()
    $('#loginInfo').append(text);
    var title = document.querySelector('#Titles').content.querySelector('#greeting').cloneNode(true);
    $('#displayBody').append(title);
}

function loadTabGroups(){
    //bkg.console.log("Working3");
    var groupNum = userGroups.length;
    
    
    
    $('#displayBody').html('');
    var title =  document.querySelector('#Titles').content.querySelector('#titleForTGs').cloneNode(true);
    $('#displayBody').append(title);

    
    $('#optionBar').html('');
    var addAll = document.querySelector('#Buttons').content.querySelector('#addSaveAllTabs').cloneNode(true);
    var addGrp = document.querySelector('#Buttons').content.querySelector('#addNewGroup').cloneNode(true);

    $('#optionBar').append(addAll);
    $('#optionBar').append(addGrp);
    
    $('#tabsList').html('');
    
    var backButton = document.querySelector('#Buttons').content.querySelector('#backUserStuff').cloneNode(true);
    //$('#tabsList').append(backButton);
    
    //$('#tabsList').append("<br>");
    
    var tGList = JsonTGL;//.tabGroups;
    //bkg.console.log("loop");
    //bkg.console.log(tGList.length);
    for(i=0; i < tGList.length; i++){
        bkg.console.log(tGList[i]);
        var template = document.querySelector('#Buttons').content.querySelector('#GroupButton').cloneNode(true);
        //bkg.console.log(template);
        template.value = tGList[i].title;
        template.dataset.id = tGList[i].id;
        $('#tabsList').append(template);
        $('#tabsList').append("<br>");
        //$('#tabsList').append("<br>");
        //bkg.console.log(template);
    }
}

function loadTabButtons(groupButton){
    //bkg.console.log("LTB");
    $('#tabsList').html('');
    var inputTabs;
    var group = groupButton.value;
    
    $('#displayBody').html('');
    var title =  document.querySelector('#Titles').content.querySelector('#TabGroupTitle').cloneNode(true);
    title.innerHTML = group;
    $('#displayBody').append(title);
    
    
    //bkg.console.log(group);
    /*if(group === "Group 1"){
        inputTabs = userTabs;
    } else if(group === "Group 2"){
        inputTabs = userTabs2;
    } else if(group === "Group 3"){
        inputTabs = userTabs3;
    } else {
        inputTabs = [];
    }*/
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
    
    for (i=0; i<inputTabs.length; i++){//tab in userTabs){
        var template = document.querySelector('#Buttons').content.querySelector('#TabButton').cloneNode(true);
        
        template.value=inputTabs[i].title;
        template.setAttribute("href",inputTabs[i].url);
        template.dataset.group = group;
        //bkg.console.log(template);
        
        $('#tabsList').append(template);
        $('#tabsList').append("<br>");
    }
}

function openSpecificTab(tab){
    chrome.tabs.create({"url":tab.getAttribute("href")});
}

function openAllInCurrentGroup(){
    for(var j=0; j<JsonTbL.length; j++){
        chrome.tabs.create({"url":JsonTbL[j].url});
    }
}

function loadSaveAllTabView(){
    var text = $("#saveAllTabView").html();
    $('#loginInfo').html("");
    $('#loginInfo').append(text);
    fillGroupDropDown();
}

function getAllTabs(){
    allTabs = [];
    chrome.tabs.query({currentWindow: true}, function(tabs) {
        //var activeTab = tabs;
        //bkg.console.log(tabs.length);
        for(var i =0; i < tabs.length; i++){
            //url.push(tabs[i].url);
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
  //var text = $("#userStuff").html();
  bkg.console.log("pressed submit");
  //fake@gmail.com 1234
  $.post("http://crossoverdev.parseapp.com/user", {
        email: name,
        password: pass
      }, function(response) {

        //alert(response);
        //alert(response.success);

        if(response.success) {
          bkg.console.log("0");
          getTabGroupInfo();
          bkg.console.log("1");
          //$('#logIn').toggle("show");
          $('#loginInfo').html("");
          bkg.console.log("2");
          $('#loginInfo').append(text);
          bkg.console.log("3");
          
          bkg.console.log("4");
          loadTabGroups();
          bkg.console.log("5");
        }
        else {
          alert("Too Bad");
        }
      });

    //try getTabGroup, used to be getTabs
  /*  
  $.get("http://crossoverdev.parseapp.com/getTabs" ,  function(data) {
        doge = data.tabs;
        //doge = data.tabGroups;
        //alert(doge[0].url);
        // we can use a for loop now to catch all of the urls and names!   
      });  
  */
    
  /*$.get("http://crossoverdev.parseapp.com/getTabGroups" ,  function(data) {
        doge = data;
        alert(doge.tabGroups[1].title);
        //doge = data.tabGroups;
        //alert(doge[0].url);
        // we can use a for loop now to catch all of the urls and names!   
      });*/ 


  });


// loads the tab groups template into the extension
$('#loginInfo').on('click', '#openGroups', function() {
     //bkg.console.log("Working1");
     
    var groups = $("#tabGroups").html();
    $('#loginInfo').html("");
    $('#loginInfo').append(groups);
    loadTabGroups();
     //bkg.console.log("Working2");
     
     /*var groups = $("#tabGroups").html();
     var groupNum = userGroups.length;

     $('#loginInfo').html("");
     $('#loginInfo').append(groups);
     bkg.console.log("Here "+groupNum);
     bkg.console.log(groups);
     for(i=0; i < groupNum; i++){
         /*bkg.console.log("Woah");
         var gtButton = $("#Buttons").html();//.child("input.GroupButton").clone(true);
         bkg.console.log(gtButton);
         var maybehappens = $.parseHTML(gtButton);
         bkg.console.log(maybehappens);
         maybehappens.val("group"+(i+1));
         bkg.console.log(maybehappens);
         maybehappens.attr("id", "group"+(i+1));
         bkg.console.log(maybehappens);
         $('#tabList').append(maybehappens);
         //
         $('#tabsList').append("<input type='button' class='tabGroupButton popButton' id='group"+ i +"' value='group"+(i+1) +"'/>");
     }*/ 
  });


// Loads the contents of each tab group to display area listHolding
$('#loginInfo').on('click', '.tabGroupButton', function() {
     var id = this.id;
     var idNum = parseInt(id[id.length -1]);
     $('#listHolding').html("");

     for(i=0; i < userGroups[idNum].length; i++ ){
        //alert(userGroups[idNum][i]);
        $('#listHolding').append("<p> '"+userGroups[idNum][i] +"'</p>");
    } 

  });

// On button click we reload contents of userStuff
//Change to logout later
/*$('#loginInfo').on('click', '#backUserStuff', function() {
    var text = $("#userStuff").html();
    $('#loginInfo').html("");
    $('#loginInfo').append(text);
  });*/



//Injects the add a tab view which lets the user add new tabs to a selected group
$('#loginInfo').on('click', '#addView', function() {
    clearHTML();
    injectAddTabs();
  });


//Logic for the back button that returns user to the list of tab groups  
  $('#loginInfo').on('click', '#backGroupStuff', function() {
    if($('#tabGROUP').length){
        clearHTML();
        var text = $("#tabGroups").html();
        $('#loginInfo').append(text);
    }
    loadTabGroups();
});


//Loads the tabs inside of a selected group
$('#loginInfo').on('click', '#GroupButton', function() {
    loadTabButtons(this);
});


// lets the user select a tabs to be opend from a tab group
$('#loginInfo').on('click', '#TabButton', function() {
    //bkg.console.log(this);
    //bkg.console.log("Press");
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


//This changes the class of the tab button, if changed we select multiple tabs to be opened.
$('#loginInfo').on('click', '#OpenSome', function(){
    if(openSome){
        var tabButtons = $('.popButtonChecked');
        var tabLength = tabButtons.length;
        for(var k = 0; k<tabLength; k++){
            tabButtons[k].className = "popButton";
        }
        //bkg.console.log(tabButtons);
        $('#OpenSelect').remove();
    } else {
        var selectButton = document.querySelector('#Buttons').content.querySelector('#OpenSelect').cloneNode(true);
        $('#OpenSome').after(selectButton);
    }
    openSome = !openSome;
    //bkg.console.log(openSome);
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
    loadSaveAllTabView();
});

$('#loginInfo').on('click', '#saveAllTabs', function(){
    getAllTabs();
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            if( request.message === "GotTabs" ) {
                bkg.console.log("I got tabs");
                addTabBunch();
            }
        }
    );
    
});
function addTabBunch(){
    var groupId = $("#tabGROUP").val();
    bkg.console.log(allTabs.length);
    for(var i=0; i<allTabs.length; i++){
        bkg.console.log(allTabs[i].title + " " + allTabs[i].url);
    }
    for(var i=0; i<allTabs.length; i++){
        var putTab = [allTabs[i]];
        bkg.console.log("Loading: " +i);
        /*$.post("http://crossoverdev.parseapp.com/newTabs", {
            newTabs: allTabs[i],
            tabGroup: groupId
        }, function(response) {
            if(response.success) {
                bkg.console.log("You made a new tab!");
                clearHTML();
                injectAddTabs();
            } else {
                alert("There was an error!");
            }
        });*/
        $.ajax({
            async: false,
            type: 'POST',
            url: 'http://crossoverdev.parseapp.com/newTabs',
            success: function(data) {
                bkg.console.log("You made a new tab!");
                //clearHTML();
                //injectAddTabs();
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
    bkg.console.log("Made it to save all tabs button");
}


// adds a new tab/ tab group. I think I need to add the group, then make a get to 
// see what the group ID is then I can make another post request to add the tab to the group.
$('#loginInfo').on('click', '#addTab', function() {
  var groupId = $("#tabGROUP").val();
  var taburl = $("#tabURL").val(); 
  var tabtitle = $("#tabTITLE").val();

  var tab = {
            title: tabtitle,
            url: taburl
          }
  var newTab = [tab];

  if(groupId == "newGroup"){
    alert("new group");
  }
  else{
    $.post("http://crossoverdev.parseapp.com/newTabs", {
        newTabs: newTab,
        tabGroup: groupId
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
  });



//Injects the add group view, here the user can create new tab groups for their  profile
//Turn this into a function later.
$('#loginInfo').on('click', '#addNewGroup', function() {
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
  var text = $("#addTabView").html();
  $('#loginInfo').html("");
  $('#loginInfo').append(text);
  
  fillGroupDropDown();
}

function fillGroupDropDown(){
  var addOption;
  //bkg.console.log(dogeID.length);
  bkg.console.log("AddTab");
  bkg.console.log(JsonTGL.length);
  for(i=0; i < JsonTGL.length + 1; i++){
    if(i == 0){
      //$('#tabGROUP').append("<option value='newGroup'>Add a new group</option>");
    }
    else{
      addOption = document.querySelector('#Misc').content.querySelector('#addTabOption').cloneNode(true);
      addOption.value = JsonTGL[i-1].id;
      addOption.innerHTML = JsonTGL[i-1].title;
      bkg.console.log(document);
      bkg.console.log(addOption);
      $('#tabGROUP').append(addOption);
      //$('#tabGROUP').append("<option value="+ dataID[i-1] +"'>"+dogeID[i-1]+"</option>");
    }
   }
}
/*function getUserGroups(){
  $.post("http://crossoverdev.parseapp.com/getTabGroups", {
        user: "fake@gmail.com"
      }, function(response) {

        //alert(response);
        //alert(response.success);

        if(response.success) {
          alert(response.tabGroups);
        }
        else {
          alert("There was an error");
        }
      });
}*/
