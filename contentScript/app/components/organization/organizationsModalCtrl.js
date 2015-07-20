angular.module('MyApp')
  .controller('OrganizationsModalCtrl', function($scope,$auth,$location,$stateParams,SaveOrg,Account,
		  Users,AllSlackUsers,CheckOrgTokenName,AllOrgs,$modalInstance,$state,CheckOrgCode,PostMessageService) {
	  $scope.userData= ''
	  $scope.validationFailureForTokenName = false;
	  $scope.validationFailureForCode = false;
	  $scope.buttonDisabled = true;
	  PostMessageService.gesture.hideIframe();
	  $scope.closeModal = function() {
          $modalInstance.dismiss('cancel');
      };
	
	  $scope.orgModel = {
				token_name : '',
				slack_teamid : '',				
				name : '',
				code : '',
				token :'',
				contributers : [ {
	                contributer_id : '0',
	                contributer_percentage : '100',
	                contributer_name:'',
	                contribution1: '50',
	                img:'/contentScript/app/images/icon-dude.png'
	            } ]
			}
	 
	  
	  $scope.organizations = AllOrgs.allOrgs();
	  
	  $scope.getOrgUsers = function() {
          $scope.data = AllSlackUsers.allSlackUsers();
          $scope.data.$promise.then(function(result) {
              $scope.users = result;
              $scope.updatedUsersList = $scope.users;
              for(i = 0 ; i<$scope.users.length ; i++){
                  if($scope.users[i].id == $scope.userData.slackUserId ){
                      $scope.orgModel.contributers[0].img =  $scope.users[i].url;
                      $scope.orgModel.contributers[0].contributer_name =  $scope.users[i].name;
                      break;
                  }
              }
          });
      };
	  
	  $scope.getProfile = function() {
	      Account.getProfile()
	        .success(function(data) {
				Account.setUserData(data);
				$scope.userData = Account.getUserData();
				$scope.userId = $scope.userData.userId;
				$scope.userName = $scope.userData.displayName;
				$scope.orgModel.name = $scope.userData.slackTeamName;
				$scope.orgModel.slack_teamid = $scope.userData.slackTeamId;
				$scope.orgModel.contributers[0].contributer_id = $scope.userData.slackUserId;
				$scope.orgModel.contributers[0].contributer_name = $scope.userData.displayName;
                $scope.getOrgUsers();
                PostMessageService.gesture.showIframe();
				
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
             $scope.orgModel.contributers[0].contributer_id = $scope.userData.slackUserId;
             $scope.orgModel.contributers[0].contributer_name = $scope.userData.displayName;
             $scope.getOrgUsers();
             PostMessageService.gesture.showIframe();
		 }
		 $scope.getOrgUsers();
		 $scope.updateContributer = function(selectedUserId) {
             if(selectedUserId == ''){
                 return;
             }
             $scope.addCollaborator(selectedUserId);
             urlImage = '';
             userName = '';
             for(i = 0 ; i<$scope.users.length ; i++){
                 if($scope.users[i].id == selectedUserId ){
                     urlImage =  $scope.users[i].url;
                     userName = $scope.users[i].name;
                     break;
                 }
             }

             allcontributers = $scope.orgModel.contributers;

             for(i=0;i<allcontributers.length;i++){
                 if(allcontributers[i].contributer_id == 0 && allcontributers[i].contributer_percentage == ''){
                     allcontributers[i].contributer_id = selectedUserId;
                     allcontributers[i].img = urlImage;

                 }
             }
             $scope.changeContribution(selectedUserId,userName);



         };
         
         $scope.changeContribution = function(contributerId,userName) {
             totalContribution = 0;
             allcontributers = $scope.orgModel.contributers;
             valid = true;
             console.log('userName is '+userName);
             if(allcontributers.length){
                 valid = false;
             }
             
             for(i=0;i<allcontributers.length;i++){
					if(allcontributers[i].contributer_id != 0){
						 if(allcontributers[i].contributer_id != contributerId){
	                            //totalEarlierRemaining = totalEarlierRemaining + +allcontributers[i].contributer_percentage
	                        }else{
	                            if(userName != ''){
	                                allcontributers[i].contributer_name = userName;
	                            }


	                        }
						totalContribution = totalContribution + +allcontributers[i].contribution1;
					}else{
						valid = false;								
					}
				}
             
             for(i=0;i<allcontributers.length;i++){
					if(allcontributers[i].contributer_id != 0){
						allcontributers[i].contributer_percentage = ((allcontributers[i].contribution1/totalContribution)*100).toFixed(2);
					}
				}
             
             

             $scope.buttonDisabled = valid;

         };
         
         $scope.removeCollaboratorItem = function(contributerId,index) {
             $scope.orgModel.contributers.splice(index, 1);
             $scope.changeContribution(contributerId,'');
             allcontributers = $scope.orgModel.contributers;
             $scope.updatedUsersList = [];
             $scope.selectedContributerId = '';
             for(i = 0 ; i<$scope.users.length ; i++){
                 userExist = false;
                 for(j=0;j<allcontributers.length;j++){
                     if($scope.users[i].id == allcontributers[j].contributer_id ){
                         userExist = true;
                         break;
                     }
                 }
                 if(userExist == false){
                     $scope.updatedUsersList.push($scope.users[i]);
                 }
             }
         };
         
         $scope.addCollaborator = function(selectedUserId) {
             console.log('comes here in add'+selectedUserId);
             allcontributers = $scope.orgModel.contributers;
             $scope.updatedUsersList = [];
             $scope.selectedContributerId = '';
             for(i = 0 ; i<$scope.users.length ; i++){
                 if($scope.users[i].id == selectedUserId){
                     continue;
                 }
                 userExist = false;
                 for(j=0;j<allcontributers.length;j++){
                     if($scope.users[i].id == allcontributers[j].contributer_id){
                         userExist = true;
                         break;
                     }
                 }
                 if(userExist == false){
                     $scope.updatedUsersList.push($scope.users[i]);
                 }
             }
             $scope.orgModel.contributers.push({
                 contributer_id:'0',
                 contributer_percentage:'',
                 contributer_name:'',
                 contribution1:'50',
                 img:'/contentScript/app/images/avatar.png'
             }) ;
             $scope.buttonDisabled = true;
         };
         
         $scope.formatSelectUser = function (data) {
             if (!data) return;
             if (!data.url) data.url = "images/icon-dude.png";
             return  "<img src='" + data.url +"' /><span>"+ data.name + " </span><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>"+ data.real_name + " </span>";
         };
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
											
										});
									}
								});
						   }
					}
				});
		   }
		
				
		
		
		
		
		
		
	};
	
	
});