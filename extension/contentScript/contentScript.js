//compose iframe
var iframe = document.createElement("iframe");
iframe.setAttribute("src", chrome.extension.getURL("extension/contentScript/app/index.html"));
iframe.setAttribute("frameborder", "0");

$(window).resize(setIframeHeight);

$(document).on('click', "#COMPOSE_ACTION_EVALUATION_BUTTON", onEvaluationButtonClick);

$(document).on('click', "#COMPOSE_ACTION_MILESTONE_EVALUATION_BUTTON", onMilestoneEvaluationButtonClick);

$(document).on('click', ".member_status_button", onMemberStatusButtonClick);

var GESTURES = {
  "showIframe": showIframe,
  "hideIframeMilstone": hideIframeMilstone,
  "hideIframe": hideIframe,
  "showAlert": showAlert,
  "windowRefresh": windowRefresh,
  "setChannelId":setChannelId
};

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

function onEvaluationButtonClick() {
  var teamName = $('#team_name').html().trim();
  var contributionIdForThisEvaluation = $(this).attr('data-contributionId');
  var textContent = $(this).text();
  if (textContent == 'EVALUATE') {
    openAddEvaluationPage(contributionIdForThisEvaluation,teamName);
  } else {
    openContributionStatusPage(contributionIdForThisEvaluation,teamName);
  }
}

function onMilestoneEvaluationButtonClick() {
  var teamName = $('#team_name').html().trim();
  var mileStoneIdForThisEvaluation = $(this).attr('data-mileStoneId');
  var textContent = $(this).text();
  if (textContent == 'EVALUATE') {
    openAddMileStoneEvaluationPage(mileStoneIdForThisEvaluation,teamName);
  } else {
    openMileStoneStatus(mileStoneIdForThisEvaluation,teamName);
  }
}

function onMemberStatusButtonClick() {
  var teamName = $('#team_name').html().trim();
  var memberId = $(this).siblings('.member_details').find('.member_preview_link').data('member-id');
  openMemberStatusPage(memberId,teamName);
}

function openAddProjectPage(channelId,teamName) {
	chrome.runtime.sendMessage({
		message : {
			"gesture": 'openAddProject',
			"options": channelId
		},teamName : teamName
	}, function(response) {
		console.log('Here in the callback from add project page');
	});
}

function openProjectStatusPage(channelId,teamName) {
	chrome.runtime.sendMessage({
		message : {
			"gesture": 'openProjectStatus',
			"options": channelId
		},teamName : teamName
	}, function(response) {
		console.log('Here in the callback from project status page');
	});	
	
}

function openMileStoneStatus(mileStoneId,teamName) {
	chrome.runtime.sendMessage({
		message : {
			"gesture": 'openMileStoneStatus',
			"options": mileStoneId
		},teamName : teamName
	}, function(response) {
		console.log('Here in the callback from milestone status page');
	});	
	
}


function openAddMilestonePage(channelId,teamName) {
	chrome.runtime.sendMessage({
		message : {
			"gesture": 'openAddMilestone',
			"options": channelId
		},teamName : teamName
	}, function(response) {
		console.log('Here in the callback from add milestone page');
	});
}

function openAddContributionPage(channelId,teamName) {
	chrome.runtime.sendMessage({
        message : {
            "gesture": 'openAddContributionPage',
            "options": channelId
        },teamName : teamName
    }, function(response) {
    	console.log('Here in the callback from add contribution page');
	});
}


function openAddEvaluationPage(contributionId,teamName) {
	
	console.log('contributionId is: ' + contributionId);
	chrome.runtime.sendMessage({        
        message : {
            "gesture": 'openAddEvaluationPage',
            "options": contributionId
        },teamName : teamName
    }, function(response) {
    	console.log('Here in the callback from add evaluation page');
	});

}

function openAddMileStoneEvaluationPage(milestoneId,teamName) {
	
	console.log('milestoneId is: ' + milestoneId);
	chrome.runtime.sendMessage({        
        message : {
            "gesture": 'openAddMileStoneEvaluationPage',
            "options": milestoneId
        },teamName : teamName
    }, function(response) {
    	console.log('Here in the callback from add milestoneId evaluation page');
	});

}

function openContributionStatusPage(contributionId,teamName) {
	console.log('contributionId is: ' + contributionId);
	chrome.runtime.sendMessage({        
        message : {
            "gesture": 'openContributionStatusPage',
            "options": contributionId
        },teamName : teamName
    }, function(response) {
    	console.log('Here in the callback from contribution status page');
	});

}

function openMemberStatusPage(memberId,teamName) {
	chrome.runtime.sendMessage({
		message : {
			"gesture": 'openMemberStatusPage',
			"options": memberId
		},teamName : teamName
	}, function(response) {
		console.log('Here in the callback from member status page');
	});
}

function setIframeHeight() {
	iframe.style.height = document.documentElement.clientHeight + 'px';
}

function windowRefresh(){
	window.location.reload();
}

function showIframe() {
	console.log('displaying iframe');
	setIframeHeight();
	$('iframe[src^="chrome-extension"]').not(iframe).remove();
	iframe.style.display = "block";
}

function hideIframe(options) {
	console.log('hiding iframe'+options);
	iframe.style.display = "none";
	if (options != undefined && options != '') {
		$("span[data-contributionId*="+options+"]").text("STATUS");
	}
}

function hideIframeMilstone(options) {
	console.log('hiding iframe'+options);
	iframe.style.display = "none";
	if (options != undefined && options != '') {
		$("span[data-milestoneid*="+options+"]").text("STATUS");
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
	var teamName = $('#team_name').html().trim();
	chrome.runtime.sendMessage({
		message : 'updateChannelIds',teamName:teamName
	}, function(response) {
		if (response.login == 'true') {
			var teamDirectory = mutations[0].target;
			if (mutations[0].attributeName == 'class' && teamDirectory.classList.contains('active')) {
				if (!document.getElementById('member_preview_container').classList.contains('hidden')) {
					var $memberContainer = $('#member_preview_scroller');
					$memberContainer.append('<div class="top_margin member_status_button"><a class="member_action_button btn btn_outline"><img src="' + chrome.extension.getURL('/extension/contentScript/app/images/collaborator-overview.png') + '" /> Collaborator Overview</a></div>')
				} else {
					$('.team_list_item').each(function(i, teamItem) {
						singleTeamMemberObserver.observe(teamItem, {attributes: true, attributeFilter: ['class']});
					});
				}
			}
		}
		
	});
	
}

function onSingleTeamMemberObservation(mutations) {
	var teamName = $('#team_name').html().trim();
	chrome.runtime.sendMessage({
		message : 'updateChannelIds',teamName:teamName
	}, function(response) {
		if (response.login == 'true') {
			var teamMember = mutations[0].target;
			if (teamMember.classList.contains('expanded')) {
				if ($(teamMember).find('.member_status_button').length == 0) {
					$(teamMember).append('<div class="top_margin member_status_button"><a class="member_action_button btn btn_outline"><img src="' + chrome.extension.getURL('/extension/contentScript/app/images/collaborator-overview.png') + '" /> Collaborator Overview</a></div>')
				}
			} else {
				$(teamMember).find('.member_status_button').remove();
			}
		}
		
	});
	
}

function onFloatingMenuOpened(nodes) {
	var teamName = $('#team_name').html().trim();
	chrome.runtime.sendMessage({
		message : 'updateChannelIds',teamName:teamName
	}, function(response) {
		if (response.login == 'true') {
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
							addProjectButton.bind(this)();
						}

					}
				});
			}
		}
		
	});
}

function addProjectButton() {
	var menuItemsList = $(this).find('#menu_items');
	var menuItems = menuItemsList.children();
	var channelId = $('#channel-list').find('.active').find('.channel_name').attr('data-channel-id');
	var teamName = $('#team_name').html().trim();
	var channelIds = '';
	var channelOrganizationFound = false;
	chrome.storage.sync.get('channelId', function (response) {
		channelIds = response.channelId;
		if(channelIds != undefined) {
			var channelIdsVarArray = channelIds.split(",");
			for (var i = 0; i < channelIdsVarArray.length; i++) {
				if(channelIdsVarArray[i] == channelId){
					channelOrganizationFound = true;
					break;
				}
			}
		}

		if (channelOrganizationFound) {
			var projectStatusButton = menuItems.last().clone().prependTo(menuItemsList);
			var projectStatusButtonIcon = '<img src="' + chrome.extension.getURL('/extension/contentScript/app/images/project-status.png') + '" />';
			var projectStatusButtonLabel = 'Project Status';
			projectStatusButton.removeAttr('id');
			projectStatusButton.find('a').html(projectStatusButtonIcon + '&nbsp;&nbsp;&nbsp;' + projectStatusButtonLabel);

			projectStatusButton.on('click', function() {
				openProjectStatusPage(channelId,teamName);
			});

			var addMilestoneButton = menuItems.last().clone().prependTo(menuItemsList);
			var addMilestoneButtonIcon = '<img src="' + chrome.extension.getURL('/extension/contentScript/app/images/add-milestone.png') + '" />';
			var addMilestoneButtonLabel = 'Submit Milestone';
			addMilestoneButton.removeAttr('id');
			addMilestoneButton.find('a').html(addMilestoneButtonIcon + '&nbsp;&nbsp;&nbsp;' + addMilestoneButtonLabel);

			addMilestoneButton.on('click', function() {
				openAddMilestonePage(channelId,teamName);
			});
		} else {
			var addProjectButton = menuItems.last().clone().prependTo(menuItemsList);
			addProjectButton.removeAttr('id');
			var addProjectButtonIcon = '<img src="' + chrome.extension.getURL('/extension/contentScript/app/images/add-project.png') + '" />';
			var addProjectButtonLabel = 'Add a Collaborative Project';
			addProjectButton.find('a').html(addProjectButtonIcon + '&nbsp;&nbsp;&nbsp;' + addProjectButtonLabel);

			addProjectButton.on('click', function() {
				openAddProjectPage(channelId,teamName);
			});
		}
    });


}

function addMilestoneButton() {
	var menuItemsList = $(this).find('#menu_items');
	var teamName = $('#team_name').html().trim();
	var menuItems = menuItemsList.children();
	var channelId = $('#channel-list').find('.active').find('.channel_name').attr('data-channel-id');

	var addMilestoneButton = menuItems.last().clone().prependTo(menuItemsList);
	addMilestoneButton.removeAttr('id');
	var buttonLabel = 'Submit milestone';
	addMilestoneButton.find('a').html(buttonLabel);
	addMilestoneButton.on('click', function() {
		openAddMilestonePage(channelId,teamName);
	});

}

function addContributionButton() {
	
	var menuItemsList = $(this).find('#menu_items');
	var teamName = $('#team_name').html().trim();
	var channelId = $('#channel-list').find('.active').find('.channel_name').attr('data-channel-id');
	console.log('channelId is '+channelId);

	var menuItems = menuItemsList.children();
	var addContributionButton = menuItems.last().clone().prependTo(menuItemsList);
	addContributionButton.removeAttr('data-which');

	var contributionIcon = chrome.extension.getURL('/extension/contentScript/app/images/icon_contribution.png');
	var buttonLabel = '<img src="' + contributionIcon + '" />&nbsp;&nbsp;Submit Contribution';
	addContributionButton.find('a').attr('href','#').html(buttonLabel);
	addContributionButton.on('click', function() {
		openAddContributionPage(channelId,teamName);
	});

	this.style.top = parseInt(this.style.top) - 32 + "px";
}

function memberStatusButton() {
	var menuItemsList = $(this).find('#menu_items');
	var teamName = $('#team_name').html().trim();
	var memberId = $(this).find('.member_preview_link').data('member-id');
	var memberStatusButton = $('<li id="member_status_backfeed"><a>Collaborator Overview</a></li>').prependTo(menuItemsList);
	memberStatusButton.on('click', function() {
		openMemberStatusPage(memberId,teamName);
	});

}

function onAddEvaluationObservation(mutations) {
	var teamName = $('#team_name').html().trim();
	chrome.runtime.sendMessage({
		message : 'updateChannelIds',teamName:teamName
	}, function(response) {
		if (response.login == 'true') {
			var channelIds = '';
			chrome.storage.sync.get('channelId', function (response) {
				channelIds = response.channelId;
				if(channelIds != undefined) {
					var channelIdsVarArray = channelIds.split(",");
					for (var i = 0; i < channelIdsVarArray.length; i++) {
					    evaluationObservationOnChannelId(channelIdsVarArray[i],mutations);
					}
				}
		    });
		}
		
	});
	
}

/**
 * END: DOM Mutation Observers Callbacks :END
 */
function evaluationObservationOnChannelId(channelId,mutations){

	var teamName = $('#team_name').html().trim();
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
			},teamName:teamName
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
							contributionIdsVar = String(contributionIdsVar);							
							var contributionIdsVarArray = contributionIdsVar.split(",");							
							for (var i = 0; i < contributionIdsVarArray.length; i++) {								
								if(contributionIdsVarArray[i].trim() == contributionId){
									openComposeButton.textContent = "STATUS";
								}
							}
							$(openComposeButton).insertBefore(spanElement);
						}
					}
					var spanChildrenForMileStoneButton = spanElement.children('#COMPOSE_ACTION_MILESTONE_EVALUATION_BUTTON');
					if (spanChildrenForMileStoneButton.length == 0){
						var spanText = spanElement.html();
						var originalText = spanText;
						var indexOfRemovalContent = spanText.indexOf('New MileStone submitted<br>');
						if (indexOfRemovalContent > -1){
							spanText = spanText.replace('New MileStone submitted<br>', "");
							var mileStoneId = spanText.substring(4,spanText.indexOf("<br>"));
							var lengthOfText = 'New MileStone submitted<br>'.length;
							originalText = originalText.replace(originalText.substring(indexOfRemovalContent+lengthOfText, indexOfRemovalContent+lengthOfText+mileStoneId.length+4), "");
							$( '.message_content', $(message)).html (originalText);
							var openComposeButton = document.createElement("span");
							openComposeButton.setAttribute("data-mileStoneId", mileStoneId);
							openComposeButton.setAttribute("id", "COMPOSE_ACTION_MILESTONE_EVALUATION_BUTTON");
							openComposeButton.textContent = "EVALUATE";
							var milesStoneIdsVar = response.milestonesIds;
							milesStoneIdsVar = String(milesStoneIdsVar);
							//milesStoneIdsVar = milesStoneIdsVar.substring(1, milesStoneIdsVar.length-1);
							var milesStoneIdsVarArray = milesStoneIdsVar.split(",");
							for (var i = 0; i < milesStoneIdsVarArray.length; i++) {
								if(milesStoneIdsVarArray[i].trim() == mileStoneId){
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
					var spanChildren = spanElement.children('#COMPOSE_ACTION_MILESTONE_EVALUATION_BUTTON');
					if (spanChildren.length == 0){
						var spanText = spanElement.html();
						var originalText = spanText;
						var indexOfRemovalContent = spanText.indexOf('New MileStone submitted<br>');
						if (indexOfRemovalContent > -1){
							spanText = spanText.replace('New MileStone submitted<br>', "");
							var mileStoneId = spanText.substring(5,spanText.indexOf("<br>"));
							var lengthOfText = 'New MileStone submitted<br>'.length;
							originalText = originalText.replace(originalText.substring(indexOfRemovalContent+lengthOfText, indexOfRemovalContent+lengthOfText+mileStoneId.length+4), "");
							$( '.message_content', $(message)).html(originalText);
						}
					}
				});
			}
		});
	}

}
