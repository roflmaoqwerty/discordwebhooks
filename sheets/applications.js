//POST_URL - The webhook URL. Copy paste this from discord
var WEBHOOK_URL = ""; 

//SHEET_URL the URL of the google sheet responses tab. Make sure it includes the gid at the end
var SHEET_URL = "";
    
//The question where the users username should be
var USERNAME_FIELD = 1;

//Dictonary of question numbers and aliases to include in the webhook message. Format is Question number: Field Title (will appear above response)
//Keep in mind that the character limit for field titles is 256, and the field values (question response) is 1024.
var DISPLAYED_QUESTIONS = {
  2: "User ID",
  5: "User Timezone"
};

function onSubmit(e) {
  var sheet = SpreadsheetApp.getActiveSheet();
  var response = sheet.getSheetValues(e.range.rowStart, 1, 1, sheet.getLastColumn())[0];
  var title;
  var items = [];
  
  let userName = response[USERNAME_FIELD].toString().length < 50 ? response[USERNAME_FIELD] : response[USERNAME_FIELD].toString().substring(0,50)+"...";

  //check if response is new or edited. If the edit is by the lastest user, and they have edited their username, it will show up as new anyway
  if(e.range.rowStart != sheet.getLastRow() || (e.range.rowStart == sheet.getLastRow() && !e.values[USERNAME_FIELD])){
    title = userName + " Edited their response!";
  }
  else{
    title = "New application from " + userName;
  }
  
  for(var key in DISPLAYED_QUESTIONS){
    items.push({
      "name": DISPLAYED_QUESTIONS[key],
      "value": response[key],
      "inline": false
    });
  }
  
  var options = {
    "method": "post",
    "headers": {
      "Content-Type": "application/json",
    },
    "payload": JSON.stringify({
      "embeds": [{
        "title": title,
        "fields": items,
        "url": SHEET_URL + "&range=A" + e.range.rowStart,
        "footer": {
          "text": ""
        }
      }]
    })
  };
  
  UrlFetchApp.fetch(WEBHOOK_URL, options);
};