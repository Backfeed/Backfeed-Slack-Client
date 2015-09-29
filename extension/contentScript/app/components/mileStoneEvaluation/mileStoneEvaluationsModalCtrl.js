angular.module('MyApp').controller('MileStoneEvaluationsModalCtrl',
		function($scope, $auth, $location, $stateParams, Users, GetEvaluationOfMileStone,
				 SaveEvaluationToMileStone, Account, MileStone, UserDetail, $modalInstance,
				 PostMessageService, $state) {
	  $scope.mileStoneId = $stateParams.mileStoneId;
	  $scope.evaluationId = $stateParams.evaluationId;
	  $scope.projectId = $stateParams.projectId;
	  PostMessageService.sendGesture('hideIframe');
	  
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
				
				getMileStoneForEvaluation();
                
				
	        })
	        .error(function(error) {
	        	if (error && error.message) {
                    PostMessageService.gesture.showAlert(error.message, 'error');
                } else {
                    PostMessageService.gesture.showAlert('Please relogin', 'error');
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
			 getMileStoneForEvaluation();
			 
		 }
		 
	// if not authenticated return to splash:
	if(!$auth.isAuthenticated()){
		$location.path('splash'); 
    }

	//$scope.slackUsers = Users.getUsers();
  
   
	function getMileStoneForEvaluation(){
		if ($scope.mileStoneId && $scope.mileStoneId != 0) {
			//check for exsting contribution
			$scope.data3 = GetEvaluationOfMileStone.Evaluation({
				'mileStoneId':$scope.mileStoneId,
				'userId' :  $scope.userId
			});
			$scope.data3.$promise.then(function(result1) {
				if(result1.bidExists == 'true'){
					 PostMessageService.gesture.showAlert('You already evaluated on this milestone.', 'error');
					 //$state.go('contributionStatus', {'contributionId': $scope.contributionId}, {reload: true});
				 }else{
					 console.log('comes here'+$scope.mileStoneId);
					 $scope.projectId = result1.organizationId;
						console.log('userData.userId: '+ $scope.userId);
						console.log('userData.projectId: '+$scope.projectId);
						$scope.data2 = UserDetail.getDetail({
							userId: $scope.userId,
							projectId: $scope.projectId
						});
						$scope.data2.$promise.then(function(result1) {
							console.log('result.reputation'+result1.reputation);
							$scope.evaluation.reputation = result1.reputation;
							$scope.evaluation.stake = (parseInt(result1.reputation)*5)/100;
						});
						$scope.data1 = MileStone.getDetail({
							id : $scope.mileStoneId
						});
						$scope.data1.$promise.then(function(result) {
							console.log('result.title'+result.title);
							$scope.title = result.title;
							$scope.tokenName = result.tokenName;
							$scope.code = result.code;
						});
						
						PostMessageService.sendGesture('showIframe');
				 }
				
			});
			
			}
	}

	if($scope.mileStoneId && $scope.mileStoneId != 0){
		$scope.evaluation.milestone_id =$scope.mileStoneId ;
	}
	
	
	//$scope.users = User.query();

	$scope.submit = function(){
		console.log("In Submit method");
		console.log($scope.evaluation);

		$scope.data = SaveEvaluationToMileStone.save({},$scope.evaluation);
		$scope.data.$promise.then(function(result) {
			$modalInstance.close('submit');
			PostMessageService.gesture.showAlert('Evaluation submitted', 'success');
			PostMessageService.gesture.hideIframeMilstone($scope.mileStoneId);
			//$state.go('contributionStatus', {'contributionId': $scope.contributionId}, {reload: true});
		}, function(result) {
			$modalInstance.close('submit');
			PostMessageService.gesture.showAlert('You have no reputation! Submit a contribution to gain some.', 'error');
			PostMessageService.gesture.hideIframe();
			//$state.go('contributionStatus', {'contributionId': $scope.contributionId});
		});

	};
});
