angular.module('MyApp')
  .config(routes);

function routes($stateProvider) {

  $stateProvider

  .state('addMilestone', {
    
    url: '/milestone/:channelId',
    templateUrl: chrome.extension.getURL("extension/contentScript/app/components/milestone/addMilestone.html"),
    controller: 'MilestoneCtrl'

  });

}