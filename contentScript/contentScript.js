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
        message : {
            "gesture": 'openAddContributionPage',
            "options": {}
        }
    }, function(response) {
    	console.log('Here in the callback');
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

	var observer = new MutationObserver(function(nodes) {
		var addedNodes = $(nodes[0].addedNodes);
		if (addedNodes.length > 0) {
			addedNodes.each(function() {
				if (this.id == 'menu') {
					var menuItemsList = $(this).find('#menu_items');
					var menuItems = menuItemsList.children();

					var addContributionButton = menuItems.last().clone().prependTo(menuItemsList);
					addContributionButton.removeAttr('data-which');
					addContributionButton.find('a').attr('href','#').text(' Contribute to Backfeed');
					addContributionButton.click(openAddContributionPage);
				}
			});
		}
	});

	observer.observe(document.getElementById('client-ui'), {childList: true});

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
