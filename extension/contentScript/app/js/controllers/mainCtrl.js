angular.module('MyApp').controller('MainCtrl', ["$scope", "$state","PostMessageService", function($scope, $state, PostMessageService) {
	
	//************    Listen to incoming messages in order to open modal and navigate the App       ************
	function goToAddOrganization() {
		console.log('Creating Org');
		PostMessageService.navigateToCreateOrg();
		//$state.go('createOrg', {}, {reload: true});
	}

	function goToAddContribution(channelId) {
		console.log('Starting contributions'+channelId);
		$state.go('createContribution', {'channelId': channelId}, {reload: true});
	}
	
	function goToAddBid(contributionId) {
		console.log('Starting bids for contributionID: '+contributionId);
		$state.go('bids', {'contributionId': contributionId}, {reload: true});
	}
	
	function goToContributionStatus(contributionId) {
		console.log('Starting showing contribution status: '+contributionId);
		$state.go('contributionStatus', {'contributionId': contributionId}, {reload: true});
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
		PostMessageService.gesture.windowRefresh();
	}
	
	function logout() {
		console.log('Logging Out');
		PostMessageService.gesture.windowRefresh();
	}

	var GESTURES = {
		"openAddOrganization": goToAddOrganization,
		"openAddContributionPage": goToAddContribution,
		"openAddBidPage": goToAddBid,
		"showAlertFromMainCtr": showAlert,
		"openContributionStatusPage": goToContributionStatus,
		"openMemberStatusPage": goToMemberStatus,
		"refreshWindows": refreshWindows,
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

