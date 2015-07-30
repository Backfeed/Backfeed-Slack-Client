console.log("compose injected...");

//compose iframe
var iframe = document.createElement("iframe");
iframe.setAttribute("src", chrome.extension.getURL("contentScript/app/index.html"));
iframe.setAttribute("frameborder", "0");

$(window).resize(setIframeHeight);

//compose button
var addBidButton = document.createElement("button");
addBidButton.setAttribute("id", "COMPOSE_ACTION_BID_BUTTON");

$(document).on('click', "#COMPOSE_ACTION_BID_BUTTON", function() {
	var contributionIdForThisBid = $(this).attr('data-contributionId');
	openAddBidPage(contributionIdForThisBid);
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
	console.log('contributionId is: ' + contributionId);
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

function setIframeHeight() {
	iframe.style.height = document.documentElement.clientHeight + 'px';
}

var GESTURES = {
	"showIframe": showIframe,
	"hideIframe": hideIframe,
	"showAlert": showAlert
};

function showIframe() {
	console.log('displaying iframe');
	setIframeHeight();
	iframe.style.display = "block";
}

function hideIframe() {
	console.log('hiding iframe');
	iframe.style.display = "none";
}

function showAlert(options) {
	noty({
		layout: 'bottomRight',
		text: options.message,
		type: options.type
	});
}


function init() {

	var addContributionObserver = new MutationObserver(function(nodes) {
		  
		var addedNodes = $(nodes[0].addedNodes);
		if (addedNodes.length > 0) {
			addedNodes.each(function() {
				if (this.id == 'menu') {
					var menuItemsList = $(this).find('#menu_items');
					var menuItems = menuItemsList.children();

					if (menuItems.first().hasClass('file_menu_item')) {
						var addContributionButton = menuItems.last().clone().prependTo(menuItemsList);
						addContributionButton.removeAttr('data-which');
						var buttonLabel = '<img src="' + chrome.extension.getURL('/contentScript/app/images/icon_contribution.png') + '" />'
							+ '  Contribute to '+$('#team_name').html();
						addContributionButton.find('a').attr('href','#').html(buttonLabel);
						addContributionButton.click(openAddContributionPage);

						this.style.top = parseInt(this.style.top) - 32 + "px";
					}
				}				
			});
		}
	});

	addContributionObserver.observe(document.getElementById('client-ui'), {childList: true});


	var addBidObserver = new MutationObserver(function(mutations) {
		  // If current channel is contribution_test
		  if (document.getElementsByClassName('channel_C06GK1Y06')[0].classList.contains('active')) {

			  // in case there is more than one mutation, use only the one with added nodes.
			  var mutationWithAddedNodes = Array.from(mutations).filter(function(mutation) {
				  return mutation.addedNodes.length > 0;
			  })[0];

			  // Fetch only messages sent by a bot
			  var messagesFromBot = Array.from(mutationWithAddedNodes.addedNodes).filter(function(node) {
				  return node.classList && node.classList.contains('bot_message');
			  });

			  messagesFromBot.forEach(function(message) {
					var spanElement = $( '.message_content', $(message));
					var spanChildren = spanElement.children('#COMPOSE_ACTION_BID_BUTTON');
					if (spanChildren.length == 0){
						var spanText = spanElement.html();
						var originalText = spanText;
						var removalText = "New contribution submitted<br>";
						var indexOfRemovalContent = spanText.indexOf(removalText);
						if (indexOfRemovalContent > -1){
							spanText = spanText.replace(removalText, "");
							var contributionId = spanText.substring(5,spanText.indexOf("<br>"));
							var lengthOfText = removalText.length;
							originalText = originalText.replace(originalText.substring(indexOfRemovalContent+lengthOfText, indexOfRemovalContent+lengthOfText+contributionId.length+4), "");
							$( '.message_content', $(message)).html (originalText);

							var openComposeButton = document.createElement("span");
							openComposeButton.setAttribute("id", "COMPOSE_ACTION_BID_BUTTON");
							openComposeButton.setAttribute("data-contributionId", contributionId);
							openComposeButton.textContent = "BID";
							$(openComposeButton).insertBefore(spanElement);
						}
					}
			});
		  }
			
		 
	});

	addBidObserver.observe(document.getElementById('msgs_div'), {childList: true});
		

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
