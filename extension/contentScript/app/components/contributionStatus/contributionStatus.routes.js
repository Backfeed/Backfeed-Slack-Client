angular.module('MyApp')
  .config(routes);

function routes($stateProvider) {
  $stateProvider

 .state('contributionStatus', {
    url: '/contributionStatus/:contributionId/:milestoneId',
    templateUrl: chrome.extension.getURL("extension/contentScript/app/components/contributionStatus/contributionStatus.html"),
    controller: 'ContributionStatusCtrl'
  });

}