angular.module('MyApp')
  .controller('OrganizationsModalCtrl', function($scope,$auth,$location,$stateParams,SaveOrg,Account,
		  Users,AllSlackUsers,CheckOrgTokenName,AllOrgs,$modalInstance,$state,CheckOrgCode,PostMessageService) {
	  $scope.userData= ''
	  $scope.validationFailureForTokenName = false;
	  $scope.validationFailureForCode = false;
	  $scope.buttonDisabled = false;
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
		};

		$scope.rangeSlider = {
			options: {
				min: 1,
				max: 100,
				range: 'min'
			}
		};
	 
	  
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
	        .success(function(user) {
				Account.setUserData(user);
				$scope.userData = Account.getUserData();
				$scope.userId = $scope.userData.userId;
				$scope.userName = $scope.userData.displayName;
				$scope.orgModel.name = $scope.userData.slackTeamName;
				$scope.orgModel.slack_teamid = $scope.userData.slackTeamId;
				$scope.access_token = $scope.userData.access_token;
				$scope.orgModel.contributers[0].contributer_id = $scope.userData.slackUserId;
				$scope.orgModel.contributers[0].contributer_name = $scope.userData.displayName;
                $scope.getOrgUsers();
                PostMessageService.gesture.showIframe();
				
	        })
	        .error(function(error) {
	        	if (error && error.message) {
                    PostMessageService.gesture.showAlert(error.message, 'error');
                } else {
                    PostMessageService.gesture.showAlert('Plese Relogin', 'error');
                }
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
             $scope.access_token = $scope.userData.access_token;
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
             //$scope.buttonDisabled = true;
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
   
// ******************************* SLACK PLAY ***********************

   

   $scope.sendTestMessage = function(channelId, message) {
       console.log('sending test message to slack: '+message);

       // 'https://slack.com/api/users.list'

       var url = 'https://slack.com/api/chat.postMessage';
       console.log('url: ' + url);

       var token = "xoxp-3655944058-3674335518-3694970236-83726d";
       var data = {
           icon_url: 'https://s-media-cache-ak0.pinimg.com/236x/71/71/f9/7171f9ba59d5055dd0a865b41ac4b987.jpg',
           username: 'backfeed-bot',
           token: token,
           channel: channelId,
           text: message,
           link_names: 1,
           parse: "full"
       };

       // TODO: move to use angularJS instead of Jquery and get rid of need to change  Host when we deploy...
       // TODO: which API ? do we get 'my borads or boards of orgenziation'.
       //$http.get(url, data).success(function(response) {
       //    console.log('message posted successfully!');
       //}).error(function(response) {
       //    console.log('message posted erroneously!');
       //});
       $.ajax({
           type: "GET",
           url: url,
           data: data,
           success: function(response){
               console.log('message posted successfully!');
           },
           persist:true,
           dataType:'JSON'
       });
   };


   $scope.gotChannels = function(data) {
       console.log('recieved Channels:');
       //console.dir(data);

       // get specific channel:
       var chnls = data.channels;
       var message = 'Organization '+$scope.currentOrgName+' is created. You can install by downloading from this URL https://backfeed.slack.com/files/neerajjain/F083461PC/newrouting_new.crx';
       for (chnIndx in chnls){
           var chnl = chnls[chnIndx];
           console.log('chnl.name:'+chnl.name);

           // TODO removed hardcoded dependency on channel name
           if(chnl.name == 'general'){
               var channelId = chnl.id;
               $scope.sendTestMessage(channelId, message);
           }
       }
       //sending message to each users
       var slackUsers = $scope.users;
       for (userIndx in slackUsers){
    	   var slackUser = slackUsers[userIndx];
           var slackUserId = slackUser.id;
           //TODO will remove this if clause while creating extension
           
        $scope.sendTestMessage(slackUserId, message);
           
           
       }
   };

   $scope.getChannels = function() {

       console.log('getting channels using access Token:'+$scope.access_token);

       // 'https://slack.com/api/users.list'

       var url = 'https://slack.com/api/channels.list';
       console.log('url:'+url);

       var token = "xoxp-3655944058-3674335518-3694970236-83726d";
       //	var key = 'c1bb14ae5cc544231959fc6e9af43218';
       var data = {
           token:token
           //,key:key
       };

       // TBD: move to use angularJS instead of Jquery and get rid of need to change  Host when we deploy...
       // TBD: which API ? do we get 'my borads or boards of orgenziation'
       $.ajax({
           type: "GET",
           url: url,
           data: data,
           success: $scope.gotChannels,
           persist:true,
           dataType:'JSON'
       });

   };

   $scope.slackPlay = function(orgName) {
       console.dir(orgName);
       $scope.currentOrgName = orgName;

       console.log('sending to slack, orgName:'+$scope.currentOrgName);
       $scope.getChannels()

   };
   // *****************************************************

   
  
   
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
						PostMessageService.gesture.showAlert('This name is already taken. Please use a different one', 'error');
						return;
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
										PostMessageService.gesture.showAlert('This code is already taken. Please use a different one', 'error');
										return;
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
											$scope.slackPlay($scope.orgModel.name);
											PostMessageService.gesture.showAlert('Successfully created organization', 'success');
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