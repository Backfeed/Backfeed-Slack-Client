angular.module('MyApp')
  .controller('SplashCtrl', function($scope, PostMessageService, $auth,$location,Account) {
		var body = document.getElementsByTagName('body')[0];
		var element = angular.element(body);
		element.addClass('splash-background')
    $scope.changeView = function(view){
        $location.path(view); // path not hash

		// remove splash:
		var body = document.getElementsByTagName('body')[0];
		var element = angular.element(body);
		element.removeClass('splash-background')
	 }
	
		$scope.getProfile = function() {
		      Account.getProfile()
		        .success(function(data) {
					console.log('profileData:');
					console.dir(data);
		          	$scope.user = data;
		          	if($scope.user.orgId != ''){
		          						console.log('fpr contribution :');
		          		$scope.changeView('/contributions')
		          	}else{
		          	console.log('for create org');
		          		$scope.changeView('/organization')
		          	}
		          	
					Account.setUserData(data);
					
		        })
		        .error(function(error) {
					  PostMessageService.gesture.showAlert(error.message, 'error');
		        });
		    };
	$scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function() {
			  PostMessageService.gesture.showAlert('You have successfully logged in', 'success');

			  if(Account.getUserData() == undefined){
				console.log('this is empty')
				$scope.getProfile();
			  }
        })
        .catch(function(response) {
			  PostMessageService.gesture.showAlert(response.data ? response.data.message : response, 'error');
        });
    };
	/*
	if ($auth.isAuthenticated()){
		
		$scope.changeView('profile')
	}
*/
	// view background only in splash view
    $scope.isActive = function(route) {
        return route === $location.path();
    }


  });













