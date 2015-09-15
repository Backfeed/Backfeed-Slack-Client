angular.module('MyApp')
.directive('contributionsTable', contributionsTable);

function contributionsTable() {

  return {

    templateUrl: 'js/directives/contributionsTable/contributionsTable.html',
    controller: contributionsTableController,
    scope: { contributions: '=', activeContribution: '=' },
    restrict: 'E'

  };

}

function contributionsTableController($scope) {
  console.log(' ************** hello from contributions table! **************');
}