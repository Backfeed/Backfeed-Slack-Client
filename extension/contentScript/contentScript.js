//compose iframe
var iframe = document.createElement("iframe");
iframe.setAttribute("src", chrome.extension.getURL("extension/contentScript/app/index.html"));
iframe.setAttribute("frameborder", "0");

$(window).resize(setIframeHeight);

function openAddProjectPage(channelId) {
	chrome.runtime.sendMessage({
		message : {
			"gesture": 'openAddProject',
			"options": channelId
		}
	}, function(response) {
		console.log('Here in the callback from add project page');
	});
}

function openAddMilestonePage(channelId) {
	chrome.runtime.sendMessage({
		message : {
			"gesture": 'openAddMilestone',
			"options": channelId
		}
	}, function(response) {
		console.log('Here in the callback from add milestone page');
	});
}

function openAddContributionPage(channelId) {
	chrome.runtime.sendMessage({
        message : {
            "gesture": 'openAddContributionPage',
            "options": channelId
        }
    }, function(response) {
    	console.log('Here in the callback from add contribution page');
	});
}


function openAddEvaluationPage(contributionId) {
	
	console.log('contributionId is: ' + contributionId);
	chrome.runtime.sendMessage({        
        message : {
            "gesture": 'openAddEvaluationPage',
            "options": contributionId
        }
    }, function(response) {
    	console.log('Here in the callback from add evaluation page');
	});

}

function openContributionStatusPage(contributionId) {
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

$(document).on('click', "#COMPOSE_ACTION_EVALUATION_BUTTON", function() {
	var contributionIdForThisEvaluation = $(this).attr('data-contributionId');
	var textContent = $(this).text();
	if (textContent == 'EVALUATE') {
		openAddEvaluationPage(contributionIdForThisEvaluation);
	} else {
		openContributionStatusPage(contributionIdForThisEvaluation);
	}
});

$(document).on('click', ".member_status_button", function() {
	var memberId = $(this).siblings('.member_details').find('.member_preview_link').data('member-id');
	openMemberStatusPage(memberId);
});

function setIframeHeight() {
	iframe.style.height = document.documentElement.clientHeight + 'px';
}

function windowRefresh(){
	window.location.reload();
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
	console.log("set channelId: "+channelId);
	chrome.storage.sync.set({'channelId':channelId}, function() {
        console.log("set channelId");
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

function onFloatingMenuOpened(nodes) {
	var addedNodes = $(nodes[0].addedNodes);
	if (addedNodes.length > 0) {
		addedNodes.each(function() {
			if (this.id == 'menu') {
				var menuItems = $(this).find('#menu_items');
				var firstMenuItem = menuItems.children(':first-child');
				if (this.classList.contains('file_menu')) {
					addContributionButton.bind(this)();
				} else if (firstMenuItem.is('#member_profile_item') || firstMenuItem.is('#member_prefs_item')) {
					memberStatusButton.bind(this)();
				} else if (firstMenuItem.is('#channel_archives_item')) {
					console.log('comes here');
					addProjectButton.bind(this)();
					console.log('new code changes!');
					addMilestoneButton.bind(this)();
				}

			}
		});
	}
}

function addProjectButton() {
	var menuItemsList = $(this).find('#menu_items');
	var menuItems = menuItemsList.children();
	var channelId = $('#channel-list').find('.active').find('.channel_name').attr('data-channel-id');

	var addProjectButton = menuItems.last().clone().prependTo(menuItemsList);
	addProjectButton.removeAttr('id');
	var buttonLabel = 'Add a Collaborative Project';
	addProjectButton.find('a').html(buttonLabel);
	addProjectButton.on('click', function() {
		openAddProjectPage(channelId);
	});

}

function addMilestoneButton() {
	var menuItemsList = $(this).find('#menu_items');
	var menuItems = menuItemsList.children();
	var channelId = $('#channel-list').find('.active').find('.channel_name').attr('data-channel-id');

	var addMilestoneButton = menuItems.last().clone().prependTo(menuItemsList);
	addMilestoneButton.removeAttr('id');
	var buttonLabel = 'Submit milestone';
	addMilestoneButton.find('a').html(buttonLabel);
	addMilestoneButton.on('click', function() {
		openAddMilestonePage(channelId);
	});

}

function addContributionButton() {
	
	var menuItemsList = $(this).find('#menu_items');
	var channelId = $('#channel-list').find('.active').find('.channel_name').attr('data-channel-id');
	console.log('channelId is '+channelId);

	var menuItems = menuItemsList.children();
	var addContributionButton = menuItems.last().clone().prependTo(menuItemsList);
	addContributionButton.removeAttr('data-which');

	var contributionIcon = chrome.extension.getURL('/extension/contentScript/app/images/icon_contribution.png');
	var buttonLabel = '<img src="' + contributionIcon + '" />&nbsp;&nbsp;Submit Contribution';
	addContributionButton.find('a').attr('href','#').html(buttonLabel);
	addContributionButton.on('click', function() {
		openAddContributionPage(channelId);
	});

	this.style.top = parseInt(this.style.top) - 32 + "px";
}

function memberStatusButton() {
	var menuItemsList = $(this).find('#menu_items');
	var memberId = $(this).find('.member_preview_link').data('member-id');
	var memberStatusButton = $('<li id="member_status_backfeed"><a>Collaborator Overview</a></li>').prependTo(menuItemsList);
	memberStatusButton.on('click', function() {
		openMemberStatusPage(memberId);
	});

}

function onAddEvaluationObservation(mutations) {
	var channelIds = '';
	chrome.storage.sync.get('channelId', function (response) {
		channelIds = response.channelId;
		console.log('channelIds are '+channelIds);
		if(channelIds != undefined) {
			var channelIdsVarArray = channelIds.split(",");
			for (i = 0; i < channelIdsVarArray.length; i++) { 
			    evaluationObservationOnChannelId(channelIdsVarArray[i],mutations);
			}
			
		}
    });
}

/**
 * END: DOM Mutation Observers Callbacks :END
 */
function evaluationObservationOnChannelId(channelId,mutations){

  	
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
					var contributionIcon = chrome.extension.getURL('/extension/contentScript/app/images/icon_contribution.png');
					imageElement.attr('src', contributionIcon);
					var spanChildren = spanElement.children('#COMPOSE_ACTION_EVALUATION_BUTTON');
					if (spanChildren.length == 0){
						var spanText = spanElement.html();
						var originalText = spanText;
						var removalText = "New contribution submitted<br>";
						var indexOfRemovalContent = spanText.indexOf(removalText);
						if (indexOfRemovalContent > -1){
							spanText = spanText.replace(removalText, "");
							var contributionId = spanText.substring(4,spanText.indexOf("<br>"));
							var lengthOfText = removalText.length;
							originalText = originalText.replace(originalText.substring(indexOfRemovalContent+lengthOfText, indexOfRemovalContent+lengthOfText+contributionId.length+4), "");
							$( '.message_content', $(message)).html (originalText);
							var openComposeButton = document.createElement("span");
							openComposeButton.setAttribute("data-contributionId", contributionId);
							openComposeButton.setAttribute("id", "COMPOSE_ACTION_EVALUATION_BUTTON");
							openComposeButton.textContent = "EVALUATE";
							var contributionIdsVar = response.contributionIds;
							contributionIdsVar = contributionIdsVar.substring(1, contributionIdsVar.length-1);
							var contributionIdsVarArray = contributionIdsVar.split(",");
							for (var i = 0; i < contributionIdsVarArray.length; i++) {
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
					var spanChildren = spanElement.children('#COMPOSE_ACTION_EVALUATION_BUTTON');
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

// Single member is shown
var teamMembersListObserver = new MutationObserver(onTeamMembersListObservation);

// More buttons are shown for a single team member in the list of team members
var singleTeamMemberObserver = new MutationObserver(onSingleTeamMemberObservation);

var floatingMenuObserver = new MutationObserver(onFloatingMenuOpened);
var addEvaluationObserver = new MutationObserver(onAddEvaluationObservation);


$(function() {
    document.body.appendChild(iframe);

	floatingMenuObserver.observe(document.getElementById('client-ui'), {childList: true});
	addEvaluationObserver.observe(document.getElementById('msgs_div'), {childList: true});
	teamMembersListObserver.observe(document.getElementById('team_tab'), {attributes: true});


	chrome.runtime.onMessage.addListener(function(msg) {
		if (msg.gesture && msg.gesture in GESTURES) {
			GESTURES[msg.gesture](msg.options)
		}
	});
});
