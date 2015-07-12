console.log("compose injected...");

//compose iframe
var iframe = document.createElement("iframe");
iframe.setAttribute("src", chrome.extension.getURL("contentScript/app/index.html"));
iframe.setAttribute("frameborder", "0");

iframe.addEventListener('load', function(e) {
    iframe.style.height = document['body'].offsetHeight + 'px';
});

//compose button
var showIframeButton = document.createElement("button");
showIframeButton.setAttribute("id", "COMPOSE_ACTION_BUTTON");

function openAddContributionPage() {
	chrome.runtime.sendMessage({
        from:    'contentScript',
        message : {
            "gesture": 'openAddContributionPage',
            "options": {}
        }
    }, function(response) {
		showIframe();
	});
}

function showIframe() {
    console.log('displaying iframe');
	iframe.style.display = "block";
}

function hideIframe() {
    console.log('hiding iframe');
    iframe.style.display = "none";
}

var GESTURES = {
	"showIframe": showIframe,
	"hideIframe": hideIframe
};

function init() {
	var buttonReady = setInterval(function(){
		if (document.querySelector(Config.actionButtonSelector).appendChild){
			document.querySelector(Config.actionButtonSelector).appendChild(showIframeButton);
			showIframeButton.onclick = openAddContributionPage;
			clearInterval(buttonReady);
		}
	}, 100);

	chrome.runtime.onMessage.addListener(function(msg) {		
		if (msg.gesture && msg.gesture in GESTURES) {
			GESTURES[msg.gesture](msg.options)
		}
	});
}

var ready = setInterval(function() {
    document.body.appendChild(iframe);
    init();
    clearInterval(ready);
} ,500);
