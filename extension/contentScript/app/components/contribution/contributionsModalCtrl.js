angular.module('MyApp').controller('ContributionsModalCtrl', ContributionsModalCtrl);

function ContributionsModalCtrl($scope, $auth, $location, $stateParams, _DEV, Contributions,
  ContributionDetail, SaveContribution, Account, Users, $modalInstance, PostMessageService, ChannelProject) {

  var log = _DEV.log('Add Contribution');

  var channelId = $stateParams.channelId;
  var contributionId = $stateParams.contributionId;
  var slackUsersMap = {};
  var projectId = '';


  var model = {
    title: '',
    file: '',
    owner: '',
    min_reputation_to_close: '',
    contributors: [],
    users_organizations_id: ''
  };

  angular.extend($scope, {
    closeModal: closeModal,
    currencyFormatting: currencyFormatting,
    submit: submit,

    foo: {},
    buttonDisabled: false,
    orderProp: "time_created",
    model: model
  });

  init();

  function init() {

    if (!$auth.isAuthenticated()) {
      $location.path('splash');
    } else {
      log(' channelId' + channelId);
      if (channelId && channelId != 0) {
        var userData = Account.getUserData();
        if (userData == undefined) {
          log('userData is not defined' + userData);
          getProfile();
        } else {
          log('userData is  defined' + userData);
          $scope.userId = userData.userId;
          $scope.slackTeamId = userData.slackTeamId;
          $scope.access_token = userData.access_token;
          $scope.displayName = userData.displayName;
          log('userData is  defined userId' + $scope.userId);
          ChannelProjectExists();
        }
      }
    }

  }

  function getProjectUsers() {
    $scope.data = Users.getProject.getUsers({
      projectId: projectId
    });
    $scope.data.$promise.then(function(result) {
      Users.setAllProjectUsersData(result);
      $scope.users = result;

      for (var i = 0; i < $scope.users.length; i++) {
        slackUsersMap[$scope.users[i].id] = $scope.users[i].name;
      }

    });
  };

  function closeModal() {
    $modalInstance.dismiss('cancel');
  };

  function currencyFormatting(value) {
    return value.toString() + " $";
  };

  function ChannelProjectExists() {
    log("In ChannelProjectExists method");
    $scope.ChannelProjectExistsData = ChannelProject.exists({
      channelId: channelId,
      slackTeamId: $scope.slackTeamId,
      userId: $scope.userId
    });

    $scope.ChannelProjectExistsData.$promise.then(function(result) {
      if (result.channleOrgExists == 'true') {
        $scope.users_projects_id = result.userOrgId;
        $scope.projectId = result.orgId;
        projectId = $scope.projectId;
        $scope.model.users_organizations_id = result.userOrgId;
        $scope.model.ownerId = $scope.userId;
        PostMessageService.gesture.showIframe();
        var allProjectUsersData = Users.getAllProjectUsersData();
        if (allProjectUsersData == undefined) {
          getProjectUsers();
        } else {
          $scope.users = allProjectUsersData;
        }
      } else {
        $modalInstance.close('submit');
        PostMessageService.sendGesture('hideIframe');
        PostMessageService.gesture.showAlert('In order to submit a contribution to this channel, click on the channel name above and "Add a Collaborative Project"', 'error');
      }

    });

  };


  function getProfile() {
    Account.getProfile().success(function(user) {
      $scope.userId = user.userId;
      $scope.access_token = user.access_token;
      $scope.slackTeamId = user.slackTeamId;
      $scope.displayName = user.displayName;
      ChannelProjectExists();
      Account.setUserData(user);

    }).error(function(error) {
      if (error && error.message) {
        PostMessageService.gesture.showAlert(error.message, 'error');
      } else {
        PostMessageService.gesture.showAlert('Please relogin', 'error');
      }
    });
  };

  function submit() {
    log("Submit", $scope.model);
    $scope.data = SaveContribution.save({}, $scope.model);
    $scope.data.$promise.then(function(result) {

      slackPlay(result);

      $modalInstance.close('submit');
      PostMessageService.sendGesture('hideIframe');
      log('projectId is' + projectId);
      //$state.go('evaluations', {'contributionId': result.id,'projectId':projectId});

    }, function(error) {
      log('Error in submitting Contribution');
      PostMessageService.gesture.showAlert('Your Contribution was not submitted.', 'error');
    });
  };

  // ******************************* SLACK PLAY ***********************

  function buildContributionMessage(contributionData) {
    var contributorsString = '';
    var contributorsLength = contributionData.contributionContributors.length;
    var index = 0;
    contributionData.contributionContributors.forEach(function(contributor) {
      if (index == contributorsLength - 1) {
        contributorsString += '@' + slackUsersMap[contributor.id] + ' ' + contributor.percentage + '%';
      } else {
        contributorsString += '@' + slackUsersMap[contributor.id] + ' ' + contributor.percentage + '%, ';
      }
      index++;
    });

    return 'New contribution submitted' + '\n' + contributionData.id + '\n' + '*' + contributionData.title + '*' + '\n' + contributionData.file + '\n' + contributorsString;
  };

  function sendTestMessage(channelId, message) {
    log('sending test message to slack: ' + message);

    // 'https://slack.com/api/users.list'

    var url = 'https://slack.com/api/chat.postMessage';
    log('url: ' + url);
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
    //    log('message posted successfully!');
    //}).error(function(response) {
    //    log('message posted erroneously!');
    //});
    $.ajax({
      type: "GET",
      url: url,
      data: data,
      success: function(response) {
        log('message posted successfully!');
      },
      persist: true,
      dataType: 'JSON'
    });
  };

  function gotChannels(data) {
    log('recieved Channels:');
    //console.dir(data);

    // get specific channel:
    var channels = data.channels;
    for (var channelIndex in channels) {
      var channel = channels[channelIndex];
      // TODO removed hardcoded dependency on channel name
      if (channel.id == $scope.currentSavedContribution.channelId) {
        log('is random sending ...:');

        var channelId = channel.id;
        var message = buildContributionMessage($scope.currentSavedContribution);
        sendTestMessage(channelId, message);
      }
    }
  };

  function getChannels() {

    log('getting channels using access Token:' + $scope.access_token);

    // 'https://slack.com/api/users.list'

    var url = 'https://slack.com/api/channels.list';
    log('url:' + url);

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
      success: gotChannels,
      persist: true,
      dataType: 'JSON'
    });

  };

  function slackPlay(contribution) {
    console.dir(contribution);
    $scope.currentSavedContribution = contribution;

    log('sending to slack, contribution:' + $scope.currentSavedContribution.title);
    getChannels()

  };

}