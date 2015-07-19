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


//compose button
var showBidButon = document.createElement("button");
showBidButon.setAttribute("id", "COMPOSE_ACTION_BID_BUTTON");

$(document).on('click', "button#COMPOSE_ACTION_BID_BUTTON", function() {
	contributionIdforThisBid = $(this).attr('data-contributionId');	
	openAddBidPage(contributionIdforThisBid);
});

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

function openAddBidPage(contributionId) {
	console.log('contributionId is'+contributionId);
	chrome.runtime.sendMessage({        
        message : {
            "gesture": 'openAddBidPage',
            "options": contributionId
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
					var buttonLabel = 'Contribute to '+$('#team_name').html();
					addContributionButton.find('a').attr('href','#').text(buttonLabel);
					addContributionButton.click(openAddContributionPage);
				}				
			});
		}
	});
	
	observer.observe(document.getElementById('client-ui'), {childList: true});
	
	var observer1 = new MutationObserver(function(mutations) {
		  $(".message.bot_message").each(function() {    	
				spanElement = $( '.message_content', $( this ) )
				var spanChildren = spanElement.children('#COMPOSE_ACTION_BID_BUTTON');
				if(spanChildren.length == 0){
					spanText = spanElement.html ();
					originalText = spanText;
					var removalText = "new contribution was created:<br>";
					var indexOfRemovalContent = spanText.indexOf(removalText);
					if(indexOfRemovalContent > -1){
						spanText = spanText.replace(removalText, "");
						var contributionId = spanText.substring(5,spanText.indexOf("<br>"));
						var lengthOfText = removalText.length;
						originalText = originalText.replace(originalText.substring(indexOfRemovalContent+lengthOfText, indexOfRemovalContent+lengthOfText+contributionId.length+4), "");
						$( '.message_content', $( this ) ).html (originalText)
						var openComposeButton = document.createElement("button");
						openComposeButton.setAttribute("id", "COMPOSE_ACTION_BID_BUTTON");
						openComposeButton.setAttribute("data-contributionId", contributionId);
						spanElement.append(openComposeButton);
					}
				}
		});		
		 
	});

	observer1.observe(document.getElementById('msgs_div'), {childList: true});
		

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
