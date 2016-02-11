
var doge = "";

//var geturl = new RegExp("(http|ftp|https|www)://[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?", "g");


var userTabs = ['http://reddit.com', 'http://google.com', 'http://pcpartpicker.com/'];
var userTabs2 = ['https://www.youtube.com/', 'http://gmail.com', 'http://yahoo.com'];
var userTabs3 = ['http://memebase.com', 'http://http://www.w3schools.com/', 'http://slack.com'];
var userTabs4 = ['http://memebase.com', 'http://http://www.w3schools.com/', 'http://slack.com'];

var userGroups = [userTabs, userTabs2, userTabs3, userTabs4];
var tabGroupID;

var textTGL = '{"tabGroups":[{"id":"Acji5m8nYc","title":"Group 1"},{"id":"s5s17T89aq","title":"Group 2"},{"id":"asdfjkl;","title":"Group 3"}],"success":true}';
var JsonTGL = JSON.parse(textTGL);


function bgcl(string){
    chrome.extension.getBackgroundPage().console.log(string);
}
var bkg = chrome.extension.getBackgroundPage();

document.addEventListener('DOMContentLoaded', function() {
    bkg.console.log("Start");
    //if(){ //doesn't have session token
        //loadLogin();
    //}else if(){ //does have session token
        //bkg.console.log("Middle");
        loadTabGroups();
        //removeLogin();
    //}else{ //error
        //error code here
    //}
    bkg.console.log("End");
});



// On click we display the login text input template
$('#logIn').click( function() {
  var text = $("#loginStuff").html()
  
   $('#loginInfo').append(text);
   $('#loginInfo').toggle("show");
});


// login page, we also inject the user actions template here
$('#loginInfo').on('click', '#subButton', function() {
  var name = $("#name").val();
  var pass = $("#pass").val();
  //var text = $("#userStuff").html();
  //var text = $("#userStuff").html();
  //fake@gmail.com 1234
  $.post("http://crossoverdev.parseapp.com/user", {
        email: name,
        password: pass
      }, function(response) {

        //alert(response);
        //alert(response.success);

        if(response.success) {
          $('#logIn').toggle("show");
          clearHTML();
          injectTabGroups();
          //$('#loginInfo').html("");
         //$('#loginInfo').append(text);
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
    
  $.get("http://crossoverdev.parseapp.com/getTabGroups" ,  function(data) {
        doge = data;
        alert(doge.tabGroups[1].title);
        //doge = data.tabGroups;
        //alert(doge[0].url);
        // we can use a for loop now to catch all of the urls and names!   
      }); 


  });


// function to open all tabs
$('#loginInfo').on('click', '#openTab', function() {
     for(i=0; i < userTabs.length; i++){
    chrome.tabs.create({"url": userTabs[i]});
  }
  
  });

// loads the tab groups template into the extension
$('#loginInfo').on('click', '#openGroups', function() {
     injectTabGroups(); 
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
$('#loginInfo').on('click', '#backUserStuff', function() {
    var text = $("#userStuff").html();
    $('#loginInfo').html("");
    $('#loginInfo').append(text);
  });


$('#loginInfo').on('click', '#addView', function() {
    clearHTML();
    injectAddTabs();
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

//Injects tab group template HTML into the viewing area. Uses a for loop to dynamically creat the tab group buttons
function injectTabGroups(){
  var groups = $("#tabGroups").html();
  var groupNum = userGroups.length;
  $('#loginInfo').append(groups);
     
  for(i=0; i < groupNum; i++){
    $('#tabsList').append("<input type='button' class='tabGroupButton popButton' id='group"+ i +"' value='group"+(i+1) +"'/>");
     } 
}

//Injects the add tab view into the viewing area
function injectAddTabs(){
  var text = $("#addTabView").html();
  $('#loginInfo').html("");
  $('#loginInfo').append(text); 
}

function getUserGroups(){
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
}

