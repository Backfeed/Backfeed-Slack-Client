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


function loginComplete(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

        chrome.tabs.sendMessage(tabs[0].id, {
            "gesture": 'openAddOrganization',
            "options": {}
        }, function(response) {
            console.log(response.farewell);
        });
        
    });	
}



// slack login :
$(document).on('click', 'button#OAuth', function() {
    
    console.log('OAuth dance initiated');
	chrome.runtime.sendMessage({message: 'beginOAuth'});
  
	//loginComplete();
});

$(document).on('click', '#logout', function() {
  localStorage.clear();
  //loadView();
});