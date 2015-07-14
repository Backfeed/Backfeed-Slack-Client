angular.module('MyApp').controller(
		'ContributionStatusModalCtrl',
		function($scope, $auth, $location, $stateParams, $alert, ContributionStatus,				
				Account, Users,$modalInstance,PostMessageService) {			
			$scope.cotributionStatusModel = {
					currentValuation : '',
					totalReputaion : '',
					myValuation : '',
					myReputaion : ''					

				}

	        $scope.closeModal = function() {
	            $modalInstance.dismiss('cancel');
	        };	
			// if not authenticated return to splash:
			if (!$auth.isAuthenticated()) {
				$location.path('splash');
			} else {
												
				$scope.contributionId = $stateParams.contributionId;
				$scope.getProfile = function() {
					Account.getProfile().success(function(data) {
						$scope.userId = data.userId;
						Account.setUserData(data);

					}).error(function(error) {
						$alert({
							content : error.message,
							animation : 'fadeZoomFadeDown',
							type : 'material',
							duration : 3
						});
					});
				};
				userData = Account.getUserData();
				console.log("userData is" + userData);
				if (userData == undefined) {
					$scope.getProfile();
				} else {
					$scope.userId = userData.userId;
				}
				if ($scope.contributionId && $scope.contributionId != 0 && $scope.userId && $scope.userId != 0) {
					$scope.data1 = ContributionStatus.getDetail({
						id : $scope.contributionId,userId : $scope.userId
					});
					$scope.data1.$promise.then(function(result) {
						$scope.cotributionStatusModel = result;
					});
					PostMessageService.sendGesture('showIframe');
				}
				

			}

		});
