angular.module('MyApp')
.directive('contributersList', contributersList);

console.log('NEw DIRECTIVE ********************************************************************')

function contributersList(_DEV) {

  log = _DEV.log("CONTRIBUTERS DIRECTIVE");

  return {

    templateUrl: 'directives/contributersList/contributersList.html',
    controller: contributersListController,
    scope: { contributers: '=', contributersCount: '=' },
    restrict: 'E'

  };

}

function contributersListController() {
  log('init');
}