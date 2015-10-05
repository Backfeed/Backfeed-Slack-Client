angular.module('MyApp')
.directive('contributorsList', contributorsList);

function contributorsList(_DEV) {

  log = _DEV.log("CONTRIBUTERS DIRECTIVE");

  return {

    templateUrl: chrome.extension.getURL("extension/contentScript/app/directives/contributorsList/contributorsList.html"),
    controller: contributorsListController,
    scope: { contributors: '=', contributorsCount: '=' },
    restrict: 'E'

  };

}

function contributorsListController() {
  log('init');
}