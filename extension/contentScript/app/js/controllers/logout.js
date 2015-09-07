angular.module('MyApp')
  .controller('LogoutCtrl', function($auth, PostMessageService, $location, Account, Users) {
	Account.setUserData(undefined); 
	Users.setAllProjectUsersData(undefined);

    if (!$auth.isAuthenticated()) {
        return;
    }

    $auth.logout().then(function() {
      PostMessageService.gesture.showAlert('You have been logged out', 'information');
      $location.path('splash');
    });
  });