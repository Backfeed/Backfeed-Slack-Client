angular.module('MyApp')
  .controller('OrganizationCtrl', function($scope,$auth,$alert,$location,$stateParams,SaveOrg,Account,Users,AllSlackUsers,CheckOrgTokenName,AllOrgs) {
	  $scope.userData= ''
      $scope.validationFailure = false;
	 
	
	  $scope.orgModel = {
				token_name : '',
				slack_teamid : '',				
				name : ''

			}
	 
	  
	  $scope.organizations = AllOrgs.allOrgs();
	  
	  $scope.getProfile = function() {
	      Account.getProfile()
	        .success(function(data) {
				Account.setUserData(data);
				$scope.userData = Account.getUserData();
				alert($scope.userData)
				
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
	     $scope.userData = Account.getUserData();
		 console.log("userData is"+$scope.userData);
		 if($scope.userData == undefined){
			 $scope.getProfile();
		 }else{
			 $scope.userId = $scope.userData.userId;
			 $scope.orgModel.name = $scope.userData.slackTeamName;
			 $scope.orgModel.slack_teamid = $scope.userData.slackTeamId;
		 }
	// if not authenticated return to splash:
	if(!$auth.isAuthenticated()){
		$location.path('splash'); 
    }

	//$scope.slackUsers = Users.getUsers();
  
   
	
   
   $scope.changeTeam = function(){
	   console.log('comes here in logout')
	   $location.path("/logout");
	   
   };
   
   
   
   $scope.checkTokenName = function(){
	   if($scope.orgModel.token_name != ''){
		   $scope.data1 = CheckOrgTokenName.checkOrgTokenName({
			   tokenName : $scope.orgModel.token_name
			});
			$scope.data1.$promise.then(function(result) {
				console.log('this is it');				
				if(result.tokenAlreadyExist == 'true'){
					$scope.validationFailure = true;
				}else{
					$scope.validationFailure = false;
				}
			});
	   }
	   
	  
   }
   
   $scope.orderProp = "name";
	$scope.submit = function(){
		if($scope.validationFailure == true){
			alert('This name is already taken please use other')
			return
		}
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
			$location.path("/contribution"); 
			
		});
		
		
		
		
		
	};
	
	
});