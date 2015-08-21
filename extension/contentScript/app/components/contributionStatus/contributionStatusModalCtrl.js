angular.module('MyApp').controller(
		'ContributionStatusModalCtrl',
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
		            } ],
		            contributionContributers : [ {
		            	contributer_percentage : '',
		            	name:'',
		            	real_name: '',
		            	url:''
		            } ]
				};

	        $scope.closeModal = function() {
	            $modalInstance.dismiss('cancel');
	        };	
	        
	        $scope.getContributionStatus = function(){
	        	if ($scope.contributionId && $scope.contributionId != 0 && $scope.userId && $scope.userId != 0) {
					$scope.contributionStatus = ContributionStatus.getDetail({
						id : $scope.contributionId,userId : $scope.userId
					});
					$scope.contributionStatus.$promise.then(function(result) {
						$scope.cotributionStatusModel = result;
					});
					PostMessageService.sendGesture('showIframe');
	        	}
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
						$scope.getContributionStatus();

					}).error(function(error) {
						PostMessageService.gesture.showAlert(error.message, 'error');
					});
				};
				userData = Account.getUserData();
				console.log("userData is" + userData);
				if (userData == undefined) {
					$scope.getProfile();
				} else {
					$scope.userId = userData.userId;
					$scope.getContributionStatus();
				}
				
				

			}

		});
