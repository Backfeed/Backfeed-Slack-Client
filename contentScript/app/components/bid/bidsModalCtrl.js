angular.module('MyApp')
  .controller('BidsModalCtrl', function($scope,$auth,$location,$stateParams,Users,$alert,
		  SaveBidTOContribution,Account,ContributionDetail,UserDetail,$modalInstance,PostMessageService,$state) {
	  $scope.contributionId = $stateParams.contributionId;
	  $scope.bidId = $stateParams.bidId;
	  
	  $scope.closeModal = function() {
		  $modalInstance.dismiss('cancel');
      };
	 
	  $scope.getProfile = function() {
	      Account.getProfile()
	        .success(function(data) {
				Account.setUserData(data);
				
	        })
	        .error(function(error) {
	        $alert({
	            content: error.message,
	            animation: 'fadeZoomFadeDown',
	            type: 'material',
	            duration: 3
	          });
	        });
	    };
	    $scope.bid = {			
			    tokens : '',
				owner : '',
				reputation : '',
				contribution_id : '',
				stake :''
		};
	  
	     userData = Account.getUserData();
		 console.log("userData is"+userData);
		 if(userData == undefined){
			 $scope.getProfile();
		 }else{
			 $scope.bid.owner = userData.userId;
		 }
		 if ($scope.contributionId && $scope.contributionId != 0) {
			 console.log('comes here'+$scope.contributionId)
				$scope.data1 = ContributionDetail.getDetail({
					contributionId : $scope.contributionId
				});
				$scope.data1.$promise.then(function(result) {
					console.log('result.title'+result.title)
					$scope.title = result.title;
					$scope.tokenName = result.tokenName;
				});
				console.log('userData.userId'+userData.userId)
				console.log('userData.orgId'+userData.orgId)
				$scope.data2 = UserDetail.getDetail({
					'userId' : userData.userId,'organizationId':userData.orgId 
				});
				$scope.data2.$promise.then(function(result) {
					console.log('result.reputaion'+result.reputaion)
					$scope.bid.reputation = result.reputation;
					$scope.bid.stake = (parseInt(result.reputation)*18)/100;
				});
				
				PostMessageService.sendGesture('showIframe');
			}
	// if not authenticated return to splash:
	if(!$auth.isAuthenticated()){
		$location.path('splash'); 
    }

	//$scope.slackUsers = Users.getUsers();
  
   
	
   
                  
              

	if($scope.contributionId && $scope.contributionId != 0){
		$scope.bid.contribution_id =$scope.contributionId ;
	}
	
	
	//$scope.users = User.query();

	$scope.submit = function(){
		console.log("In Submit method");
		 
		console.log($scope.bid)
		$scope.data = SaveBidTOContribution.save({},$scope.bid);
		$scope.data.$promise.then(function (result) {
			$modalInstance.close('submit');
			alert('Bid Successfully created');
			$state.go('contributionStatus', {'contributionId': $scope.contributionId});
			//$location.path("/contributionStatus/"+ $scope.contributionId);
		},	function (result) {
				$modalInstance.close('submit');
				$state.go('contributionStatus', {'contributionId': $scope.contributionId});
				alert('Evaluation was not processed since you have no reputation left to stake for this contribution.');
				//$location.path("/contributionStatus/"+ $scope.contributionId);
			});
		
	};
	
	
});