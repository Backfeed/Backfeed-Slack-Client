angular.module('MyApp').controller(
    'ContributionsModalCtrl',
    function($scope, $auth, $location, $rootScope,$stateParams, Contributions,
             ContributionDetail, SaveContribution, CloseContribution,$state,
             Account, Users, $modalInstance,PostMessageService,ChannelOrg) {

        $scope.closeModal = function() {
            $modalInstance.dismiss('cancel');
        };
        $scope.channelId = $stateParams.channelId;
        var orgExists;
		var slackUsersMap = {};
		var orgId = '';
        $scope.currencyFormatting = function(value) { return value.toString() + " $"; };
        //$scope.organizationId = 'notintialized';
        $scope.buttonDisabled = false;
        $scope.model = {
            title : '',
            file : '',
            owner : '',
            min_reputation_to_close : '',
            users_organizations_id : '',
            contributers : [ {
                contributer_id : '0',
                contributer_percentage : '100',
                contributer_name:'',
                contribution1: '50',
                className:'media contributer-cell',
                img:'/extension/contentScript/app/images/icon-dude.png'
            } ],
            intialBid : [ {
                tokens : '',
                reputation : ''
            } ]
        };
        $scope.rangeSlider = {
                options: {
                    min: 1,
                    max: 100,
                    range: 'min'
                }
        };

        console.log('comes here in controller');
        
        $scope.channelOrgExists = function() {
            console.log("In channelOrgExists method");
            $scope.channelOrgExistsData = ChannelOrg.exits({
            	channelId: $scope.channelId,
            	slackTeamId: $scope.slackTeamId,
            	userId:$scope.userId
			});
			$scope.channelOrgExistsData.$promise.then(function(result) {
				if(result.channleOrgExists == 'true'){
					 $scope.users_organizations_id = result.userOrgId;
                     $scope.organizationId = result.orgId;
                     orgId = $scope.organizationId;
                     $scope.model.users_organizations_id = result.userOrgId;
                     $scope.model.owner = $scope.userId;
                     $scope.model.contributers[0].contributer_id = $scope.userId;
                     $scope.model.contributers[0].contributer_name = $scope.displayName;
                     $scope.model.contributers[0].className = "media contributer-cell";
                     angular.element('#'+$scope.model.contributers[0].contributer_id).trigger('focus');
                     sliderDivElement = angular.element('#slider'+$scope.model.contributers[0].contributer_id+" div");
                     sliderDivElement.removeClass('ui-widget-header-active');
 					sliderDivElement.addClass('ui-widget-header-active');
 					sliderSpanElement = angular.element('#slider'+$scope.model.contributers[0].contributer_id+" span");
 					sliderSpanElement.removeClass('ui-slider-handle-show');
 					sliderSpanElement.addClass('ui-slider-handle-show');
 					$scope.model.contributers[0].className = "media contributer-cell active-contributer";
                     PostMessageService.gesture.showIframe();
                     allOrgUsersData = Users.getAllOrgUsersData();
                     if (allOrgUsersData == undefined) {
                         $scope.getOrgUsers();
                     } else {

                         $scope.users = allOrgUsersData;
                         for(i = 0 ; i<$scope.users.length ; i++){
     						slackUsersMap[$scope.users[i].id] = $scope.users[i].name;
                             if($scope.users[i].id == $scope.model.owner ){
                                 $scope.model.contributers[0].img =  $scope.users[i].url;
                             }
                         }
                         $scope.updatedUsersList = $scope.users;
                     }
				}else{
					console.log('comes here');
					//navigate to create org screen
                	$state.go('createOrg', {'channelId': $scope.channelId}, {reload: true});
				}
				
			});

                

        };
        
        $scope.getProfile = function() {
            Account.getProfile().success(function(user) {
                $scope.userId = user.userId;
                $scope.access_token = user.access_token;
                $scope.slackTeamId = user.slackTeamId;
                $scope.displayName = user.displayName;
                $scope.channelOrgExists();
                Account.setUserData(user);

            }).error(function(error) {
                if (error && error.message) {
                    PostMessageService.gesture.showAlert(error.message, 'error');
                } else {
                    PostMessageService.gesture.showAlert('Please relogin', 'error');
                }
            });
        };
        
        

        // if not authenticated return to splash:
        if (!$auth.isAuthenticated()) {
            $location.path('splash');
        } else {
        	console.log(' $scope.channelId'+ $scope.channelId);
        	if($scope.channelId && $scope.channelId != 0){
        		userData = Account.getUserData();
                if (userData == undefined) {
                    console.log('userData is not defined'+userData);
                    $scope.getProfile();
                } else {
                    console.log('userData is  defined'+userData);
                    $scope.userId = userData.userId;
                    $scope.slackTeamId = userData.slackTeamId;
                    $scope.access_token = userData.access_token;
                    $scope.displayName = userData.displayName;
                    console.log('userData is  defined userId'+$scope.userId);
                    $scope.channelOrgExists();
                }        		
            }
        	
        	
        	
        	
            $scope.getOrgUsers = function() {
                $scope.data = Users.getOrg.getUsers({
                    organizationId : orgId
                });
                $scope.data.$promise.then(function(result) {
                    Users.setAllOrgUsersData(result);
                    $scope.users = result;
                    $scope.updatedUsersList = [];
                   
                    for(i = 0 ; i<$scope.users.length ; i++){
						slackUsersMap[$scope.users[i].id] = $scope.users[i].name;	
                        if($scope.users[i].id == $scope.model.owner ){
                            $scope.model.contributers[0].img =  $scope.users[i].url;
                            $scope.model.contributers[0].contributer_name =  $scope.users[i].name;  
                            angular.element('#'+$scope.model.contributers[0].contributer_id).trigger('focus');
	                        //sliderDivElement = angular.element('#slider'+$scope.model.contributers[0].contributer_id+" div");
	                        //sliderDivElement.removeClass('ui-widget-header-active');
 							//sliderDivElement.addClass('ui-widget-header-active');
 							//sliderSpanElement = angular.element('#slider'+$scope.model.contributers[0].contributer_id+" span");
 							//sliderSpanElement.removeClass('ui-slider-handle-show');
 							//sliderSpanElement.addClass('ui-slider-handle-show');
 							$scope.model.contributers[0].className = "media contributer-cell active-contributer";
                            
                            continue;
                        }
                        $scope.updatedUsersList.push($scope.users[i]);
                    }
                    //$scope.addCollaborator();
                    //$location.path("/contribution/" + result.id);
                });
            };
            

           

            

            $scope.updateContributer = function(selectedUserId) {
                if(selectedUserId == ''){
                    return;
                }
                console.log('comes here firt');
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

                allcontributers = $scope.model.contributers;
                //contPercentage = 100/allcontributers.length;

                for(i=0;i<allcontributers.length;i++){
                    if(allcontributers[i].contributer_id == 0 && allcontributers[i].contributer_percentage == ''){
                    	console.log('comes here firt');
                        allcontributers[i].contributer_id = selectedUserId;
                        
                        //allcontributers[i].contributer_percentage = contPercentage;
                        allcontributers[i].img = urlImage;

                    }
                    
                }
                $scope.changeContribution(selectedUserId,userName);
                setTimeout(function(){ 
                	angular.element('#'+selectedUserId).trigger('focus');
                	 sliderDivElement = angular.element('#slider'+selectedUserId+" div");
                     sliderDivElement.removeClass('ui-widget-header-active');
 					sliderDivElement.addClass('ui-widget-header-active');
 					sliderSpanElement = angular.element('#slider'+selectedUserId+" span");
 					sliderSpanElement.removeClass('ui-slider-handle-show');
 					sliderSpanElement.addClass('ui-slider-handle-show');
 					$scope.model.contributers[0].className = "media contributer-cell active-contributer";
                	
                }, 100);

            };


            $scope.contributionId = $stateParams.contributionId;

            $scope.ContributionModelForView = {
                title : '',
                file : '',
                owner : '',
                min_reputation_to_close : '',
                users_organizations_id : '',
                contributionContributers : [ {
                    contributer_id : '',
                    contributer_percentage : ''
                } ],
                bids : [ {
                    tokens : '',
                    reputation : '',
                    stake : '',
                    owner : '',
                    bidderName : ''
                } ]
            };

            $scope.getContribution = function(entity) {
                var constributionId = 0;
                if (entity) {
                    contributionId = entity.id;
                }
                console.log("get Contribution " + contributionId);
                $location.path("/contribution/" + contributionId);

            };
            
            $scope.clickContributer = function(contributerId) {
            	angular.element('#'+contributerId).trigger('focus');
            	console.log('contributerId is '+contributerId);
            	allcontributers = $scope.model.contributers;
            	var sliderDivElement;
            	var sliderSpanElement;
            	 for(i=0;i<allcontributers.length;i++){
 						 if(allcontributers[i].contributer_id != contributerId){
	 							sliderDivElement = angular.element('#slider'+allcontributers[i].contributer_id+" div");
	 							sliderDivElement.removeClass('ui-widget-header-active');
	 							allcontributers[i].className = "media contributer-cell";
	 							sliderSpanElement = angular.element('#slider'+allcontributers[i].contributer_id+" span");
	 							sliderSpanElement.removeClass('ui-slider-handle-show');
	 							allcontributers[i].className = "media contributer-cell";
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
            };
            $scope.changeContribution = function(contributerId,userName) {
                var totalContribution = 0,
                    allContributers = $scope.model.contributers,
                    valid = true;
                console.log('userName is '+userName);
                if (allContributers.length) {
                    valid = false;
                }
                var sliderDivElement;
                for(i=0;i<allContributers.length;i++){
					if(allContributers[i].contributer_id != 0){
						 if(allContributers[i].contributer_id != contributerId){
							 	allContributers[i].className = "media contributer-cell";
							 	sliderDivElement = angular.element('#slider'+allContributers[i].contributer_id+" div");
							 	sliderDivElement.removeClass('ui-widget-header-active');
							 	sliderSpanElement = angular.element('#slider'+allContributers[i].contributer_id+" span");
	 							sliderSpanElement.removeClass('ui-slider-handle-show');
	                            //totalEarlierRemaining = totalEarlierRemaining + +allContributers[i].contributer_percentage
	                        }else{
	                        	
	                            if(userName != ''){
	                                console.log('comes inside is '+userName+allContributers[i].contributer_id);
	                                allContributers[i].contributer_name = userName;
	                               
	                            }else{
	                            	angular.element('#'+allContributers[i].contributer_id).trigger('focus');
	                            	sliderDivElement = angular.element('#slider'+allContributers[i].contributer_id+" div");
	                            	sliderDivElement.removeClass('ui-widget-header-active');
	                            	sliderDivElement.addClass('ui-widget-header-active');
	                            	sliderSpanElement = angular.element('#slider'+allContributers[i].contributer_id+" span");
		 							sliderSpanElement.removeClass('ui-slider-handle-show');
		 							sliderSpanElement.addClass('ui-slider-handle-show');
	                            	allContributers[i].className = "media contributer-cell active-contributer";
	                            }


	                        }
						totalContribution = totalContribution + +allContributers[i].contribution1;
					}else{
						valid = false;
					}
				}

                for(var i=0; i<allContributers.length; i++){
					if(allContributers[i].contributer_id != 0){
						allContributers[i].contributer_percentage = ((allContributers[i].contribution1/totalContribution)*100).toFixed(1);
					}
				}
                

                /*console.log('coming percentage is '+contributerPercentage);
                remainingPercentage = 100 - +contributerPercentage;
                console.log('remaining percentage is '+remainingPercentage);
                totalEarlierRemaining = 0;
                for(i=0;i<allcontributers.length;i++){
                    if(allcontributers[i].contributer_id != 0){
                        if(allcontributers[i].contributer_id != contributerId){
                            totalEarlierRemaining = totalEarlierRemaining + +allcontributers[i].contributer_percentage
                        }else{
                            if(userName != ''){
                                console.log('comes inside is '+userName);
                                allcontributers[i].contributer_name = userName;
                            }


                        }

                    }
                }
                for(i=0;i<allcontributers.length;i++){
                    if(allcontributers[i].contributer_id != 0){
                        if(allcontributers[i].contributer_id != contributerId){
                            console.log('old percentage is'+allcontributers[i].contributer_percentage);
                            allcontributers[i].contributer_percentage = (remainingPercentage * allcontributers[i].contributer_percentage)/totalEarlierRemaining;
                            console.log('new percentage is  is '+allcontributers[i].contributer_percentage);
                        }else{
                            allcontributers[i].contributer_percentage = contributerPercentage;
                        }

                    }else{
                        valid = false;
                    }



                }*/

                $scope.buttonDisabled = valid;

            };
            
           
            $scope.changePercentage = function(contributerId, contributerPercentage) {
            	allcontributers = $scope.model.contributers;
            	var find = '<br>';
            	var re = new RegExp(find, 'g');
            	contributerPercentage = contributerPercentage.replace(re, '');
            	contributerPercentage = contributerPercentage.trim();
            	if(allcontributers.length <=1){
            		allcontributers[0].contributer_percentage = 100;
            		return;
            	}
            	if(contributerPercentage >= 100){
            		alert("Contribution Percentage can not  be greater or equal to 100");
            		$scope.buttonDisabled = true;
            		return;
            	}
                totalContributionWithoutCurrent = 0;
                for(i=0;i<allcontributers.length;i++){
					if(allcontributers[i].contributer_id != 0){
						 if(allcontributers[i].contributer_id != contributerId){
							 totalContributionWithoutCurrent = totalContributionWithoutCurrent + +allcontributers[i].contribution1;
	                        }
					}
				}
                
                remainingPercentage = 100 - +contributerPercentage;
                
                for(i=0;i<allcontributers.length;i++){
					if(allcontributers[i].contributer_id != 0){
						 if(allcontributers[i].contributer_id == contributerId){
							 allcontributers[i].contribution1 = totalContributionWithoutCurrent * contributerPercentage / remainingPercentage ;
	                        }
					}
				}
                
                $scope.changeContribution(contributerId,'');
                
            };

            // ******************************* SLACK PLAY ***********************

            $scope.buildContributionMessage = function(contributionData) {
                var contributersString = '';
                var contributersLength = contributionData.contributionContributers.length;
                var index = 0;
                contributionData.contributionContributers.forEach(function(contributer) {
                	if(index == contributersLength -1) {
                		contributersString += '@'+slackUsersMap[contributer.contributer_id] +' '+contributer.contributer_percentage+'%';
                	} else {
                		contributersString += '@'+slackUsersMap[contributer.contributer_id] +' '+contributer.contributer_percentage+'%, ';
                	}
                	index++;
                });

                return 'New contribution submitted'
                	+ '\n'
                	+ contributionData.id
                    + '\n'
                    + '*'+contributionData.title+'*'
                    + '\n'
                    + contributionData.file
                    + '\n'
                    + contributersString;
            };

            $scope.sendTestMessage = function(channelId, message) {
                console.log('sending test message to slack: '+message);

                // 'https://slack.com/api/users.list'

                var url = 'https://slack.com/api/chat.postMessage';
                console.log('url: ' + url);

                var data = {
                    icon_url: 'https://s-media-cache-ak0.pinimg.com/236x/71/71/f9/7171f9ba59d5055dd0a865b41ac4b987.jpg',
                    username: 'backfeed-bot',
                    token: "xoxp-3655944058-3674335518-3694970236-83726d",
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
                for (chnIndx in chnls){                
                    var chnl = chnls[chnIndx];                   
                    // TODO removed hardcoded dependency on channel name
                    if(chnl.id == $scope.currentSavedContribution.channelId){
                        console.log('is random sending ...:');

                        var channelId = chnl.id;
                        var message = $scope.buildContributionMessage($scope.currentSavedContribution);
                        $scope.sendTestMessage(channelId, message);
                    }
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

            $scope.slackPlay = function(contribution) {
                console.dir(contribution);
                $scope.currentSavedContribution = contribution;

                console.log('sending to slack, contribution:'+$scope.currentSavedContribution.title);
                $scope.getChannels()

            };

            // *****************************************************
            // function definition
            $scope.onSubmit = function() {
                allcontributers = $scope.model.contributers;
                totalActive = 0;
                for(i=0;i<allcontributers.length;i++){
                    if(allcontributers[i].contributer_id != 0){
                        totalActive = totalActive + 1;
                    }
                }
                console.log('total is '+totalActive);
                if(totalActive <=0 ){
                    PostMessageService.gesture.showAlert('At least one contributer should be there', 'error');
                    return
                }
                console.log("In Submit method");
                console.log($scope.model);
                $scope.data = SaveContribution.save({}, $scope.model);
                $scope.data.$promise.then(function(result) {

                    // TBD: un comment later:
                    $scope.slackPlay(result);

                    $modalInstance.close('submit');
                    PostMessageService.sendGesture('hideIframe');
                    console.log('orgid is'+orgId);
                    $state.go('bids', {'contributionId': result.id,'organizationId':orgId});

                }, function(error) {
                	console.log('Error in sumbmitting Contribution');
                	PostMessageService.gesture.showAlert('Your Contribution was not submitted. Please use english', 'error');
               });
            };

            $scope.removeCollaboratorItem = function(contributerId,index) {
                $scope.model.contributers.splice(index, 1);
                $scope.changeContribution(contributerId,'');
                allcontributers = $scope.model.contributers;
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
            $scope.createContribution = function() {
                console.log("Create Contribution");
                console.log($scope.model);
                $location.path("/contribution");
            };
            $scope.addBid = function() {
                console.log("Create Bid");
                console.log($scope.ContributionModelForView.id);
                $location.path("/bids/"
                    + $scope.ContributionModelForView.id);
            };
            $scope.showStatus = function() {
                console.log("Show Status");
                console.log($scope.ContributionModelForView.id);
                $location.path("/contributionStatus/"
                    + $scope.ContributionModelForView.id);
            };


            if ($scope.contributionId && $scope.contributionId != 0) {
                $scope.data1 = ContributionDetail.getDetail({
                    contributionId : $scope.contributionId
                });
                $scope.data1.$promise.then(function(result) {
                    $scope.ContributionModelForView = result;
                });
            }

            //$scope.users = User.query();
            $scope.orderProp = "time_created"; // set initial order criteria

            $scope.addCollaborator = function(selectedUserId) {
                console.log('comes here in add'+selectedUserId);
                allcontributers = $scope.model.contributers;
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
                $scope.model.contributers.push({
                    contributer_id:'0',
                    contributer_percentage:'',
                    contributer_name:'',
                    contribution1:'50',
                    className:'media contributer-cell',
                    img:'/extension/contentScript/app/images/avatar.png'
                }) ;
                //$scope.buttonDisabled = true;
            };

            $scope.closeContribution = function() {
                console.log("In closeContribution method");
                console.log($scope.ContributionModelForView.id);
                $scope.data = CloseContribution.save({},
                    $scope.ContributionModelForView);
                $scope.data.$promise.then(function(result) {
                    PostMessageService.gesture.showAlert('Contribution closed', 'information');

                    $location.path("/contributions");
                });

            };

            if ($auth.isAuthenticated() && $scope.organizationId && $scope.organizationId != 0) {
                $scope.contributions = Contributions.getAllContributions({
                    organizationId : $scope.organizationId
                });
            }
        }

        $scope.formatSelectUser = function (data) {
            if (!data) return;
            if (!data.url) data.url = chrome.extension.getURL("extension/contentScript/app/images/icon-dude.png");
            return  "<div class='select-contributer flex'><img src='" + data.url +"' /><div>"+ data.name + "<br />"+ data.real_name + "</div></div>";
        };
    });
