angular.module('MyApp').controller('MainCtrl', ["$scope", "$state","PostMessageService",
	function($scope, $state, PostMessageService) {
	
	//************    Listen to incoming messages in order to open modal and navigate the App       ************
	function goToAddProject(channelId) {
		console.log('Creating Project');
		//PostMessageService.navigateToAddProject();
		$state.go('addProject', {'channelId': channelId}, {reload: true});
	}
	
	function goToProjectStatus(channelId) {
		console.log('Project Status');
		$state.go('projectStatus', {'channelId': channelId,'mileStoneId': ''}, {reload: true});
	}
	
	function goToMileStoneStatus(mileStoneId) {
		console.log('Project Status from MileStone');
		$state.go('projectStatus', {'channelId': '','mileStoneId': mileStoneId}, {reload: true});
	}

	function goToAddMilestone(channelId) {
		console.log('Creating Milestone');
		//PostMessageService.navigateToAddMilestone(); // NOT IMPLEMENTED
		$state.go('addMilestone', {'channelId': channelId}, {reload: true});
	}

	function goToAddContribution(channelId) {
		console.log('Starting contributions'+channelId);
		$state.go('createContribution', {'channelId': channelId}, {reload: true});
	}
	
	function goToAddEvaluation(contributionId) {
		console.log('Starting evaluations for contributionID: '+contributionId);
		$state.go('evaluations', {'contributionId': contributionId}, {reload: true});
	}
	
	function goToAddMileStoneEvaluation(mileStoneId) {
		console.log('Starting evaluations for mileStoneId: '+mileStoneId);
		$state.go('mileStoneEvaluations', {'mileStoneId': mileStoneId}, {reload: true});
	}
	
	function goToContributionStatus(contributionId) {
		console.log('Starting showing contribution status: '+contributionId);
		$state.go('contributionStatus', {'contributionId': contributionId,'mileStoneId': ''}, {reload: true});
	}

	function goToMemberStatus(memberId) {
		console.log('Starting showing member status: '+memberId);
		$state.go('memberStatus', {'memberId': memberId}, {reload: true});
	}
	
	function showAlert() {
		console.log('Showing Alert');
		PostMessageService.gesture.showAlert('You need to login in order to use the extension. Click the extension icon above.', 'error');
	}
	
	function refreshWindows() {
		console.log('Refresh Windows');
		PostMessageService.gesture.showAlert('Successful authorized. Please continue', 'success');
		PostMessageService.gesture.windowRefresh();
	}
	
	function logout() {
		console.log('Logging Out');
		PostMessageService.gesture.windowRefresh();
	}

	var GESTURES = {
		"openAddProject": goToAddProject,
		"openAddMilestone": goToAddMilestone,
		"openAddContributionPage": goToAddContribution,
		"openAddEvaluationPage": goToAddEvaluation,
		"openAddMileStoneEvaluationPage": goToAddMileStoneEvaluation,
		"showAlertFromMainCtr": showAlert,
		"openContributionStatusPage": goToContributionStatus,
		"openMemberStatusPage": goToMemberStatus,
		"refreshWindows": refreshWindows,
		"openProjectStatus":goToProjectStatus,
		"openMileStoneStatus":goToMileStoneStatus,
		"logout": logout
	};

	console.log('MainCtrl init');

	var init = function() {
		PostMessageService.init("myport");

		console.log('MainCtrl: init: listening to events. ');

		chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
			console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
			if(request.gesture && request.gesture in GESTURES) {
				GESTURES[request.gesture](request.options)
		}
		});
	};
	init();
}]);

