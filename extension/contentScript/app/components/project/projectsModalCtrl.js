angular.module('MyApp')
.controller('ProjectsModalCtrl', ProjectsModalCtrl);

function ProjectsModalCtrl($scope, $auth, $location, $stateParams, SaveProject, Account, Users, AllSlackUsers, CheckProjectTokenName, $modalInstance, $state, CheckProjectCode, PostMessageService,ChannelProject) {

  var channelId = $stateParams.channelId
  var validationFailureForTokenName = false;
  var validationFailureForCode = false;

  var projectModel = {
    token_name : '',
    slack_teamid : '',
    name : '',
    code : '',
    token :'',
    channelId :channelId,
    channelName :'',
    a :'50',
    b :'50',
    contributers : [ {
      contributer_id : '0',
      contributer_percentage : '100',
      contributer_name:'',
      contributer_fullname:'',
      contribution1: '50',
      className:'contributer-cell-wrapper',
      img:'/extension/contentScript/app/images/icon-dude.png'
    } ]
  };

  var rangeSlider = {
    options: {
      min: 1,
      max: 100,
      range: 'min'
    }
  };


  angular.extend($scope, {

    closeModal: closeModal,
    updateContributer: updateContributer,
    clickContributer: clickContributer,
    changeContribution: changeContribution,
    changePercentage: changePercentage,
    submit: submit,
    formatSelectUser: formatSelectUser,
    userData: '',
    buttonDisabled: false,
    projectModel: projectModel,
    rangeSlider: rangeSlider
    
  });

  init();

  function init() {

    PostMessageService.gesture.hideIframe();

    $scope.userData = Account.getUserData();
    console.log("userData is"+$scope.userData);

    if ( $scope.userData == undefined ) {
     getProfile();
   } 

   else {
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
    $scope.projectModel.contributers[0].className = "contributer-cell-wrapper active-contributer";
    $scope.access_token = $scope.userData.access_token;
    getProjectUsers();
    $scope.ChannelProjectExistsData = ChannelProject.exists({
      channelId: channelId,
      slackTeamId: $scope.projectModel.slack_teamid,
      userId:$scope.userId
    });

    $scope.ChannelProjectExistsData.$promise.then(function(result) {
      if ( result.channleOrgExists == 'true' ) {
        PostMessageService.gesture.showAlert('Organization already exists for this channel', 'error');
      } else {
        PostMessageService.gesture.showIframe();
      }
    });
  }

  getProjectUsers();

  $scope.orderProp = "name";


    // if not authenticated return to splash:
    if(!$auth.isAuthenticated()){
      $location.path('splash');
    }

  //$scope.slackUsers = Users.getUsers();

}


function closeModal() {
  $modalInstance.dismiss('cancel');
};

function getProjectUsers() {
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

    $scope.projectModel.contributers[0].className = "contributer-cell-wrapper active-contributer";

    for (var i = 0; i<$scope.users.length; i++) {
      if ($scope.users[i].id == $scope.userData.slackUserId ) {
        $scope.projectModel.contributers[0].img =  $scope.users[i].url;
        $scope.projectModel.contributers[0].contributer_name =  $scope.users[i].name;
        $scope.projectModel.contributers[0].contributer_fullname =  $scope.users[i].real_name;
        angular.element('#'+$scope.projectModel.contributers[0].contributer_id).trigger('focus');
        sliderDivElement = angular.element('#slider'+$scope.projectModel.contributers[0].contributer_id+" div");
        sliderDivElement.removeClass('ui-widget-header-active');
        sliderDivElement.addClass('ui-widget-header-active');
        sliderSpanElement = angular.element('#slider'+$scope.projectModel.contributers[0].contributer_id+" span");
        sliderSpanElement.removeClass('ui-slider-handle-show');
        sliderSpanElement.addClass('ui-slider-handle-show');
        $scope.projectModel.contributers[0].className = "contributer-cell-wrapper active-contributer";
      } else {
       $scope.updatedUsersList.push($scope.users[i]);
     }
   }
 });
};

function getProfile() {
  Account.getProfile()
  .success(function(user) {
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
    $scope.projectModel.contributers[0].className = "contributer-cell-wrapper active-contributer";
    getProjectUsers();
    $scope.ChannelProjectExistsData = ChannelProject.exists({
      channelId: channelId,
      slackTeamId: $scope.projectModel.slack_teamid,
      userId:$scope.userId
    });
    $scope.ChannelProjectExistsData.$promise.then(function(result) {
      if ( result.channleOrgExists == 'true' ) {
       PostMessageService.gesture.showAlert('Organization already exists for this channel', 'error');
     } else {
       PostMessageService.gesture.showIframe();
     }
   });

  })
.error(function(error) {
  if (error && error.message) {
    PostMessageService.gesture.showAlert(error.message, 'error');
  } else {
    PostMessageService.gesture.showAlert('Please relogin', 'error');
  }
});
}

function updateContributer(selectedUserId) {
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
  $scope.projectModel.contributers[0].className = "contributer-cell-wrapper active-contributer";
}, 100);
};

function clickContributer(contributerId) {
  angular.element('#'+contributerId).trigger('focus');
  console.log('contributerId is '+contributerId);

  var allcontributers = $scope.projectModel.contributers,
  sliderDivElement,
  sliderSpanElement;

  for(var i=0; i<allcontributers.length; i++) {
   if (allcontributers[i].contributer_id != contributerId) {
    sliderDivElement = angular.element('#slider'+allcontributers[i].contributer_id+" div");
    sliderDivElement.removeClass('ui-widget-header-active');
    allcontributers[i].className = "contributer-cell-wrapper";
    sliderSpanElement = angular.element('#slider'+allcontributers[i].contributer_id+" span");
    sliderSpanElement.removeClass('ui-slider-handle-show');
    allcontributers[i].className = "contributer-cell-wrapper";
  } else {
    angular.element('#'+allcontributers[i].contributer_id).trigger('focus');
    sliderDivElement = angular.element('#slider'+allcontributers[i].contributer_id+" div");
    sliderDivElement.removeClass('ui-widget-header-active');
    sliderDivElement.addClass('ui-widget-header-active');
    sliderSpanElement = angular.element('#slider'+allcontributers[i].contributer_id+" span");
    sliderSpanElement.removeClass('ui-slider-handle-show');
    sliderSpanElement.addClass('ui-slider-handle-show');
    allcontributers[i].className = "contributer-cell-wrapper active-contributer";
  }
}
};

function changeContribution(contributerId,userName) {
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
    allcontributers[i].className = "contributer-cell-wrapper";
    sliderDivElement = angular.element('#slider'+allcontributers[i].contributer_id+" div");
    sliderDivElement.removeClass('ui-widget-header-active');
    var sliderSpanElement = angular.element('#slider'+allcontributers[i].contributer_id+" span");
    sliderSpanElement.removeClass('ui-slider-handle-show');
  }else{
    if(userName != ''){
      allcontributers[i].contributer_name = userName;
      allcontributers[i].className = "contributer-cell-wrapper";
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
      allcontributers[i].className = "contributer-cell-wrapper active-contributer";
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

function removeCollaboratorItem(contributerId,index) {
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

function addCollaborator(selectedUserId) {
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
   className:'contributer-cell-wrapper',
   img:'/extension/contentScript/app/images/avatar.png'
 }) ;
         //$scope.buttonDisabled = true;
       };


       function changePercentage(contributerId, contributerPercentage) {
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
          alert("Contribution Percentage can not  be greater or equal to 100");
          $scope.buttonDisabled = true;
          return;
        }
        var totalContributionWithoutCurrent = 0;
        for(i=0;i<allcontributers.length;i++) {
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

      function changeTeam(){
        console.log('comes here in logout');
        $state.go("logout");

      };

// ******************************* SLACK PLAY ***********************

function sendTestMessage(channelId, message) {
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

function gotChannels(data) {
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
         $scope.sendTestMessage(channelId, message);
       //sending message to each users
       /*var slackUsers = $scope.users;
       for (userIndex in slackUsers){
    	   var slackUser = slackUsers[userIndex];
           var slackUserId = slackUser.id;
           
        	$scope.sendTestMessage(slackUserId, message);
        }*/
      };

      function getChannels() {

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
     if(channel.id == channelId) {
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
			//$state.go('createContribution', {'channelId': channelId}, {reload: true});
		}, function(error) {
      console.log('Error in creating project');
      PostMessageService.gesture.showAlert('Your project was not created. Please use english', 'error');
    });
};

function getChannelsForProjectCreation() {

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

   

   
   
   function submit() {
     if($scope.projectModel.token_name != ''){
      $scope.data1 = CheckProjectTokenName.CheckProjectTokenName({
       tokenName : $scope.projectModel.token_name
     });
      $scope.data1.$promise.then(function(result) {
       if(result.tokenAlreadyExist == 'true'){
         console.log('comes here in true for token');
         validationFailureForTokenName = true;
         PostMessageService.gesture.showAlert('This name is already taken. Please use a different one', 'error');
       }else{
        console.log('comes here in false for token');
        validationFailureForTokenName = false;
        if($scope.projectModel.code != ''){
          $scope.data1 = CheckProjectCode.CheckProjectCode({
           code : $scope.projectModel.code
         });
          $scope.data1.$promise.then(function(result) {
           if(result.codeAlreadyExist == 'true'){
            validationFailureForCode = true;
            PostMessageService.gesture.showAlert('This code is already taken. Please use a different one', 'error');
          }else{
            console.log('comes here in false for token');
            validationFailureForCode = false;
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

function formatSelectUser(data) {
  if (!data) return;
  if (!data.url) data.url = chrome.extension.getURL("extension/contentScript/app/images/icon-dude.png");
  return  "<div class='select-contributer flex'><img src='" + data.url +"' /><div>"+ data.name + "<br />"+ data.real_name + "</div></div>";
};
}