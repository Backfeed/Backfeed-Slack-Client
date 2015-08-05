angular.module('MyApp').controller(
		'MemberStatusModalCtrl',
		function($scope, $auth, $location, $stateParams, ContributionStatus,
				Account, Users,$modalInstance,PostMessageService) {
			$scope.cotributionStatusModel = {
					file:'',
					title:'',
					currentValuation : '',
					myWeight : '',
					myValuation : '',
					reputationDelta : '',
					groupWeight : '',
					bids : [ {
						time_created : '',
		                tokens:'',
		                reputation: '',
		                contribution_value_after_bid:''
		            } ]
				};

	        $scope.closeModal = function() {
	            $modalInstance.dismiss('cancel');
	        };	
	        
	        $scope.getMemberStatus = function(){
	        	if ($scope.memberId && $scope.memberId != 0) {
					//$scope.contributionStatus = ContributionStatus.getDetail({
					//	id: $scope.contributionId,
					//	userId: $scope.userId
					//});
					//$scope.contributionStatus.$promise.then(function(result) {
					//	$scope.cotributionStatusModel = result;
					//});
					PostMessageService.sendGesture('showIframe');
	        	}
	        };
			// if not authenticated return to splash:
			if (!$auth.isAuthenticated()) {
				$location.path('splash');
			} else {
				$scope.memberId = $stateParams.memberId;
				$scope.getProfile = function() {
					Account.getProfile().success(function(data) {
						$scope.userId = data.userId;
						Account.setUserData(data);
						$scope.getMemberStatus();

					}).error(function(error) {
						PostMessageService.gesture.showAlert(error.message, 'error');
					});
				};

				var userData = Account.getUserData();
				console.log("userData is" + userData);
				if (userData == undefined) {
					$scope.getProfile();
				} else {
					$scope.userId = userData.userId;
					$scope.getContributionStatus();
				}
				
				

			}

		});
