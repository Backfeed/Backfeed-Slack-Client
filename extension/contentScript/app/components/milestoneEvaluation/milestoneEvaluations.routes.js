angular.module('MyApp')
  .config(routes);

function routes($stateProvider) {

  $stateProvider

  .state('milestoneEvaluations', {

    url: '/milestoneEvaluations/:milestoneId/:projectId',
    templateUrl: chrome.extension.getURL("extension/contentScript/app/components/milestoneEvaluation/addMilestoneEvaluation.html"),
    controller: 'MilestoneEvaluationsCtrl'
    
  });

}