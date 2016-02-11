
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

var bkg = chrome.extension.getBackgroundPage();

document.addEventListener('DOMContentLoaded', function() {
    bkg.console.log("Start");
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
    bkg.console.log("End");
});

function getTabGroupInfo(){
    //bkg.console.log("Hello");
    $.get("http://crossoverdev.parseapp.com/getTabGroups" ,  function(data) {
        bkg.console.log("Got here");
        //if(response.success) {
            //bkg.console.log("Hey I am working");
            //doge = data.tabs;
            doge = data;
            bkg.console.log(doge);
            bkg.console.log(doge.tabGroups);
            //alert(doge[0].url);
            //alert(doge);  
        //} else {
            bkg.console.log("getTabGroupTabs Failed");
        //}
           
    });  
    bkg.console.log("Bye");
}

function loadLogin(){
    var text = $("#loginStuff").html()
    $('#loginInfo').append(text);
}

function loadTabGroups(){
    //bkg.console.log("Working3");
    var groupNum = userGroups.length;

    $('#tabsList').html('');
    
    var backButton = document.querySelector('#Buttons').content.querySelector('#backUserStuff').cloneNode(true);
    //$('#tabsList').append(backButton);
    
    //$('#tabsList').append("<br>");
    
    var tGList = JsonTGL.tabGroups;
    //bkg.console.log("loop");
    for(i=0; i < groupNum; i++){
        var template = document.querySelector('#Buttons').content.querySelector('#GroupButton').cloneNode(true);
        //bkg.console.log(template);
        template.value = tGList[i].title;
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
    //bkg.console.log(group);
    if(group === "Group 1"){
        inputTabs = userTabs;
    } else if(group === "Group 2"){
        inputTabs = userTabs2;
    } else if(group === "Group 3"){
        inputTabs = userTabs3;
    } else {
        inputTabs = [];
    }
    
    var backButton = document.querySelector('#Buttons').content.querySelector('#backGroupStuff').cloneNode(true);
    $('#tabsList').append(backButton);
    
    $('#tabsList').append("<br>");
    
    for (i=0; i<inputTabs.length; i++){//tab in userTabs){
        var template = document.querySelector('#Buttons').content.querySelector('#TabButton').cloneNode(true);
        
        template.value=inputTabs[i];
        template.setAttribute("href",inputTabs[i]);
        template.dataset.group = group;
        //bkg.console.log(template);
        
        $('#tabsList').append(template);
        $('#tabsList').append("<br>");
    }
}

function openSpecificTab(tab){
    chrome.tabs.create({"url":tab.getAttribute("href")});
}


// login page, we also inject the user actions template here
$('#loginInfo').on('click', '#subButton', function() {
  var name = $("#name").val();
  var pass = $("#pass").val();
  var text = $("#tabGroups").html();
  //var text = $("#userStuff").html();
  //fake@gmail.com 1234
  $.post("http://crossoverdev.parseapp.com/user", {
        email: name,
        password: pass
      }, function(response) {

        //alert(response);
        //alert(response.success);

        if(response.success) {
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


$('#loginInfo').on('click', '#addView', function() {
    clearHTML();
    injectAddTabs();
  });
  
  $('#loginInfo').on('click', '#backGroupStuff', function() {
    loadTabGroups();
});

$('#loginInfo').on('click', '#GroupButton', function() {
    //bkg.console.log(this);
    //bkg.console.log("Press");
    
    
    loadTabButtons(this);
});

$('#loginInfo').on('click', '#TabButton', function() {
    //bkg.console.log(this);
    //bkg.console.log("Press");
    openSpecificTab(this);
});

// adds a new tab/ tab group. I think I need to add the group, then make a get to 
// see what the group ID is then I can make another post request to add the tab to the group.
$('#loginInfo').on('click', '#addTab', function() {
  var tabGroup = $("#tabGROUP").val();
  //var url = $("#pass").val(); 
  //var group = $("#name").val();
  
  $.post("http://crossoverdev.parseapp.com/newTabGroup", {
        title: tabGroup
      }, function(response) {

        //alert(response);
        //alert(response.success);

        if(response.success) {
         alert("You made a new tab Group");
        }
        else {
          alert("There was an error!");
        }
      });
  
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

