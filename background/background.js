console.log("background.js");

function successCTS(response, successId) {
	try {response = JSON.stringify(response)}catch(e){}
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {"response": response, "status": "success", "successId": successId})
	})
}

function errorCTS(response, errorId) {
	try {response = JSON.stringify(response)}catch(e){}
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {"response": response, "status": "error", "errorId": errorId})
	});
}

var sendGesture = function(msg) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, msg)
	});
}

// SERVICE_MAP is define in serviceMap.js

chrome.runtime.onConnect.addListener(function(port) {
  	port.onMessage.addListener(function(msg) {
	    if (msg.service && msg.service in SERVICE_MAP) {
	     	SERVICE_MAP[msg.service](msg.request, msg.successId, msg.errorId);
	    }
	  	if(msg.gesture) {
	  		sendGesture(msg)
	  	}
	});
});

chrome.runtime.onMessage.addListener(function(msg, sender) {
    /* First, validate the message's structure */
    if ((msg.from === 'contentScript')) {
        /* Enable the page-action for the requesting tab */        
		sendGesture(msg.message)
    }
});