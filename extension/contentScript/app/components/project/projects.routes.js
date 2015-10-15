angular.module('MyApp')
  .config(routes);

function routes($stateProvider) {

  $stateProvider

  .state('addProject', {
    url: '/project/:channelId',
    templateUrl: chrome.extension.getURL("extension/contentScript/app/components/project/addProject.html"),
    controller: 'ProjectsCtrl'
  });

}