angular.module('MyApp')
  .config(routes);

function routes($stateProvider) {

  $stateProvider

  .state('evaluations', {

    url: '/evaluations/:contributionId/:projectId',
    templateUrl: chrome.extension.getURL("extension/contentScript/app/components/evaluation/addEvaluation.html"),
    controller: 'EvaluationsCtrl'
    
  });

}