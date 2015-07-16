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
	chrome.runtime.sendMessage({message: 'beginOAuth'});
  
});

$(document).on('click', '#logout', function() {
  localStorage.clear();
  //loadView();
});