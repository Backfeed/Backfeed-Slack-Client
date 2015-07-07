console.log("compose injected...");

//compose iframe
var iframe = document.createElement("iframe");
iframe.setAttribute("src", chrome.extension.getURL("contentScript/app/index.html"));
iframe.setAttribute("frameborder", "0");

iframe.addEventListener('load', function(e) {
    iframe.style.height = document['body'].offsetHeight + 'px';
});

//compose button
var openComposeButton = document.createElement("button");
openComposeButton.setAttribute("id", "COMPOSE_ACTION_BUTTON");

function openCompose() {
    iframe.style.display = "block";
}

function closeCompose() {
    iframe.style.display = "none";
}

var GESTURES = {
	"openCompose":openCompose,
	"closeCompose":closeCompose
};

function init() {
	buttonReady = setInterval(function(){
		if(document.querySelector(Config.actionButtonSelector).appendChild){
			document.querySelector(Config.actionButtonSelector).appendChild(openComposeButton);
			openComposeButton.onclick = openCompose;
			clearInterval(buttonReady);
		}
	}, 100);

	chrome.runtime.onMessage.addListener(function(msg) {
		if(msg.gesture && msg.gesture in GESTURES) {
			GESTURES[msg.gesture](msg.options)
		}
	})
}

var ready = setInterval(function() {
    document.body.appendChild(iframe);
    init();
    clearInterval(ready);
} ,500);
