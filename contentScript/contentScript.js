console.log("compose injected...");

//compose elements
var container = document.createElement("div")
var header = document.createElement("header")
var headerContainer = document.createElement("div")
var title = document.createElement("title")
var close = document.createElement("span")
var collapse = document.createElement("span")
var iframe = document.createElement("iframe")

//compose button
var openComposeButton = document.createElement("button")

openComposeButton.setAttribute("id", "COMPOSE_ACTION_BUTTON")
container.setAttribute("id", "APP_PREFIX_CLASS_CONTAINER")
headerContainer.setAttribute("class", "header-container")
close.setAttribute("class", "close")
collapse.setAttribute("class", "collapse")

iframe.setAttribute("src", chrome.extension.getURL("contentScript/app/index.html"))
iframe.setAttribute("width", "100%")
iframe.setAttribute("height", "100%")

headerContainer.appendChild(title)
if(Config.close) {
	headerContainer.appendChild(close)
}
if(Config.collapse) {
	headerContainer.appendChild(collapse)
}
header.appendChild(headerContainer)

container.appendChild(header)
container.appendChild(iframe)

function closeCompose() {
	container.style.display = "none"
}

function openCompose() {
	container.style.display = "block"
}

function collapseCompose() {
	if(container.style.height != "0px"){
		container.style.height = "0px"
	}else {
		container.style.height = "460px"
	}
}

function setHeaderColor(color) {
	header.style.backgroundColor = color;
}

function setTitle(title) {
	document.querySelector("#APP_PREFIX_CLASS_CONTAINER title").innerHTML = title
}

var GESTURES = {
	"setTitle": setTitle,
	"collapseCompose": collapseCompose,
	"closeCompose": closeCompose,
	"setHeaderColor": setHeaderColor,
}

function init() {
	buttonReady = setInterval(function(){
		if(document.querySelector(Config.actionButtonSelector).appendChild){
			document.querySelector(Config.actionButtonSelector).appendChild(openComposeButton)
			openComposeButton.onclick = openCompose
			clearInterval(buttonReady)
		}
	}, 100)

	collapse.onclick = collapseCompose

	close.onclick = closeCompose

	if(Config.draggable) {
		$(container).draggable({
			axis: "x",
			containment: "body",
			handle: "header"
		});
	}

	chrome.runtime.onMessage.addListener(function(msg) {
		if(msg.gesture && msg.gesture in GESTURES) {
			GESTURES[msg.gesture](msg.options)
		}
	})
}

var ready = setInterval(function(){
	if(document.getElementsByTagName("body").length > 0){
		document.getElementsByTagName("body")[0].appendChild(container)
		init();
		clearInterval(ready)
	}
},500)