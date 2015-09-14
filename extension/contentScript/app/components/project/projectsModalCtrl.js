angular.module('MyApp').controller('ProjectsModalCtrl',
    function($scope, $auth, $location, $stateParams, SaveProject, Account, Users, AllSlackUsers, CheckProjectTokenName,
             $modalInstance, $state, CheckProjectCode, PostMessageService) {

    $scope.userData= '';
    $scope.validationFailureForTokenName = false;
    $scope.validationFailureForCode = false;
    $scope.buttonDisabled = false;
    $scope.channelId = $stateParams.channelId;

    PostMessageService.gesture.hideIframe();

    $scope.closeModal = function() {
      $modalInstance.dismiss('cancel');
    };
	
    $scope.projectModel = {
        token_name : '',
        slack_teamid : '',
        name : '',
        code : '',
        token :'',
        channelId :$scope.channelId,
        channelName :'',
        a :'50',
        b :'50',
        contributers : [ {
            contributer_id : '0',
            contributer_percentage : '100',
            contributer_name:'',
            contribution1: '50',
            className:'media contributer-cell',
            img:'/extension/contentScript/app/images/icon-dude.png'
        } ]
    };

    $scope.rangeSlider = {
        options: {
            min: 1,
            max: 100,
            range: 'min'
        }
    };

    $scope.getProjectUsers = function() {
      $scope.data = AllSlackUsers.allSlackUsers();
      $scope.data.$promise.then(function(result) {
          $scope.users = result;
          $scope.updatedUsersList = [];
          sliderDivElement = angular.element('#sliderPassingResponsibility div');
          sliderDivElement.removeClass('ui-widget-header-active');
          sliderDivElement.addClass('ui-widget-header-active');
          sliderSpanElement = angular.element('#sliderPassingResponsibility span');
          sliderSpanElement.removeClass('ui-slider-handle-show');
          sliderSpanElement.addClass('ui-slider-handle-show');
          
          sliderDivElement = angular.element('#sliderConsideration div');
          sliderDivElement.removeClass('ui-widget-header-active');
          sliderDivElement.addClass('ui-widget-header-active');
          sliderSpanElement = angular.element('#sliderConsideration span');
          sliderSpanElement.removeClass('ui-slider-handle-show');
          sliderSpanElement.addClass('ui-slider-handle-show');

          $scope.projectModel.contributers[0].className = "media contributer-cell active-contributer";

          for (var i = 0; i<$scope.users.length; i++) {
              if ($scope.users[i].id == $scope.userData.slackUserId ) {
                  $scope.projectModel.contributers[0].img =  $scope.users[i].url;
                  $scope.projectModel.contributers[0].contributer_name =  $scope.users[i].name;
                  angular.element('#'+$scope.projectModel.contributers[0].contributer_id).trigger('focus');
                  sliderDivElement = angular.element('#slider'+$scope.projectModel.contributers[0].contributer_id+" div");
                  sliderDivElement.removeClass('ui-widget-header-active');
                  sliderDivElement.addClass('ui-widget-header-active');
                  sliderSpanElement = angular.element('#slider'+$scope.projectModel.contributers[0].contributer_id+" span");
                  sliderSpanElement.removeClass('ui-slider-handle-show');
                  sliderSpanElement.addClass('ui-slider-handle-show');
                  $scope.projectModel.contributers[0].className = "media contributer-cell active-contributer";
              } else {
            	  $scope.updatedUsersList.push($scope.users[i]);
              }
          }
      });
    };

    $scope.getProfile = function() {
        Account.getProfile().success(function(user) {
            Account.setUserData(user);
            $scope.userData = Account.getUserData();
            $scope.userId = $scope.userData.userId;
            $scope.userName = $scope.userData.displayName;
            $scope.projectModel.name = $scope.userData.slackTeamName;
            $scope.projectModel.slack_teamid = $scope.userData.slackTeamId;
            $scope.access_token = $scope.userData.access_token;
            $scope.projectModel.contributers[0].contributer_id = $scope.userData.slackUserId;
            $scope.projectModel.contributers[0].contributer_name = $scope.userData.displayName;
            angular.element('#'+$scope.projectModel.contributers[0].contributer_id).trigger('focus');
            sliderDivElement = angular.element('#slider'+$scope.projectModel.contributers[0].contributer_id+" div");
            sliderDivElement.removeClass('ui-widget-header-active');
            sliderDivElement.addClass('ui-widget-header-active');
            sliderSpanElement = angular.element('#slider'+$scope.projectModel.contributers[0].contributer_id+" span");
            sliderSpanElement.removeClass('ui-slider-handle-show');
            sliderSpanElement.addClass('ui-slider-handle-show');
            $scope.projectModel.contributers[0].className = "media contributer-cell active-contributer";
            $scope.getProjectUsers();
            PostMessageService.gesture.showIframe();
        })
        .error(function(error) {
            if (error && error.message) {
                PostMessageService.gesture.showAlert(error.message, 'error');
            } else {
                PostMessageService.gesture.showAlert('Please relogin', 'error');
            }
        });
    };

     $scope.userData = Account.getUserData();
     console.log("userData is"+$scope.userData);

     if ($scope.userData == undefined) {
         $scope.getProfile();
     } else {
         $scope.userId = $scope.userData.userId;
         $scope.projectModel.name = $scope.userData.slackTeamName;
         $scope.projectModel.slack_teamid = $scope.userData.slackTeamId;
         $scope.projectModel.contributers[0].contributer_id = $scope.userData.slackUserId;
         $scope.projectModel.contributers[0].contributer_name = $scope.userData.displayName;
         angular.element('#'+$scope.projectModel.contributers[0].contributer_id).trigger('focus');
         var sliderDivElement = angular.element('#slider'+$scope.projectModel.contributers[0].contributer_id+" div");
         sliderDivElement.removeClass('ui-widget-header-active');
         sliderDivElement.addClass('ui-widget-header-active');
         var sliderSpanElement = angular.element('#slider'+$scope.projectModel.contributers[0].contributer_id+" span");
         sliderSpanElement.removeClass('ui-slider-handle-show');
         sliderSpanElement.addClass('ui-slider-handle-show');
         $scope.projectModel.contributers[0].className = "media contributer-cell active-contributer";
         $scope.access_token = $scope.userData.access_token;
         $scope.getProjectUsers();
         PostMessageService.gesture.showIframe();
     }

     $scope.getProjectUsers();

     $scope.updateContributer = function(selectedUserId) {
         if(selectedUserId == ''){
             return;
         }
         $scope.addCollaborator(selectedUserId);
         var urlImage = '';
         var userName = '';
         for(i = 0 ; i<$scope.users.length ; i++){
             if($scope.users[i].id == selectedUserId) {
                 urlImage =  $scope.users[i].url;
                 userName = $scope.users[i].name;
                 break;
             }
         }

         var allcontributers = $scope.projectModel.contributers;

         for(var i=0; i<allcontributers.length; i++){
             if(allcontributers[i].contributer_id == 0 && allcontributers[i].contributer_percentage == ''){
                 allcontributers[i].contributer_id = selectedUserId;
                 allcontributers[i].img = urlImage;

             }
         }

         $scope.changeContribution(selectedUserId,userName);

         setTimeout(function(){
            angular.element('#'+selectedUserId).trigger('focus');
            var sliderDivElement = angular.element('#slider'+selectedUserId+" div");
            sliderDivElement.removeClass('ui-widget-header-active');
            sliderDivElement.addClass('ui-widget-header-active');
            var sliderSpanElement = angular.element('#slider'+selectedUserId+" span");
            sliderSpanElement.removeClass('ui-slider-handle-show');
            sliderSpanElement.addClass('ui-slider-handle-show');
            $scope.projectModel.contributers[0].className = "media contributer-cell active-contributer";
         }, 100);
     };

     $scope.clickContributer = function(contributerId) {
        angular.element('#'+contributerId).trigger('focus');
        console.log('contributerId is '+contributerId);

        var allcontributers = $scope.projectModel.contributers,
            sliderDivElement,
            sliderSpanElement;

        for(var i=0; i<allcontributers.length; i++) {
                 if (allcontributers[i].contributer_id != contributerId) {
                        sliderDivElement = angular.element('#slider'+allcontributers[i].contributer_id+" div");
                        sliderDivElement.removeClass('ui-widget-header-active');
                        allcontributers[i].className = "media contributer-cell";
                        sliderSpanElement = angular.element('#slider'+allcontributers[i].contributer_id+" span");
                        sliderSpanElement.removeClass('ui-slider-handle-show');
                        allcontributers[i].className = "media contributer-cell";
                    } else {
                        angular.element('#'+allcontributers[i].contributer_id).trigger('focus');
                        sliderDivElement = angular.element('#slider'+allcontributers[i].contributer_id+" div");
                        sliderDivElement.removeClass('ui-widget-header-active');
                        sliderDivElement.addClass('ui-widget-header-active');
                        sliderSpanElement = angular.element('#slider'+allcontributers[i].contributer_id+" span");
                        sliderSpanElement.removeClass('ui-slider-handle-show');
                        sliderSpanElement.addClass('ui-slider-handle-show');
                        allcontributers[i].className = "media contributer-cell active-contributer";
                    }
        }
     };

     $scope.changeContribution = function(contributerId,userName) {
         var totalContribution = 0,
             allcontributers = $scope.projectModel.contributers,
             valid = true;

         console.log('userName is '+userName);

         if(allcontributers.length){
             valid = false;
         }
         var sliderDivElement;

         for(var i=0;i<allcontributers.length;i++){
                if(allcontributers[i].contributer_id != 0){
                     if(allcontributers[i].contributer_id != contributerId){
                            allcontributers[i].className = "media contributer-cell";
                            sliderDivElement = angular.element('#slider'+allcontributers[i].contributer_id+" div");
                            sliderDivElement.removeClass('ui-widget-header-active');
                            var sliderSpanElement = angular.element('#slider'+allcontributers[i].contributer_id+" span");
                            sliderSpanElement.removeClass('ui-slider-handle-show');
                        }else{
                            if(userName != ''){
                                allcontributers[i].contributer_name = userName;
                                allcontributers[i].className = "media contributer-cell";
                                sliderDivElement = angular.element('#slider'+contributerId+" div");
                                sliderDivElement.removeClass('ui-widget-header-active');
                                sliderSpanElement = angular.element('#slider'+contributerId+" span");
                                sliderSpanElement.removeClass('ui-slider-handle-show');
                            }else{
                                angular.element('#'+allcontributers[i].contributer_id).trigger('focus');
                                sliderDivElement = angular.element('#slider'+allcontributers[i].contributer_id+" div");
                                sliderDivElement.removeClass('ui-widget-header-active');
                                sliderDivElement.addClass('ui-widget-header-active');
                                sliderSpanElement = angular.element('#slider'+allcontributers[i].contributer_id+" span");
                                sliderSpanElement.removeClass('ui-slider-handle-show');
                                sliderSpanElement.addClass('ui-slider-handle-show');
                                allcontributers[i].className = "media contributer-cell active-contributer";
                            }


                        }
                    totalContribution = totalContribution + +allcontributers[i].contribution1;
                }else{
                    valid = false;
                }
            }

         for(i=0;i<allcontributers.length;i++){
                if(allcontributers[i].contributer_id != 0){
                    allcontributers[i].contributer_percentage = ((allcontributers[i].contribution1/totalContribution)*100).toFixed(1);
                }
            }



         $scope.buttonDisabled = valid;

     };

     $scope.removeCollaboratorItem = function(contributerId,index) {
         $scope.projectModel.contributers.splice(index, 1);
         $scope.changeContribution(contributerId,'');
         var allcontributers = $scope.projectModel.contributers;
         $scope.updatedUsersList = [];
         $scope.selectedContributerId = '';
         for(var i = 0; i<$scope.users.length; i++){
             var userExist = false;
             for(var j=0;j<allcontributers.length;j++){
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
         var allcontributers = $scope.projectModel.contributers;
         $scope.updatedUsersList = [];
         $scope.selectedContributerId = '';
         for(var i = 0 ; i<$scope.users.length ; i++){
             if($scope.users[i].id == selectedUserId){
                 continue;
             }
             var userExist = false;
             for(var j=0; j<allcontributers.length; j++){
                 if($scope.users[i].id == allcontributers[j].contributer_id){
                     userExist = true;
                     break;
                 }
             }
             if(userExist == false){
                 $scope.updatedUsersList.push($scope.users[i]);
             }
         }
         $scope.projectModel.contributers.push({
             contributer_id:'0',
             contributer_percentage:'',
             contributer_name:'',
             contribution1:'50',
             className:'media contributer-cell',
             img:'/extension/contentScript/app/images/avatar.png'
         }) ;
         //$scope.buttonDisabled = true;
     };

     $scope.changePercentage = function(contributerId, contributerPercentage) {
        var allcontributers = $scope.projectModel.contributers;
        var find = '<br>';
    	var re = new RegExp(find, 'g');
    	contributerPercentage = contributerPercentage.replace(re, '');
    	contributerPercentage = contributerPercentage.trim();
        if(allcontributers.length <=1){
            allcontributers[0].contributer_percentage = 100;
            return;
        }
        if(contributerPercentage >= 100){
            alert("Contribution Percentage can not  be greatar or equal to 100");
            $scope.buttonDisabled = true;
            return;
        }
         var totalContributionWithoutCurrent = 0;
         for(i=0;i<allcontributers.length;i++){
                if(allcontributers[i].contributer_id != 0){
                     if(allcontributers[i].contributer_id != contributerId){
                         totalContributionWithoutCurrent = totalContributionWithoutCurrent + +allcontributers[i].contribution1;
                        }
                }
            }

         var remainingPercentage = 100 - +contributerPercentage;

         for(var i=0;i<allcontributers.length;i++){
                if(allcontributers[i].contributer_id != 0){
                     if(allcontributers[i].contributer_id == contributerId){
                         allcontributers[i].contribution1 = totalContributionWithoutCurrent * contributerPercentage / remainingPercentage ;
                        }
                }
            }

         $scope.changeContribution(contributerId,'');

     };

    // if not authenticated return to splash:
    if(!$auth.isAuthenticated()){
        $location.path('splash');
    }

    //$scope.slackUsers = Users.getUsers();

   $scope.changeTeam = function(){
	   console.log('comes here in logout');
	   $state.go("logout");
	   
   };
   
// ******************************* SLACK PLAY ***********************

   $scope.sendTestMessage = function(channelId, message) {
       console.log('sending test message to slack: '+message);

       // 'https://slack.com/api/users.list'

       var url = 'https://slack.com/api/chat.postMessage';
       console.log('url: ' + url);

       //var token = "xoxp-3655944058-3674335518-3694970236-83726d";
       var token = $scope.access_token;
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
       // TODO: which API ? do we get 'my boards or boards of project'.
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
       console.log('received Channels:');
       //console.dir(data);

       // get specific channel:
       var channels = data.channels;
       var message = 'Project creating in '+$scope.currentProjectName+' team. https://chrome.google.com/webstore/detail/backfeed-slack-extension/feglgahjbjnabofomkpmoacillfnpjpb';
       for (var channelIndex in channels){
           var channel = channels[channelIndex];
           console.log('channel.name:'+channel.name);
           if(channel.name == 'testextenstion'){
           //if(channel.name == 'general'){
               var channelId = channel.id;
               $scope.sendTestMessage(channelId, message);
           }
       }
       $scope.sendTestMessage($scope.channelId, message);
       //sending message to each users
       /*var slackUsers = $scope.users;
       for (userIndex in slackUsers){
    	   var slackUser = slackUsers[userIndex];
           var slackUserId = slackUser.id;
           
        	$scope.sendTestMessage(slackUserId, message);
       }*/
   };

   $scope.getChannels = function() {

       console.log('getting channels using access Token:'+$scope.access_token);

       // 'https://slack.com/api/users.list'

       var url = 'https://slack.com/api/channels.list';
       console.log('url:'+url);

       //var token = "xoxp-3655944058-3674335518-3694970236-83726d";
       var token = $scope.access_token;
       //	var key = 'c1bb14ae5cc544231959fc6e9af43218';
       var data = {
           token:token
           //,key:key
       };

       // TBD: move to use angularJS instead of Jquery and get rid of need to change  Host when we deploy...
       // TBD: which API ? do we get 'my boards or boards of project'
       $.ajax({
           type: "GET",
           url: url,
           data: data,
           success: $scope.gotChannels,
           persist:true,
           dataType:'JSON'
       });

   };
   
   
   $scope.gotChannelsForProjectCreation = function(data) {
       console.log('received Channels:');
       //console.dir(data);

       // get specific channel:
       var channels = data.channels;
       for (var channelIndex in channels){
           var channel = channels[channelIndex];
           if(channel.id == $scope.channelId){
        	   $scope.projectModel.channelName = channel.name;
        	   break;
           }
       }
	   	$scope.data = SaveProject.save({},$scope.projectModel);
		$scope.data.$promise.then(function(result) {
			console.log('channels Ids are'+result.channelId);
			PostMessageService.gesture.setChannelId(result.channelId);
			$scope.userData.orgId = result.organization_id;
			$scope.userData.userOrgId = result.id;
			$scope.userData.projectExists = "true";
			console.log('Inserted project id : '+result.organization_id);
			console.log('Inserted user project id : '+result.id);
		 	Account.setUserData($scope.userData);
			$scope.slackPlay($scope.projectModel.name);
			PostMessageService.gesture.showAlert('Successfully created project', 'success');
			$modalInstance.close('submit');
			//$state.go('createContribution', {'channelId': $scope.channelId}, {reload: true});
		}, function(error) {
	    	console.log('Error in creating project');
	    	PostMessageService.gesture.showAlert('Your project was not created. Please use english', 'error');
		});
   };

   $scope.getChannelsForProjectCreation = function() {

       console.log('getting channels using access Token:'+$scope.access_token);

       // 'https://slack.com/api/users.list'

       var url = 'https://slack.com/api/channels.list';
       console.log('url:'+url);

       //var token = "xoxp-3655944058-3674335518-3694970236-83726d";
       var token = $scope.access_token;
       //	var key = 'c1bb14ae5cc544231959fc6e9af43218';
       var data = {
           token:token
           //,key:key
       };

       // TBD: move to use angularJS instead of Jquery and get rid of need to change  Host when we deploy...
       // TBD: which API ? do we get 'my boards or boards of project'
       $.ajax({
           type: "GET",
           url: url,
           data: data,
           success: $scope.gotChannelsForProjectCreation,
           persist:true,
           dataType:'JSON'
       });

   };

   $scope.slackPlay = function(projectName) {
       console.dir(projectName);
       $scope.currentProjectName = projectName;

       console.log('sending to slack, projectName: ' + $scope.currentProjectName);
       $scope.getChannels()

   };
   // *****************************************************

   
  
   
   $scope.orderProp = "name";
	$scope.submit = function() {
		 if($scope.projectModel.token_name != ''){
			   $scope.data1 = CheckProjectTokenName.CheckProjectTokenName({
				   tokenName : $scope.projectModel.token_name
				});
				$scope.data1.$promise.then(function(result) {
					if(result.tokenAlreadyExist == 'true'){
						 console.log('comes here in true for token');
						$scope.validationFailureForTokenName = true;
						PostMessageService.gesture.showAlert('This name is already taken. Please use a different one', 'error');
					}else{
						console.log('comes here in false for token');
						$scope.validationFailureForTokenName = false;
						 if($scope.projectModel.code != ''){
							   $scope.data1 = CheckProjectCode.CheckProjectCode({
								   code : $scope.projectModel.code
								});
								$scope.data1.$promise.then(function(result) {
									if(result.codeAlreadyExist == 'true'){
										$scope.validationFailureForCode = true;
										PostMessageService.gesture.showAlert('This code is already taken. Please use a different one', 'error');
									}else{
										console.log('comes here in false for token');
										$scope.validationFailureForCode = false;
										console.log("In Submit method");
										console.log($scope.projectModel);
										$scope.getChannelsForProjectCreation();
									
									}
								});
						   }
					}
				});
		   }
	};

    $scope.formatSelectUser = function (data) {
        if (!data) return;
        if (!data.url) data.url = chrome.extension.getURL("extension/contentScript/app/images/icon-dude.png");
        return  "<div class='select-contributer flex'><img src='" + data.url +"' /><div>"+ data.name + "<br />"+ data.real_name + "</div></div>";
    };
});