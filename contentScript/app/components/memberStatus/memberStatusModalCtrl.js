angular.module('MyApp').controller(
		'MemberStatusModalCtrl',
		function($scope, $auth, $location, $stateParams, MemberStatus,
				Account, Users,$modalInstance,PostMessageService) {

			$scope.memberStatusModel = {
				org_tokens:'',
				org_reputation:'',
				contributionLength : '',
				url : '',
				fullName : '',
				name : '',
				reputationPercentage : '',
				contributions : [ {
					currentValuation : '',
					reputationDelta:'',
					myWeight: '',
					title:'',
					cTime: ''
				} ]
			};

			$scope.sortType     = 'date'; // set the default sort type
			$scope.sortReverse  = false;  // set the default sort order

	        $scope.closeModal = function() {
	            $modalInstance.dismiss('cancel');
	        };	
	        
	        $scope.getMemberStatus = function(){
	        	if ($scope.memberId && $scope.memberId != 0) {
					$scope.memberStatus = MemberStatus.getDetail({
						orgId: $scope.orgId,
						userId: $scope.memberId
					});
					$scope.memberStatus.$promise.then(function(result) {
						$scope.memberStatusModel = result;
					});
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
						$scope.orgId= data.orgId;
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
					$scope.orgId= userData.orgId;
					$scope.getMemberStatus();
				}
				
				

			}

		});
