angular.module('MyApp').controller('MainCtrl',  ["$scope", "$state","PostMessageService", function($scope, $state,PostMessageService) {	
	
	//************    Listen to messages in order to open modal and navigate the App       ************
	function goTo(options) {
		//alert('GetMessageService: goTo: recieved param:'+options );
		console.log('MainCtrl: goTo: received param:'+options );
		if(options == 1){
			console.log('Creating Org');
			$state.go('createOrg');
			PostMessageService.gesture.openIframe();						
		}else if(options == 2){{
			if($state.is('createContribution') == true){
				console.log('Reloading contributions');				
				$state.reload();
				PostMessageService.gesture.openIframe(3);
			}else{
				console.log('Starting contributions');				
				$state.go('createContribution');
				PostMessageService.gesture.openIframe(3);
			}
		}
		
		}
		
	}

	var GESTURES = {
		"openCreateOrg": goTo,"openContributionPage": goTo
	};

	console.log('MainCtrl init');

	var init = function() {
		PostMessageService.init("myport");

		console.log('MainCtrl: init: listening to events. ');

		chrome.runtime.onMessage.addListener(
		    function(request, sender, sendResponse) {
		        console.log(sender.tab ?
		                "from a content script:" + sender.tab.url :
		                "from the extension");

				if(request.gesture && request.gesture in GESTURES) {
					GESTURES[request.gesture](request.options)
				}

		});
  	};
	init();

}]);