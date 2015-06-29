angular.module('MyApp').service('GetMessageService', function () {

	function goTo(options) {
		//document.querySelector("#APP_PREFIX_CLASS_CONTAINER title").innerHTML = title
		//alert('GetMessageService: goTo: recieved param:'+options );
		console.log('GetMessageService: goTo: recieved param:'+options );
		
	}

	var GESTURES = {
		"openCreateOrg": goTo
	}

	this.init = function() {
		console.log('GetMessageService: init: listening to events. ')
		
  		chrome.runtime.onMessage.addListener(function(msg) {
			console.log('GetMessageService: recieved msg: '+msg)
			
			if(msg.gesture && msg.gesture in GESTURES) {
				GESTURES[msg.gesture](msg.options)
			}
		})
  	}

   	this.sendGesture = function(gestureName, opt) {
		/*
   		this.port.postMessage({
			"gesture": gestureName,
			"options": opt
		});
		*/
   	}

   	var self = this;
	/*
   	this.gesture = {
		setTitle: function(title) {
			self.sendGesture("setTitle", title);
		}
	}
  */
});
