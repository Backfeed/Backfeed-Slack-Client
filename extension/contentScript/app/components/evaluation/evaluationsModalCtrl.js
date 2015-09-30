angular.module('MyApp').controller('EvaluationsModalCtrl',
		function($scope, $auth, $location, $stateParams, Users, GetEvaluationOfContribution,
				 SaveEvaluationToContribution, Account, ContributionDetail, UserDetail, $modalInstance,
				 PostMessageService, $state) {
	  $scope.contributionId = $stateParams.contributionId;
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
				$scope.userId = userData.userId;
				//orgExists = data.orgexists;
                //console.log('userData is not defined comes 1 orgExists'+orgExists);
				getContributionForEvaluation();
                /*if (orgExists != 'true') {
                	//navigate to create org screen
                	$state.go('addProject', {}, {reload: true});
                }else{
                	getContributionForEvaluation();
                }*/
				
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
				contribution_id : '',
				stake :''
		};
	  
	     var userData = Account.getUserData();
		 console.log("userData is"+userData);
		 if(userData == undefined) {
			 $scope.getProfile();
		 } else {
			 $scope.evaluation.ownerId = userData.userId;
			 $scope.userId = userData.userId;
			 getContributionForEvaluation();
			 /*orgExists = userData.projectExists;
             if (orgExists != 'true') {
             	//navigate to create org screen
             	$state.go('addProject', {}, {reload: true});
             }else{
             	getContributionForEvaluation();
             }*/
		 }
		 
	// if not authenticated return to splash:
	if(!$auth.isAuthenticated()){
		$location.path('splash'); 
    }

	//$scope.slackUsers = Users.getUsers();
  
   
	function getContributionForEvaluation(){
		if ($scope.contributionId && $scope.contributionId != 0) {
			//check for exsting contribution
			$scope.data3 = GetEvaluationOfContribution.Evaluation({
				'contributionId':$scope.contributionId,
				'userId' :  $scope.userId
			});
			$scope.data3.$promise.then(function(result1) {
				if(result1.contributionClose == 'true'){
					 PostMessageService.showAlert('Contribution is closed. It cannot be evaluated anymore.', 'error');
					 $state.go('contributionStatus', {'contributionId': $scope.contributionId}, {reload: true});
				 }
				else if(result1.bidExists == 'true'){
					 PostMessageService.showAlert('You already evaluated on this contribution.', 'error');
					 $state.go('contributionStatus', {'contributionId': $scope.contributionId}, {reload: true});
				 }else{
					 console.log('comes here'+$scope.contributionId);
					 $scope.projectId = result1.organizationId;
						console.log('userData.userId: '+ $scope.userId);
						console.log('userData.projectId: '+$scope.projectId);						
						$scope.data1 = ContributionDetail.getDetail({
							contributionId : $scope.contributionId
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

	if($scope.contributionId && $scope.contributionId != 0){
		$scope.evaluation.contribution_id =$scope.contributionId ;
	}
	
	
	//$scope.users = User.query();

	$scope.submit = function(){
		console.log("In Submit method");
		console.log($scope.evaluation);

		$scope.data = SaveEvaluationToContribution.save({},$scope.evaluation);
		$scope.data.$promise.then(function(result) {
			$modalInstance.close('submit');
			PostMessageService.showAlert('Evaluation submitted', 'success');
			PostMessageService.hideIframe($scope.contributionId);
			//$state.go('contributionStatus', {'contributionId': $scope.contributionId}, {reload: true});
		}, function(result) {
			$modalInstance.close('submit');
			PostMessageService.showAlert('You can\'t evaluate a contribution without having reputation! Submit a valuable contribution to gain some.', 'error');
			PostMessageService.hideIframe();
			//$state.go('contributionStatus', {'contributionId': $scope.contributionId});
		});

	};
});
