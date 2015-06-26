angular.module('MyApp')
  .controller('LogoutCtrl', function($auth, $alert,$location,Account,Users) {
	Account.setUserData(undefined); 
	Users.setAllOrgUsersData(undefined);
    if (!$auth.isAuthenticated()) {
        return;
    }
    $auth.logout()
      .then(function() {
        $alert({
          content: 'You have been logged out',
          animation: 'fadeZoomFadeDown',
          type: 'material',
          duration: 3
        });
		$location.path('splash');
        
      });
  });