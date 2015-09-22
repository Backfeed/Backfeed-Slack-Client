angular.module('MyApp')
.directive('contributionsTable', contributionsTable);

function contributionsTable() {

  return {

    templateUrl: 'directives/contributionsTable/contributionsTable.html',
    controller: contributionsTableController,
    scope: { contributions: '=' },
    restrict: 'E'

  };

}

function contributionsTableController($scope) {
  console.log(' ************** hello from contributions table! **************');
}