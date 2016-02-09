
var doge = "";
var cat = " this is a  string : www.reddit.com";
var geturl = new RegExp("(http|ftp|https|www)://[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?", "g");


var userTabs = ['http://reddit.com', 'http://google.com', 'http://pcpartpicker.com/'];
var userTabs2 = ['https://www.youtube.com/', 'http://gmail.com', 'http://yahoo.com'];
var userTabs3 = ['http://memebase.com', 'http://http://www.w3schools.com/', 'http://slack.com'];
var userTabs4 = ['http://memebase.com', 'http://http://www.w3schools.com/', 'http://slack.com'];

var userGroups = [userTabs, userTabs2, userTabs3, userTabs4];

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




$('#logIn').click( function() {
  var text = $("#loginStuff").html()
  
   $('#loginInfo').append(text);
   $('#loginInfo').toggle("show");
});


// login page, we also inject the user actions template here
$('#loginInfo').on('click', '#subButton', function() {
  var name = $("#name").val();
  var pass = $("#pass").val();
  var text = $("#userStuff").html();
  //fake@gmail.com 1234
  $.post("http://crossoverdev.parseapp.com/user", {
        email: name,
        password: pass
      }, function(response) {

        //alert(response);
        //alert(response.success);

        if(response.success) {
          $('#logIn').toggle("show");
          $('#loginInfo').html("");
          $('#loginInfo').append(text);
        }
        else {
          alert("Too Bad");
        }
      });

    //try getTabGroup, used to be getTabs
  $.get("http://crossoverdev.parseapp.com/getTabGroupTabs" ,  function(data) {
        alert("Hey I am working");
        //doge = data.tabs;
        doge = data.tabGroups;
        //alert(doge[0].url);
        //alert(doge);     
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
     var groups = $("#tabGroups").html();
     var groupNum = userGroups.length;

     $('#loginInfo').html("");
     $('#loginInfo').append(groups);
     
     for(i=0; i < groupNum; i++){
     $('#tabsList').append("<input type='button' class='tabGroupButton popButton' id='group"+ i +"' value='group"+(i+1) +"'/>");
     }    
  });

$('#loginInfo').on('click', '.tabGroupButton', function() {
     var id = this.id;
     var idNum = parseInt(id[id.length -1]);
     $('#listHolding').html("");

     for(i=0; i < userGroups[idNum].length; i++ ){
        //alert(userGroups[idNum][i]);
        $('#listHolding').append("<p> '"+userGroups[idNum][i] +"'</p>");
    } 

  });


$('#loginInfo').on('click', '#backUserStuff', function() {
    var text = $("#userStuff").html();
    $('#loginInfo').html("");
    $('#loginInfo').append(text);
  });

