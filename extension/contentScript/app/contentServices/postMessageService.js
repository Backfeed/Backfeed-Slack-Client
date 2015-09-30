angular.module('MyApp').service('PostMessageService', PostMessageService);

function PostMessageService($window, $state, Account) {

  var service = {

    init: init,
    hideIframe: hideIframe,
    showIframe: showIframe,
    hideIframeMilstone: hideIframeMilstone,
    showAlert: showAlert,
    setChannelId: setChannelId,
    windowRefresh: windowRefresh

  };

  return service;

  function init(portname) {

    if (!portname) 
      return;

    $window.port = $window.chrome.runtime.connect({
      name: portname
    });
    
  }

  function hideIframe(option) {
    sendGesture("hideIframe", option);
  }

  function showIframe(option) {
    sendGesture("showIframe", option);
  }

  function hideIframeMilstone(option) {
    sendGesture("hideIframeMilstone", option);
  }

  function windowRefresh(option) {
    sendGesture("windowRefresh", option);
  }

  function setChannelId(channelId) {
    sendGesture("setChannelId", channelId);
  }

  function showAlert(message, type) {

    type = type || 'warning';

    sendGesture("showAlert", {
      message: message,
      type: type
    });

  }

  function sendGesture(gestureName, opt) {
    $window.port.postMessage({
      gesture: gestureName,
      options: opt
    });
  }

}