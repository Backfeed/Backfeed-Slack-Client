angular.module('MyApp')
  .directive('usersList', usersList);

function usersList() {

  return {

    bindToController: true,
    controllerAs: 'ctrl',
    templateUrl: chrome.extension.getURL("extension/contentScript/app/directives/usersList/usersList.html"),
    controller: usersListController,
    scope: { users: '=', remainingUsers: '=' },
    restrict: 'E'

  };

}

function usersListController() {

}