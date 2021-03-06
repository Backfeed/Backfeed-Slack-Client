angular.module('MyApp')
  .controller('BidsModalCtrl', function($scope,$auth,$location,$stateParams,Users,
		  GetBidTOContribution,SaveBidTOContribution,Account,ContributionDetail,UserDetail,$modalInstance,PostMessageService,$state) {
	  $scope.contributionId = $stateParams.contributionId;
	  $scope.bidId = $stateParams.bidId;
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
				userData = Account.getUserData();
				orgExists = data.orgexists;
                console.log('userData is not defined comes 1 orgExists'+orgExists);
                if (orgExists != 'true') {
                	//navigate to create org screen
                	$state.go('createOrg', {}, {reload: true});
                }else{
                	getContributionForBid();
                }
				
	        })
	        .error(function(error) {
	        	if (error && error.message) {
                    PostMessageService.gesture.showAlert(error.message, 'error');
                } else {
                    PostMessageService.gesture.showAlert('Please relogin', 'error');
                }
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
			 orgExists = userData.orgexists;
             if (orgExists != 'true') {
             	//navigate to create org screen
             	$state.go('createOrg', {}, {reload: true});
             }else{
             	getContributionForBid();
             }
		 }
		 
	// if not authenticated return to splash:
	if(!$auth.isAuthenticated()){
		$location.path('splash'); 
    }

	//$scope.slackUsers = Users.getUsers();
  
   
	function getContributionForBid(){
		if ($scope.contributionId && $scope.contributionId != 0) {
			//check for exsting contribution
			$scope.data3 = GetBidTOContribution.Bid({
				'contributionId':$scope.contributionId,
				'userId' : userData.userId
			});
			$scope.data3.$promise.then(function(result1) {
				 if(result1.bidExists == 'true'){
					 PostMessageService.gesture.showAlert('You already bidded on this contribution.', 'error');
					 //$state.go('contributionStatus', {'contributionId': $scope.contributionId});
				 }else{
					 console.log('comes here'+$scope.contributionId);
						
						console.log('userData.userId'+userData.userId);
						console.log('userData.orgId'+userData.orgId);
						$scope.data2 = UserDetail.getDetail({
							'userId' : userData.userId,'organizationId':userData.orgId 
						});
						$scope.data2.$promise.then(function(result1) {
							console.log('result.reputaion'+result1.reputaion);
							$scope.bid.reputation = result1.reputation;
							$scope.bid.stake = (parseInt(result1.reputation)*18)/100;
						});
						$scope.data1 = ContributionDetail.getDetail({
							contributionId : $scope.contributionId
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

	if($scope.contributionId && $scope.contributionId != 0){
		$scope.bid.contribution_id =$scope.contributionId ;
	}
	
	
	//$scope.users = User.query();

	$scope.submit = function(){
		console.log("In Submit method");
		console.log($scope.bid);

		$scope.data = SaveBidTOContribution.save({},$scope.bid);
		$scope.data.$promise.then(function(result) {
			$modalInstance.close('submit');
			PostMessageService.gesture.showAlert('Evaluation submitted', 'success');
			PostMessageService.gesture.hideIframe($scope.contributionId);
			//$state.go('contributionStatus', {'contributionId': $scope.contributionId});
		}, function(result) {
			$modalInstance.close('submit');
			PostMessageService.gesture.showAlert('You have no reputation! Submit a contribution to gain some.', 'error');
			PostMessageService.gesture.hideIframe();
			//$state.go('contributionStatus', {'contributionId': $scope.contributionId});
		});

	};
	
	
});