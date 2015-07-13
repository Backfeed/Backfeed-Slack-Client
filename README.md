
angularExtensionTemplate
========================
Chrome extension template with angular inside,
a custom html gadget that inject an iframe with angular app inside

<h3>install</h3>

chrome -> options -> extensions -> developer mode ON -> load extension... -> select folder BF-Chrome-Extension -> finish -> 

open for example www.google.com 

Now you wll see an icon B ( BackFeed Slack ) in the Extensions Menu

You will see a Backfeed button also in the slack page

Run `npm install && gulp` command inside folder `contentScript/app/` to build the app's CSS file.


Communication between Content Script and Extension can be seen in following Wiki Link

https://github.com/Backfeed/BF-Chrome-Extension/wiki/Message-Sending-Guide

First Login into https://stagingenviornment.elasticbeanstalk.com and get your satellizer_token from the Resources->Local Storage

and copy that satellizer_token into your extension Resources->Local Storage

Now You can create Contribution while clicking on BF Button ( Located on the right bottom side of page)


<ul>
<li>injected html box draggable
<ul>
  <li>Jquery 2.0</li>
</ul>
</li>
<li>injected iframe with Angular app inside
<ul>
  <li>Bootstrap 3.0</li>
  <li><strong>Angular PostMEssage service: </strong> allow to ajax requests through the background page with asyncronous callback to Angular app</li>
  <li><strong>Angular PostMEssage service: </strong> give you some customizable gesture to interact with compose and with web page </li>
  	<ul>
  		<li>Gesture: set compose title</li>
  		<li>Gesture: close compose</li>
  		<li>Gesture: collapse compose</li>
  		<li>Gesture: change header compose background color</li>
  	</ul>
  <li>Example controller and data binding</li>
</ul>
</li>
</ul>

<h3>Background page</h3>

<ul>
  <li>Message comunication with angular app</li>
  <li>Example desktop notifications</li>
  <li>Example Service for ajax call with callbacks to content script</li>
</ul>

<h3>Popup html </h3>

A simple popup html plain scaffolding example


<h3>Ajax example interaction</h3>

<label>anuglar controller </label>
```js
app.controller('MainCtrl',  ["$scope", "PostMessageService", function($scope, PostMessageService) {

	PostMessageService.init("myport"); // comunication port used with background page for message passing

	PostMessageService.action("exampleService", {username: "marco-p", psw: "1234"})
	.done(function(data){
		console.log("SUCCESS service response ", data)
	},
	function(data){
		console.log("ERROR service response ", data)
	});

}]);
```

<h3>Gesture example interaction</h3>

```js
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
```

<h3>Create your services to make ajax! </h3>

add new js file in js/services and include it in background.html before vendor inclusion

exampleService.js
```js
function my_service_name (request, successId, errorId){
  // code here
  //  for success callback
  successCTS(my_result, successId);
  
  // for error callback
  errorCTS(my_result, errorId);
}
```

background.html
```html
	<html>
	<head>
		<!-- services -->
		<script src="js/services/my_service_name.js"></script>
	
		<!-- vendor -->
		<script src="js/serviceMap.js"></script>
		<script src="js/background.js"></script>
	</head>
	</html>
```

- successCTS and errorCTS are two functions that send to content script the callback<br>
- exampleService is mapped in serviceMap.js file

```js
SERVICE_MAP = {
	"my_service_name": my_service_name,
	...
}

```
and it automatically called when angular app call it by name

<h3>composeConfig.js</h3>

Your gadget has an action button to open it and some specific GUI parameters that you can find in composeConfig.js

```js
var Config = {
	actionButtonSelector: "body", // action button querySelector to inject action button
	draggable: true, // gadget draggable
	collapse: true, // gadget collapsable
	close: true, // gadget closable
}
```
