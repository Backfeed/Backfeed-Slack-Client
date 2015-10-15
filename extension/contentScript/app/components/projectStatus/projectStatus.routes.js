angular.module('MyApp').config(routes);

function routes($stateProvider) {
  $stateProvider

  .state('projectStatus', {

    url: '/projectStatus/:channelId/:milestoneId',
    templateUrl: chrome.extension.getURL("extension/contentScript/app/components/projectStatus/projectStatus.html"),
    controller: 'ProjectStatusCtrl',
    resolve: { userIsAuthenticated: isUserAuthenticated }

  });

  function isUserAuthenticated($auth) {
    if ( !$auth.isAuthenticated() )
      $location.path('splash');
  }

}