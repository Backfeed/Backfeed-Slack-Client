angular.module('MyApp').controller('MainCtrl',  ["$scope", "$state","PostMessageService", function($scope, $state,PostMessageService) {	
	
	//************    Listen to messages in order to open modal and navigate the App       ************
	function goToAddOrganization() {
		console.log('Creating Org');
		$state.go('createOrg');
		PostMessageService.gesture.showIframe();
	}

	function goToAddContribution() {
		console.log('Starting contributions');
		$state.go('createContribution', {}, {reload: true});
		PostMessageService.gesture.showIframe();
	}

	var GESTURES = {
		"openAddOrganization": goToAddOrganization,
		"openAddContributionPage": goToAddContribution
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

			//if (request.greeting == "hello")
			//    sendResponse({farewell: "goodbye"});
		});
	};
	init();
}]);

//************************


/*
 PostMessageService.init("myport");

 PostMessageService.action("exampleService", {username: "marco-p", psw: "1234"})
 .done(function(data){
 console.log("SUCCESS service response ", data)
 },
 function(data){
 console.log("ERROR service response ", data)
 });

 PostMessageService.action("exampleService", {username: "simone-p", psw: "1234"})
 .done(function(data){
 console.log("ksadpasdsa ", data)
 },
 function(data){
 console.log("ioasjdoasj ", data)
 });

 PostMessageService.action("exampleService", {username: "beppe-p", psw: "1234"})
 .done(function(data){
 console.log("----------> ", data)
 },
 function(data){
 console.log("---------> ", data)
 });

 $scope.closeCompose = function() {
 PostMessageService.gesture.closeCompose();
 }

 $scope.collapseCompose = function() {
 PostMessageService.gesture.collapseCompose();
 }

 $scope.setTitleCompose = function(title) {
 PostMessageService.gesture.setTitle(title);
 }

 $scope.changeHeaderColor = function() {
 PostMessageService.gesture.setHeaderColor("crimson");
 }
 */
