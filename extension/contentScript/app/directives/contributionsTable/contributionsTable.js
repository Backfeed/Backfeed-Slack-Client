angular.module('MyApp')
.directive('contributionsTable', contributionsTable);

function contributionsTable() {

  return {

    templateUrl: chrome.extension.getURL("extension/contentScript/app/directives/contributionsTable/contributionsTable.html"),
    controller: contributionsTableController,
    scope: { contributions: '=' },
    restrict: 'E'

  };

}

function contributionsTableController($scope) {
  console.log(' ************** hello from contributions table! **************');
}