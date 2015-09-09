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
  window.close();
});

$(document).ready(function(){
	   $('body').on('click', 'a', function(){
	     chrome.tabs.create({url: $(this).attr('href')});
	     return false;
	   });
	});

$(document).on('click', '#logout', function() {
  localStorage.clear();
  chrome.storage.sync.remove('channelId', function () {
      console.log("remove channelId")
  });
  chrome.runtime.sendMessage({message: 'logout'});
  window.close();
  //loadView();
});

$(document).on('click', '#backfeed-token-submit', function() {
	  localStorage.clear();
	  var token = $('#backfeed-token-input').val();
	  console.log('token: ', token);
	  chrome.storage.sync.remove('channelId', function () {
	      console.log("remove channelId")
	  });
	  chrome.runtime.sendMessage({message: 'submitToken',token:token});
	  window.close();
	  //loadView();
	});