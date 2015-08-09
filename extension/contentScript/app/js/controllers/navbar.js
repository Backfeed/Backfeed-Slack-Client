angular.module('MyApp').controller('NavbarCtrl',
		function($scope, $auth, Account, PostMessageService, $location) {

			$scope.createOrg = function() {
				console.log("Create Org");
				$location.path("/organization");
			};

			$scope.isAuthenticated = function() {
				return $auth.isAuthenticated();
			};
			$scope.ifOrgExists = function() {
				if (Account.getUserData() != undefined) {					
					$scope.user = Account.getUserData();
					console.log(Account.getUserData().orgexists)
					if (Account.getUserData().orgexists == 'false') {
						return false;
					} else {
						return true;
					}
				}

			};

			$scope.getProfile = function() {
				Account.getProfile().success(function(data) {
					$scope.user = data;
					Account.setUserData(data);
				}).error(function(error) {
					PostMessageService.gesture.showAlert(error.message, 'error');
				});
			};

			$scope.user = {
				displayName : "profile"
			};

			if ($auth.isAuthenticated() == true) {
				if (Account.getUserData() == undefined) {
					$scope.getProfile()
				}
			}
		});