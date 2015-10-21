angular.module('MyApp')
.directive('contributorsList', contributorsList);

function contributorsList(_DEV) {

  log = _DEV.log("CONTRIBUTERS DIRECTIVE");

  return {

    bindToController: true,
    templateUrl: chrome.extension.getURL("extension/contentScript/app/directives/contributorsList/contributorsList.html"),
    controllerAs: 'ctrl',
    controller: contributorsListController,
    scope: { contributors: '=' },
    restrict: 'E'

  };

}

function contributorsListController() {
  log('init');
}