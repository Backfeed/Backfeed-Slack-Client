angular.module('MyApp').controller('MilestoneModalCtrl', MilestoneModalCtrl);

function MilestoneModalCtrl($scope, $stateParams, $timeout, $modalInstance, _DEV, Resource, Account, Milestone, PostMessageService,Users) {

  var log = _DEV.log('MILESTONE');

  var channelId = $stateParams.channelId;
  
  var teamChannelMap = {};
  
  var slackUsersMap = {};

  var milestoneModel = {
    title: '',
    description: '',
    channelId: channelId,
    channelName :'',
    a :'50',
    b :'50',
    evaluatingTeam: '',
    contributors : [ {
      id : '0',
      percentage : '100',
      name:'',
      contribution1: '50',
      className:'media contributor-cell',
      img:'/extension/contentScript/app/images/icon-dude.png'
    } ],
    contributions: []
  };
  
 

  angular.extend($scope, {
    submit: submit,
    closeModal: closeModal,
    userData: '',
    activeContribution: {},
    teams: [],
    milestoneModel: milestoneModel
  });

  init();
  
  $scope.getProjectUsers = function() {
      $scope.data = Users.getProject.getUsers({
        projectId: $scope.orgId
      });

      $scope.data.$promise.then(function(result) {
        Users.setAllProjectUsersData(result);
        $scope.users = result;
        for (var i = 0; i < $scope.users.length; i++) {
          slackUsersMap[$scope.users[i].id] = $scope.users[i].name;
        }
      });
  };

  function getSlackUsers(){
        var allProjectUsersData = Users.getAllProjectUsersData();
        if (allProjectUsersData == undefined) {
          $scope.getProjectUsers();
        } else {
          $scope.users = allProjectUsersData;
          for (var i = 0; i < $scope.users.length; i++) {
            slackUsersMap[$scope.users[i].id] = $scope.users[i].name;
          }
        }
  }

  function init() {

    PostMessageService.hideIframe();
    
    $scope.userData = Account.getUserData();
    log("userData is"+$scope.userData);

    if ($scope.userData == undefined) {
     getProfile();
    } else {
     $scope.userId = $scope.userData.userId;
     $scope.access_token = $scope.userData.access_token;
     PostMessageService.showIframe();
    }

    $timeout(function() {
      log('Init Timeout');

      Resource.get('organization/all/team/' + $scope.userData.slackTeamId)
      .then(function(teams) {
        for (var i = 0; i < teams.length; i++) {
        	if(teams[i].channelId != channelId){
        		$scope.teams.push(teams[i]);
        	}
        	teamChannelMap[teams[i].id] = teams[i].channelName;
        }
        
        log('Teams', $scope.teams);
      });

      Resource.get("organization/channel/" + channelId + "/" + $scope.userData.slackTeamId + "/" + $scope.userId)
      .then(function(result) {
        log('init Timeout: Get channel : ', result); 
        $scope.userOrgId = result.userOrgId
        $scope.orgId = result.orgId;
        getSlackUsers();
        Milestone.getCurrent(result.orgId).then(function(result) {
          log('init Timeout: Get channel: get milestone ', result);
          $scope.milestoneModel.contributions = result.milestoneContributions;
          $scope.milestoneModel.contributors = result.milestoneContributors;
          $scope.contributorsCount = result.contributors;
          $scope.tokenCode = result.code;
          $scope.totalValue = result.totalValue;
        });
      });
    }, 1000);

  }

  function closeModal() {
    $modalInstance.dismiss('cancel');
  }
 
  $scope.buildMilestoneMessage = function(milestoneData) {
      var milestoneString = '';
      var contributorsLength = milestoneData.milestoneContributors.length;
      var index = 0;
      milestoneData.milestoneContributors.forEach(function(contributor) {
        if (index == contributorsLength - 1) {
        	milestoneString += '@' + slackUsersMap[contributor.id] + ' ' + contributor.percentage + '%';
        } else {
        	milestoneString += '@' + slackUsersMap[contributor.id] + ' ' + contributor.percentage + '%, ';
        }
        index++;
      });
      
      return 'New Milestone submitted' + '\n' + milestoneData.id +':' + channelId + '\n' + '*' + milestoneData.title + '*' + '\n' + milestoneData.description + '\n' + milestoneString;
    };
    
    $scope.buildMilestoneMessageForOrigin = function(milestoneData) {
        var milestoneString = '';
        var contributorsLength = milestoneData.milestoneContributors.length;
        var index = 0;
        milestoneData.milestoneContributors.forEach(function(contributor) {
          if (index == contributorsLength - 1) {
          	milestoneString += '@' + slackUsersMap[contributor.id] + ' ' + contributor.percentage + '%';
          } else {
          	milestoneString += '@' + slackUsersMap[contributor.id] + ' ' + contributor.percentage + '%, ';
          }
          index++;
        });
        
        return 'New Milestone submitted to #'+teamChannelMap[$scope.milestoneModel.evaluatingTeam]+ '\n' + '*' + milestoneData.title + '*' + '\n' + milestoneData.description + '\n' + milestoneString;
      };

    $scope.sendTestMessage = function(channelId, message) {
        console.log('sending test message to slack: ' + message);

        // 'https://slack.com/api/users.list'

        var url = 'https://slack.com/api/chat.postMessage';
        console.log('url: ' + url);
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
          success: function(response) {
            console.log('message posted successfully!');
          },
          persist: true,
          dataType: 'JSON'
        });
      };
      
  $scope.gotChannels = function(data) {
      console.log('recieved Channels:');
      //console.dir(data);

      // get specific channel:
      var channels = data.channels;
      for (var channelIndex in channels) {
        var channel = channels[channelIndex];
        // TODO removed hardcoded dependency on channel name
        if (channel.name == teamChannelMap[$scope.milestoneModel.evaluatingTeam]) {
          console.log('is random sending ...:');

          var channelId = channel.id;
          var message = $scope.buildMilestoneMessage($scope.currentSavedMilestone);
          $scope.sendTestMessage(channelId, message);
        }
        if (channel.id == $scope.milestoneModel.channelId) {
            console.log('is random sending ...:');

            var channelId = channel.id;
            var message = $scope.buildMilestoneMessageForOrigin($scope.currentSavedMilestone);
            $scope.sendTestMessage(channelId, message);
          }
      }
    };
  $scope.getChannels = function() {

      console.log('getting channels using access Token:' + $scope.access_token);

      // 'https://slack.com/api/users.list'

      var url = 'https://slack.com/api/channels.list';
      console.log('url:' + url);

      //var token = "xoxp-3655944058-3674335518-3694970236-83726d";
      var token = $scope.access_token;
      //  var key = 'c1bb14ae5cc544231959fc6e9af43218';
      var data = {
        token: token
          //,key:key
      };

      // TBD: move to use angularJS instead of Jquery and get rid of need to change  Host when we deploy...
      // TBD: which API ? do we get 'my boards or boards of project'
      $.ajax({
        type: "GET",
        url: url,
        data: data,
        success: $scope.gotChannels,
        persist: true,
        dataType: 'JSON'
      });

    };
    
  $scope.slackPlay = function(milestone) {
      console.dir(milestone);
      $scope.currentSavedMilestone = milestone;

      console.log('sending to slack, milestone:' + $scope.currentSavedMilestone.title);
      $scope.getChannels()

    };
    
  function submit() {
    log('Create Milestone', $scope.milestoneModel.title, $scope.milestoneModel.description, $scope.milestoneModel.evaluatingTeam, $scope.userOrgId);
    
    //SaveContribution.create({}, $scope.milestoneCreateModel);
    Milestone.create({
        owner: $scope.userId,
        title: $scope.milestoneModel.title,
        description: $scope.milestoneModel.description,
        evaluatingTeam: $scope.milestoneModel.evaluatingTeam,
        users_organizations_id: $scope.userOrgId
    }).then(function(result) {
      $scope.slackPlay(result);

      $modalInstance.close('submit');
      PostMessageService.hideIframe();
    });
  }

  function getProfile() {
    Account.getProfile()
    .success(function(user) {
      Account.setUserData(user);
      $scope.userData = Account.getUserData();
      $scope.userId = $scope.userData.userId;
      $scope.userName = $scope.userData.displayName;
      $scope.access_token = $scope.userData.access_token;
      PostMessageService.showIframe();
    })
    .error(function(error) {
      if (error && error.message) {
        PostMessageService.showAlert(error.message, 'error');
      } else {
        PostMessageService.showAlert('Please relogin', 'error');
      }
    });
  };

}