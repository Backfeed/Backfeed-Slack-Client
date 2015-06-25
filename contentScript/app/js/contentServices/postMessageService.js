app.service('PostMessageService', function () {

	var SID = "SID_PROG=",
		EID = "EID_PROG=",
		PROG = 0;

	var ListenerResponse = function(successId, errorId) {
		// l'oggetto ha come stato l'id di successo e di errore

		this.successId = successId;
		this.errorId = errorId;

		this.done = function(callbackSuccess, callbackError) {
			// sta in ascolto sulla risposta del background ed esegue le callback di successo o errore
			// solo se la risposta del server è destinata a queste callback ovvero se l'id della risposta del background
			// e l'id dell'oggetto ListenerResponse combaciano
			var self = this;
		   	chrome.runtime.onMessage.addListener(function(response) {
		   		if(response.response) {
				  	if (response.successId && response.status == "success") {
				  		if(response.successId == self.successId) {
		   					//console.log(response.successId)
		   					try {
		   						response.response = JSON.parse(response.response)
		   					}catch(e){}
				  			callbackSuccess(response.response);
				  		}
				  	}
				  	else if(response.errorId && response.status == "error") {
				  		if(response.errorId ==  self.errorId) {
				  			//console.log(response.errorId)
				  			try {
		   						response.response = JSON.parse(response.response)
		   					}catch(e){}
				  			callbackError(response.response);
				  		}
				  	}
		   		}
			});
		}
	}

  	this.init = function() {
  		if(arguments.length > 0) {
  			this.port = chrome.runtime.connect({name: arguments[0]});
  		}
  	}

   	this.send = function(message) {
   		// invia un messaggio semplice
   		this.port.postMessage(message)
   	}

   	this.action = function(serviceName, httpRequestObject) {
   		// INPUT: invia un messaggio al background con <nome servizio> <corpo della richiesta>
   		// vengono poi generati id univoci monouso di successo e errore relativi alle callback
   		// OUTPUT: ritorna un oggetto ListenerResponse

   		PROG += 1;
   		var successId = SID + PROG;
   		var errorId = EID + PROG;

   		this.port.postMessage({
   			"service": serviceName, 
   			"request": httpRequestObject,
   			"successId": successId,
   			"errorId": errorId
   		})

   		return new ListenerResponse(successId, errorId)
   	}

   	this.sendGesture = function(gestureName, opt) {
   		this.port.postMessage({
			"gesture": gestureName,
			"options": opt
		});
   	}
   	var self = this;
   	this.gesture = {
		collapseCompose: function() {
			self.sendGesture("collapseCompose");
		},
		closeCompose: function() {
			self.sendGesture("closeCompose");
		},
		setTitle: function(title) {
			self.sendGesture("setTitle", title);
		},
		setHeaderColor: function(color) {
			self.sendGesture("setHeaderColor", color);
		}
	}

});
