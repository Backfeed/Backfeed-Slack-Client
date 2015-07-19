angular.module('MyApp')
  .controller('OrganizationsModalCtrl', function($scope,$auth,$location,$stateParams,SaveOrg,Account,
		  Users,AllSlackUsers,CheckOrgTokenName,AllOrgs,$modalInstance,$state,CheckOrgCode,PostMessageService) {
	  $scope.userData= ''
	  $scope.validationFailureForTokenName = false;
	  $scope.validationFailureForCode = false;
	  $scope.closeModal = function() {
          $modalInstance.dismiss('cancel');
      };
	
	  $scope.orgModel = {
				token_name : '',
				slack_teamid : '',				
				name : '',
				code : ''
			}
	 
	  
	  $scope.organizations = AllOrgs.allOrgs();
	  
	  $scope.getProfile = function() {
	      Account.getProfile()
	        .success(function(data) {
				Account.setUserData(data);
				$scope.userData = Account.getUserData();
				$scope.userId = $scope.userData.userId;
				$scope.orgModel.name = $scope.userData.slackTeamName;
				$scope.orgModel.slack_teamid = $scope.userData.slackTeamId;
				PostMessageService.sendGesture('showIframe');
				
	        })
	        .error(function(error) {
				  PostMessageService.gesture.showAlert(error.message, 'error');
	        });
	    };	    
	     $scope.userData = Account.getUserData();
		 console.log("userData is"+$scope.userData);
		 if($scope.userData == undefined){
			 $scope.getProfile();
		 }else{
			 $scope.userId = $scope.userData.userId;
			 $scope.orgModel.name = $scope.userData.slackTeamName;
			 $scope.orgModel.slack_teamid = $scope.userData.slackTeamId;
			 PostMessageService.sendGesture('showIframe');
		 }
	// if not authenticated return to splash:
	if(!$auth.isAuthenticated()){
		$location.path('splash'); 
    }

	//$scope.slackUsers = Users.getUsers();
  
   
	
   
   $scope.changeTeam = function(){
	   console.log('comes here in logout')
	   $state.go("logout");
	   
   };
   
   
   
  
   
   $scope.orderProp = "name";
	$scope.submit = function(){
		 if($scope.orgModel.token_name != ''){
			   $scope.data1 = CheckOrgTokenName.checkOrgTokenName({
				   tokenName : $scope.orgModel.token_name
				});
				$scope.data1.$promise.then(function(result) {
					if(result.tokenAlreadyExist == 'true'){
						 console.log('comes here in true for token');
						$scope.validationFailureForTokenName = true;
						alert('This name is already taken please use other')
						return
					}else{
						console.log('comes here in false for token');
						$scope.validationFailureForTokenName = false;
						 if($scope.orgModel.code != ''){
							   $scope.data1 = CheckOrgCode.checkOrgCode({
								   code : $scope.orgModel.code
								});
								$scope.data1.$promise.then(function(result) {
									if(result.codeAlreadyExist == 'true'){
										$scope.validationFailureForCode = true;
										alert('This code is already taken please use other')
										return
									}else{
										console.log('comes here in false for token');
										$scope.validationFailureForCode = false;
										console.log("In Submit method");
										console.log($scope.orgModel)
										$scope.data = SaveOrg.save({},$scope.orgModel);
										$scope.data.$promise.then(function (result) {
										
											$scope.userData.orgId = result.organization_id;
											$scope.userData.userOrgId = result.id;
											$scope.userData.orgexists = "true";
											console.log('Inserted org id : '+result.organization_id)
											console.log('Inserted userorg id : '+result.id)
										 	Account.setUserData($scope.userData);
											alert('Successfully created organization');
											$modalInstance.close('submit');
											$state.go("createContribution"); 
											
										});
									}
								});
						   }
					}
				});
		   }
		
				
		
		
		
		
		
		
	};
	
	
});