angular.module('MyApp').controller(
		'MemberStatusModalCtrl',
		function($scope, $auth, $location, $stateParams, MemberStatus,
				Account, Users,$modalInstance,PostMessageService,$state,Member,MemberStatusForAllOrgs) {
			$scope.selectedOrgId = -1
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
					cTime: '',
					tokenName: '',
					id:''
				} ]
			};

			$scope.sortType     = 'date'; // set the default sort type
			$scope.sortReverse  = false;  // set the default sort order

	        $scope.closeModal = function() {
	            $modalInstance.dismiss('cancel');
	        };	
	        
	        $scope.getMemberStatus = function(){
	        	if ($scope.memberId && $scope.memberId != 0) {
	        		$scope.memberOrgs = Member.getOrgs({
						slackTeamId: $scope.slackTeamId
					});
					$scope.memberStatus = MemberStatusForAllOrgs.getDetail({
						slackTeamId: $scope.slackTeamId,
						userId: $scope.memberId
					});
					$scope.memberStatus.$promise.then(function(result) {
						if($scope.memberId == $scope.slackUserId){
							$scope.memberStatus ='Your';
						}else{
							$scope.memberStatus ='User';
						}
						
						$scope.memberStatusModel = result;
						var allcontributions = $scope.memberStatusModel.contributions;
		                //contPercentage = 100/allcontributers.length;

		                for(i=0;i<allcontributions.length;i++){
		                	allcontributions[i].myWeight = allcontributions[i].myWeight.toFixed(2);
		                }
					});
					PostMessageService.sendGesture('showIframe');
	        	}
	        };
	        
	        $scope.updateTable = function(){
	        	if ($scope.selectedOrgId && $scope.selectedOrgId != -1) {
					$scope.memberStatus = MemberStatus.getDetail({
						orgId: $scope.selectedOrgId,
						userId: $scope.memberId
					});
					$scope.memberStatus.$promise.then(function(result) {
						if($scope.memberId == $scope.slackUserId){
							$scope.memberStatus ='Your';
						}else{
							$scope.memberStatus ='User';
						}
						
						$scope.memberStatusModel = result;
						var allcontributions = $scope.memberStatusModel.contributions;
		                //contPercentage = 100/allcontributers.length;

		                for(i=0;i<allcontributions.length;i++){
		                	allcontributions[i].myWeight = allcontributions[i].myWeight.toFixed(2);
		                }
					});
					PostMessageService.sendGesture('showIframe');
	        	}else{
	        		 $scope.getMemberStatus();
	        	}
	        };
	        
	        $scope.goToStatusPage = function(contributionId){
	        	$state.go('contributionStatus', {'contributionId': contributionId});
	        };
	        	        

			// if not authenticated return to splash:
			if (!$auth.isAuthenticated()) {
				$location.path('splash');
			} else {
				$scope.memberId = $stateParams.memberId;
				
				$scope.getProfile = function() {
					Account.getProfile().success(function(data) {
						$scope.userId = data.userId;
						$scope.slackUserId = data.slackUserId;
						$scope.slackTeamId = data.slackTeamId;
						Account.setUserData(data);
						$scope.getMemberStatus();
					}).error(function(error) {
						PostMessageService.gesture.showAlert('Please relogin', 'error');
					});
				};

				var userData = Account.getUserData();
				console.log("userData is" + userData);
				if (userData == undefined) {
					$scope.getProfile();
				} else {
					$scope.userId = userData.userId;
					$scope.slackUserId = userData.slackUserId;
					$scope.slackTeamId = userData.slackTeamId;
					$scope.getMemberStatus();
				}
				
				

			}

		});