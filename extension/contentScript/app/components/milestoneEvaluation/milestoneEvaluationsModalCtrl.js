angular.module('MyApp').controller('MilestoneEvaluationsModalCtrl',
		function($scope, $auth, $location, $stateParams, Users, GetEvaluationOfMilestone,
				 SaveEvaluationToMilestone, Account, MilestoneDetail, UserDetail, $modalInstance,
				 PostMessageService, $state) {
	  $scope.milestoneId = $stateParams.milestoneId;
	  $scope.evaluationId = $stateParams.evaluationId;
	  $scope.projectId = $stateParams.projectId;
	  PostMessageService.hideIframe();
	  
	  $scope.closeModal = function() {
		  $modalInstance.dismiss('cancel');
      };
      $scope.checkNumber = function(num) {
		  $scope.validationPass = !isNaN(parseFloat(num)) && isFinite(num);		  		  
      };
	 
	  $scope.getProfile = function() {
	      Account.getProfile()
	        .success(function(data) {
				Account.setUserData(data);
				var userData = Account.getUserData();
				$scope.evaluation.ownerId = userData.userId;
				$scope.userId = userData.userId;
				
				getMilestoneForEvaluation();
                
				
	        })
	        .error(function(error) {
	        	if (error && error.message) {
                    PostMessageService.showAlert(error.message, 'error');
                } else {
                    PostMessageService.showAlert('Please relogin', 'error');
                }
	        });
	    };
	    $scope.evaluation = {
			    tokens : '',
				owner : '',
				reputation : '',
				milestone_id : '',
				stake :''
		};
	  
	     var userData = Account.getUserData();
		 console.log("userData is"+userData);
		 if(userData == undefined) {
			 $scope.getProfile();
		 } else {
			 $scope.evaluation.ownerId = userData.userId;
			 $scope.userId = userData.userId;
			 getMilestoneForEvaluation();
			 
		 }
		 
	// if not authenticated return to splash:
	if(!$auth.isAuthenticated()){
		$location.path('splash'); 
    }

	//$scope.slackUsers = Users.getUsers();
  
   
	function getMilestoneForEvaluation(){
		if ($scope.milestoneId && $scope.milestoneId != 0) {
			//check for exsting contribution
			$scope.data3 = GetEvaluationOfMilestone.Evaluation({
				'milestoneId':$scope.milestoneId,
				'userId' :  $scope.userId
			});
			$scope.data3.$promise.then(function(result1) {
				if(result1.contributionClose == 'true'){
					 PostMessageService.showAlert('Milestone is closed. It cannot be evaluated anymore.', 'error');
					 $state.go('contributionStatus', {'contributionId': $scope.milestoneId}, {reload: true});
				 }
				else 
				if(result1.bidExists == 'true'){
					 PostMessageService.showAlert('You already evaluated on this milestone.', 'error');
					 $state.go('contributionStatus', {'contributionId': $scope.milestoneId}, {reload: true});
				 }else{
					 console.log('comes here'+$scope.milestoneId);
					 $scope.projectId = result1.organizationId;
						console.log('userData.userId: '+ $scope.userId);
						console.log('userData.projectId: '+$scope.projectId);
						
						$scope.data1 = MilestoneDetail.getDetail({
							'id' : $scope.milestoneId
						});
						$scope.data1.$promise.then(function(result) {
							console.log('result.title'+result.title);
							$scope.title = result.title;
							$scope.tokenName = result.tokenName;
							$scope.code = result.code;
						});
						
						PostMessageService.showIframe();
				 }
				
			});
			
			}
	}

	if($scope.milestoneId && $scope.milestoneId != 0){
		$scope.evaluation.milestone_id =$scope.milestoneId ;
	}
	
	
	//$scope.users = User.query();

	$scope.submit = function(){
		console.log("In Submit method");
		console.log($scope.evaluation);

		$scope.data = SaveEvaluationToMilestone.save({},$scope.evaluation);
		$scope.data.$promise.then(function(result) {
			$modalInstance.close('submit');
			PostMessageService.showAlert('Evaluation submitted', 'success');
			PostMessageService.hideIframeMilstone($scope.milestoneId);
			//$state.go('contributionStatus', {'contributionId': $scope.contributionId}, {reload: true});
		}, function(result) {
			$modalInstance.close('submit');
			PostMessageService.showAlert('You have no reputation! Submit a contribution to gain some.', 'error');
			PostMessageService.hideIframe();
			//$state.go('contributionStatus', {'contributionId': $scope.contributionId});
		});

	};
});
