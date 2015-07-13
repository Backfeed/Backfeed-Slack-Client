console.log("background.js");

var sendGesture = function(msg) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, msg)
	});
}

chrome.runtime.onConnect.addListener(function(port) {
  	port.onMessage.addListener(function(msg) {	   
	  	if(msg.gesture) {
	  		sendGesture(msg)
	  	}
	});
});

chrome.runtime.onMessage.addListener(function(msg, sender) {
		sendGesture(msg.message)    
});