// app.service('ExampleService', function() {});

function exampleService(request, successId, errorId) {
	console.log("request: ", request);
	setTimeout(function(){
		new Notification('Angular loaded notification', {
			icon: '../../icon.png',
			body: 'Boom baby!'
		});
		successCTS({"utente": "marco" + successId}, successId);
	},3000)
}