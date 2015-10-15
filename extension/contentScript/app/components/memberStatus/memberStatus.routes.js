angular.module('MyApp')
  .config(routes);

function routes($stateProvider) {

  $stateProvider

  .state('memberStatus', {
    
    url: '/memberStatus/:memberId',
    templateUrl: chrome.extension.getURL("extension/contentScript/app/components/memberStatus/memberStatus.html"),
    controller: 'MemberStatusCtrl'

  });

}