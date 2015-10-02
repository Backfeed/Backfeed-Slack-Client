angular.module('MyApp').controller('MemberStatusModalCtrl', MemberStatusModalCtrl);

function MemberStatusModalCtrl ($scope, $auth, $location, $stateParams, MemberStatus, _DEV,
		 Account, $modalInstance,PostMessageService,$state,Member,MemberStatusForAllProjects) {

	var log = _DEV.log('Member Status');

	$scope.selectedProjectId = '';
	$scope.memberStatusModel = {
		project_tokens:'',
		project_reputation:'',
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
			id:'',
			owner:''
		} ]
	};

	$scope.sortType     = 'date'; // set the default sort type
	$scope.sortReverse  = false;  // set the default sort order

	$scope.closeModal = function() {
		$modalInstance.dismiss('cancel');
	};

	$scope.getMemberStatus = function(){
		if ($scope.memberId && $scope.memberId != 0) {
			$scope.memberProjects = Member.getProjects({
				slackTeamId: $scope.slackTeamId
			});
			$scope.memberStatus = MemberStatusForAllProjects.getDetail({
				slackTeamId: $scope.slackTeamId,
				userId: $scope.memberId
			});
			$scope.memberStatus.$promise.then(function(result) {
				$scope.memberStatusTitle = $scope.memberId == $scope.slackUserId ? 'Your' : 'Member';
				$scope.showTokens = false;
				$scope.memberStatusModel = result;

				log(result);

				var allContributions = $scope.memberStatusModel.contributions;

				for(var i=0;i<allContributions.length;i++){
					allContributions[i].myWeight = allContributions[i].myWeight.toFixed(2);
				}
			});
			PostMessageService.sendGesture('showIframe');
		}
	};

	$scope.updateTable = function() {
		if ($scope.selectedProjectId && $scope.selectedProjectId != -1) {
			$scope.memberStatus = MemberStatus.getDetail({
				projectId: $scope.selectedProjectId,
				userId: $scope.memberId
			});
			$scope.memberStatus.$promise.then(function(result) {
				$scope.showTokens = true;
				$scope.memberStatusModel = result;

				log(result);

				var allContributions = $scope.memberStatusModel.contributions;

				for(var i=0;i<allContributions.length;i++){
					allContributions[i].myWeight = allContributions[i].myWeight.toFixed(2);
				}
			});
			PostMessageService.sendGesture('showIframe');
		} else {
			 $scope.getMemberStatus();
		}
	};

	$scope.goToStatusPage = function(contributionId){
		$state.go('contributionStatus', {'contributionId': contributionId});
	};

	$scope.checkOwner = function(owner) {
		return owner == $scope.userId;
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
		log("userData is" + userData);
		if (userData == undefined) {
			$scope.getProfile();
		} else {
			$scope.userId = userData.userId;
			$scope.slackUserId = userData.slackUserId;
			$scope.slackTeamId = userData.slackTeamId;
			$scope.getMemberStatus();
		}



	}

}
