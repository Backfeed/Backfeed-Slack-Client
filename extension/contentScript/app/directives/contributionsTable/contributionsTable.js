angular.module('MyApp')
  .directive('contributionsTable', contributionsTable);

function contributionsTable() {

  return {

    bindToController: true,
    controllerAs: 'ctrl',
    templateUrl: chrome.extension.getURL("extension/contentScript/app/directives/contributionsTable/contributionsTable.html"),
    controller: contributionsTableController,
    scope: { contributions: '=', code: '=' },
    restrict: 'E'

  };

}

function contributionsTableController($scope) {

}