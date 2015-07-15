angular.module('MyApp').service('PostMessageService', function(Account,$state,$alert) {

  	this.init = function(portname) {
  		if(arguments.length > 0) {
  			this.port = chrome.runtime.connect({name: portname});
  		}
  	};
   

   	this.sendGesture = function(gestureName, opt) {
   		this.port.postMessage({
			"gesture": gestureName,
			"options": opt
		});
   	};

   	var self = this;
   	this.gesture = {
		showIframe: function(option) {
			self.sendGesture("showIframe", option);
		},
		hideIframe: function() {
			self.sendGesture("hideIframe");
		}
	}

   	this.getProfile = function() {
		Account.getProfile().success(function(data) {
			orgExists = data.orgexists;
			if (orgExists == 'false') {
				$state.go('createOrg', {}, {reload: true});
			}			

		}).error(function(error) {
			$alert({
				content : error.message,
				animation : 'fadeZoomFadeDown',
				type : 'material',
				duration : 3
			});
		});
	};
	
   	this.navigate = function() {
   		userData = Account.getUserData();
   		if(userData == undefined){
   			this.getProfile();
   		}else{
   			if (userData.orgexists == 'false') {
   				$state.go('createOrg', {}, {reload: true}); 				
			}
   		}
   	}

});
