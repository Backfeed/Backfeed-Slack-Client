angular.module('MyApp').service('PostMessageService', function () {

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
		openIframe: function(option) {
			self.sendGesture("openIframe",option);
		},
		closeIframe: function() {
			self.sendGesture("closeIframe");
		}
	}

});
