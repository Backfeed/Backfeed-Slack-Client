angular.module('MyApp').service('PostMessageService', function(Account,$state) {

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
		hideIframe: function(option) {
			self.sendGesture("hideIframe",option);
		},
		showAlert: function(message, type) {
			if (!type) type = 'warning';
			self.sendGesture("showAlert", {message: message, type: type});
		},windowRefresh: function(option) {
			self.sendGesture("windowRefresh", option);
		},setChannelId: function(channelId) {
			self.sendGesture("setChannelId", channelId);
		}
	};

   	this.getProfile = function() {
		Account.getProfile().success(function(data) {
			var projectExists = data.orgexists;
			if (projectExists == 'false') {
				$state.go('addProject', {}, {reload: true});
			}else{
				self.gesture.windowRefresh();
			}			

		}).error(function(error) {
			console.log('getProfile: ' + error.message);
		});
	};
	
   	this.navigateToAddProject = function() {
   		var userData = Account.getUserData();
   		if(userData == undefined){
   			this.getProfile();
   		}else{
   			if (userData.projectExists == 'false') {
   				$state.go('addProject', {}, {reload: true});
			}else{
				self.gesture.windowRefresh();
			}
   		}
   	}

});
