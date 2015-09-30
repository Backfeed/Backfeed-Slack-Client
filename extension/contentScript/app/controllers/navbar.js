angular.module('MyApp').controller('NavbarCtrl',
		function($scope, $auth, Account, PostMessageService, $location) {

			$scope.addProject = function() {
				console.log("Create Project");
				$location.path("/project");
			};

			$scope.isAuthenticated = function() {
				return $auth.isAuthenticated();
			};

			$scope.ifProjectExists = function() {
				if (Account.getUserData() != undefined) {					
					$scope.user = Account.getUserData();
					console.log(Account.getUserData().projectExists);
					return Account.getUserData().projectExists != 'false';
				}

			};

			$scope.getProfile = function() {
				Account.getProfile().success(function(data) {
					$scope.user = data;
					Account.setUserData(data);
				}).error(function(error) {
					PostMessageService.showAlert(error.message, 'error');
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