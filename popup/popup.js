// Listens for messages sent from app.js
chrome.runtime.onMessage.addListener(function(request,sender,sendResponse) {

  switch (request.msg) {
    case 'setBadgeSuccess':
      break;
    case 'setBadgeError':
      break;
    default:
      break;
  }
});


// slack login :
$(document).on('click', 'button#OAuth', function() {
    
    console.log('OAuth dance initiated');
    //chrome.extension.sendRequest({msg: 'beginOAuth'});


    // temp: open create org :
    //alert('login under construction ..., for the meantime we skip login straight into creating the org.');

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

        chrome.tabs.sendMessage(tabs[0].id, {
            "gesture": 'openAddOrganization',
            "options": {}
        }, function(response) {
            console.log(response.farewell);
        });
        
    });

});
