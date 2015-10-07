angular.module('MyApp')
  .config(routes);

function routes($stateProvider) {
  $stateProvider

  .state('createContribution', {
      url: '/contribution/:channelId',
      templateUrl: chrome.extension.getURL("extension/contentScript/app/components/contribution/addContribution.html"),
      controller: 'ContributionsCtrl'
  })

}