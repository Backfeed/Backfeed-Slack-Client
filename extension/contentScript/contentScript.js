console.log("compose injected...");

//compose iframe
var iframe = document.createElement("iframe");
iframe.setAttribute("src", chrome.extension.getURL("extension/contentScript/app/index.html"));
iframe.setAttribute("frameborder", "0");

$(window).resize(setIframeHeight);

//compose button
var addBidButton = document.createElement("button");
addBidButton.setAttribute("id", "COMPOSE_ACTION_BID_BUTTON");

$(document).on('click', "#COMPOSE_ACTION_BID_BUTTON", function() {
	var contributionIdForThisBid = $(this).attr('data-contributionId');
	var textContent = $(this).text();
	if (textContent == 'BID') {
		openAddBidPage(contributionIdForThisBid);
	} else {
		openShowContributionStatusPage(contributionIdForThisBid);
	}
});

$(document).on('click', ".member_status_button", function() {
    var memberId = $(this).siblings('.member_details').find('.member_preview_link').data('member-id');
    openMemberStatusPage(memberId);
});

function openMemberStatusPage(memberId) {
    chrome.runtime.sendMessage({
        message : {
            "gesture": 'openMemberStatusPage',
            "options": memberId
        }
    }, function(response) {
        console.log('Here in the callback from member status page');
    });
}

function openAddContributionPage() {
	chrome.runtime.sendMessage({
        message : {
            "gesture": 'openAddContributionPage',
            "options": {}
        }
    }, function(response) {
    	console.log('Here in the callback from add contribution page');
	});
}

function windowRefresh(){
	window.location.reload();
}

function openAddBidPage(contributionId) {
	
	console.log('contributionId is: ' + contributionId);
	chrome.runtime.sendMessage({        
        message : {
            "gesture": 'openAddBidPage',
            "options": contributionId
        }
    }, function(response) {
    	console.log('Here in the callback from add bid page');
	});

}


function openShowContributionStatusPage(contributionId) {
	
	console.log('contributionId is: ' + contributionId);
	chrome.runtime.sendMessage({        
        message : {
            "gesture": 'openContributionStatusPage',
            "options": contributionId
        }
    }, function(response) {
    	console.log('Here in the callback from contribution status page');
	});

}

function setIframeHeight() {
	iframe.style.height = document.documentElement.clientHeight + 'px';
}

var GESTURES = {
	"showIframe": showIframe,
	"hideIframe": hideIframe,
	"showAlert": showAlert,
	"windowRefresh": windowRefresh,
	"setChannelId":setChannelId
};

function showIframe() {
	console.log('displaying iframe');
	setIframeHeight();
	iframe.style.display = "block";
}

function hideIframe(options) {
	console.log('hiding iframe'+options);
	iframe.style.display = "none";
	if (options != undefined && options != '') {
		$("span[data-contributionId*="+options+"]").text("STATUS");
	}
}

function setChannelId(channelId) {
	console.log("set channelId"+channelId )
	chrome.storage.sync.set({'channelId':channelId}, function () {
        console.log("set channelId")
    });
}

function showAlert(options) {
	noty({
		layout: 'bottomRight',
		text: options.message,
		type: options.type
	});
}


/**
 * START: DOM Mutation Observers Callbacks :START
 */

function onTeamMembersListObservation(mutations) {
	var teamDirectory = mutations[0].target;
	if (mutations[0].attributeName == 'class' && teamDirectory.classList.contains('active')) {
		if (!document.getElementById('member_preview_container').classList.contains('hidden')) {
			var $memberContainer = $('#member_preview_scroller');
			$memberContainer.append('<div class="top_margin member_status_button"><a class="member_action_button btn btn_outline">Collaborator Overview</a></div>')
		} else {
			$('.team_list_item').each(function(i, teamItem) {
				singleTeamMemberObserver.observe(teamItem, {attributes: true, attributeFilter: ['class']});
			});
		}
	}
}

function onSingleTeamMemberObservation(mutations) {
	var teamMember = mutations[0].target;
	if (teamMember.classList.contains('expanded')) {
		if ($(teamMember).find('.member_status_button').length == 0) {
			$(teamMember).append('<div class="top_margin member_status_button"><a class="member_action_button btn btn_outline">Collaborator Overview</a></div>')
		}
	} else {
		$(teamMember).find('.member_status_button').remove();
	}
}

function onAddContributionObservation(nodes) {
	var addedNodes = $(nodes[0].addedNodes);
	if (addedNodes.length > 0) {
		addedNodes.each(function() {
			if (this.id == 'menu') {
				var menuItemsList = $(this).find('#menu_items');
				var menuItems = menuItemsList.children();

				if (menuItems.first().hasClass('file_menu_item')) {
					var addContributionButton = menuItems.last().clone().prependTo(menuItemsList);
					addContributionButton.removeAttr('data-which');
					var buttonLabel = '<img src="' + chrome.extension.getURL('/extension/contentScript/app/images/icon_contribution.png') + '" />'
						+ '&nbsp;&nbsp;Submit Contribution';
					addContributionButton.find('a').attr('href','#').html(buttonLabel);
					addContributionButton.click(openAddContributionPage);

					this.style.top = parseInt(this.style.top) - 32 + "px";
				}
			}
		});
	}
}

function onAddBidObservation(mutations) {
	var channelId = '';
	chrome.storage.sync.get('channelId', function (response) {
		channelId = response.channelId;
		if(channelId != undefined){
			  console.log("channelId is "+channelId)
				var channelNode = document.getElementsByClassName('channel_'+channelId);
		        //check whether user is login slack extension
				if (channelNode.length > 0 && channelNode[0].classList.contains('active')) {
					// in case there is more than one mutation, use only the one with added nodes.
					var mutationWithAddedNodes = Array.from(mutations).filter(function(mutation) {
						return mutation.addedNodes.length > 0;
					})[0];
			
					// Fetch only messages sent by a bot
					var messagesFromBot = Array.from(mutationWithAddedNodes.addedNodes).filter(function(node) {
						return node.classList && node.classList.contains('bot_message');
					});
					chrome.runtime.sendMessage({
						message : {
							"gesture": 'checkUserLogin',
							"options": {}
						}
					}, function(response) {
						if (response.login == 'true') {
							messagesFromBot.forEach(function(message) {
								var spanElement = $( '.message_content', $(message));
								var imageElement = $('img', $(message));
								imageElement.attr('src',chrome.extension.getURL('/extension/contentScript/app/images/icon_contribution.png'));
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
										openComposeButton.setAttribute("data-contributionId", contributionId);
										openComposeButton.setAttribute("id", "COMPOSE_ACTION_BID_BUTTON");
										openComposeButton.textContent = "BID";
										var contributionIdsVar = response.contributionIds;
										contributionIdsVar = contributionIdsVar.substring(1, contributionIdsVar.length-1);
										var contributionIdsVarArray = contributionIdsVar.split(",");
										for (i = 0; i < contributionIdsVarArray.length; i++) {
											if(contributionIdsVarArray[i].trim() == contributionId){
												openComposeButton.textContent = "STATUS";
											}
										}
										$(openComposeButton).insertBefore(spanElement);
									}
								}
							});
			
						} else {
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
										$( '.message_content', $(message)).html(originalText);
									}
								}
							});
						}
					});
				}
		}
      
    });
	
}

/**
 * END: DOM Mutation Observers Callbacks :END
 */


// Single member is shown
var teamMembersListObserver = new MutationObserver(onTeamMembersListObservation);

// More buttons are shown for a single team member in the list of team members
var singleTeamMemberObserver = new MutationObserver(onSingleTeamMemberObservation);

var addContributionObserver = new MutationObserver(onAddContributionObservation);
var addBidObserver = new MutationObserver(onAddBidObservation);


$(function() {
    document.body.appendChild(iframe);

	addContributionObserver.observe(document.getElementById('client-ui'), {childList: true});
	addBidObserver.observe(document.getElementById('msgs_div'), {childList: true});
	teamMembersListObserver.observe(document.getElementById('team_tab'), {attributes: true});


	chrome.runtime.onMessage.addListener(function(msg) {
		if (msg.gesture && msg.gesture in GESTURES) {
			GESTURES[msg.gesture](msg.options)
		}
	});
});
