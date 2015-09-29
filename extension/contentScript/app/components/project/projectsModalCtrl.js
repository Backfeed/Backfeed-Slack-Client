angular.module('MyApp')
  .controller('ProjectsModalCtrl', ProjectsModalCtrl);

function ProjectsModalCtrl($scope, $auth, $location, $timeout, $stateParams, _DEV, Slack, SaveProject, Account, Users, AllSlackUsers, CheckProjectTokenName, $modalInstance, $state, CheckProjectCode, PostMessageService, ChannelProject) {

  log = _DEV.log('NEW PROJECT');

  var channelId = $stateParams.channelId
  var validationFailureForTokenName = false;
  var validationFailureForCode = false;

  var projectModel = {
    token_name: '',
    slack_teamid: '',
    name: '',
    code: '',
    token: '',
    channelId: channelId,
    channelName: '',
    a: '50',
    b: '50',
    access_token: '',
    contributers: [{
      id: '0',
      percentage: '100',
      name: '',
      contributer_fullname: '',
      contribution1: '50',
      className: 'contributer-cell-wrapper',
      img: '/extension/contentScript/app/images/icon-dude.png'
    }]
  };

  var rangeSlider = {
    options: {
      min: 1,
      max: 100,
      range: 'min'
    }
  };


  angular.extend($scope, {

    removeCollaboratorItem: removeCollaboratorItem,
    closeModal: closeModal,
    getTotalSum: getTotalSum,
    updateContributer: updateContributer,
    clickContributer: clickContributer,
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
    log("userData is" + $scope.userData);

    if ($scope.userData == undefined) {
      getProfile();
    } else {
      $scope.userId = $scope.userData.userId;
      $scope.projectModel.name = $scope.userData.slackTeamName;
      $scope.projectModel.slack_teamid = $scope.userData.slackTeamId;
      $scope.projectModel.contributers[0].id = $scope.userData.slackUserId;
      $scope.projectModel.contributers[0].name = $scope.userData.displayName;
      angular.element('#' + $scope.projectModel.contributers[0].id).trigger('focus');
      var sliderDivElement = angular.element('#slider' + $scope.projectModel.contributers[0].id + " div");
      sliderDivElement.removeClass('ui-widget-header-active');
      sliderDivElement.addClass('ui-widget-header-active');
      var sliderSpanElement = angular.element('#slider' + $scope.projectModel.contributers[0].id + " span");
      sliderSpanElement.removeClass('ui-slider-handle-show');
      sliderSpanElement.addClass('ui-slider-handle-show');
      $scope.projectModel.contributers[0].className = "contributer-cell-wrapper active-contributer";
      $scope.access_token = $scope.userData.access_token;
      $scope.projectModel.access_token = $scope.access_token;
      getProjectUsers($scope.access_token,'','');
      $scope.ChannelProjectExistsData = ChannelProject.exists({
        channelId: channelId,
        slackTeamId: $scope.projectModel.slack_teamid,
        userId: $scope.userId
      });

      $scope.ChannelProjectExistsData.$promise.then(function(result) {
        if (result.channleOrgExists == 'true') {
          PostMessageService.gesture.showAlert('Organization already exists for this channel', 'error');
        } else {
          PostMessageService.gesture.showIframe();
        }
      });
    }

    $scope.orderProp = "name";

    if (!$auth.isAuthenticated()) {
      $location.path('splash');
    }

    $timeout(function() {
      Slack.getChannel(channelId, $scope.access_token)
      .then(function(result) {
        $scope.channelName = result.channel.name;
        log('Slack.getChannel', result.channel.name, result);
      });
    }, 2000);

  }


  function closeModal() {
    $modalInstance.dismiss('cancel');
  };

  function getProjectUsers(access_token,userIds,searchString) {
    $scope.data = AllSlackUsers.allSlackUsers({'access_token':access_token,'userIds':userIds,'searchString':searchString});
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

      for (var i = 0; i < $scope.users.length; i++) {
        if ($scope.users[i].id == $scope.userData.slackUserId) {
          $scope.projectModel.contributers[0].img = $scope.users[i].url;
          $scope.projectModel.contributers[0].name = $scope.users[i].name;
          $scope.projectModel.contributers[0].contributer_fullname = $scope.users[i].real_name;
          angular.element('#' + $scope.projectModel.contributers[0].id).trigger('focus');
          sliderDivElement = angular.element('#slider' + $scope.projectModel.contributers[0].id + " div");
          sliderDivElement.removeClass('ui-widget-header-active');
          sliderDivElement.addClass('ui-widget-header-active');
          sliderSpanElement = angular.element('#slider' + $scope.projectModel.contributers[0].id + " span");
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
        $scope.projectModel.access_token = $scope.access_token;
        $scope.projectModel.contributers[0].id = $scope.userData.slackUserId;
        $scope.projectModel.contributers[0].name = $scope.userData.displayName;
        angular.element('#' + $scope.projectModel.contributers[0].id).trigger('focus');
        sliderDivElement = angular.element('#slider' + $scope.projectModel.contributers[0].id + " div");
        sliderDivElement.removeClass('ui-widget-header-active');
        sliderDivElement.addClass('ui-widget-header-active');
        sliderSpanElement = angular.element('#slider' + $scope.projectModel.contributers[0].id + " span");
        sliderSpanElement.removeClass('ui-slider-handle-show');
        sliderSpanElement.addClass('ui-slider-handle-show');
        $scope.projectModel.contributers[0].className = "contributer-cell-wrapper active-contributer";
        getProjectUsers($scope.access_token,'','');
        $scope.ChannelProjectExistsData = ChannelProject.exists({
          channelId: channelId,
          slackTeamId: $scope.projectModel.slack_teamid,
          userId: $scope.userId
        });
        $scope.ChannelProjectExistsData.$promise.then(function(result) {
          if (result.channleOrgExists == 'true') {
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

  function getTotalSum() {
    var total = 0;

    $.each($scope.projectModel.contributers, function(i, contributer) {
      if (contributer.percentage === '')
        return;

      total += parseFloat(contributer.percentage);
    });

    return total;
  }

  function updateContributer(selectedUser) {

    if (selectedUser.id == '') {
      return;
    }
    log('update contributer: ', selectedUser);
    addCollaborator(selectedUser);
    var urlImage = '';
    var userName = '';
    for (i = 0; i < $scope.users.length; i++) {
      if ($scope.users[i].id == selectedUser.id) {
        urlImage = $scope.users[i].url;
        userName = $scope.users[i].name;
        break;
      }
    }

    var allcontributers = $scope.projectModel.contributers;
    //contPercentage = 100/allcontributers.length;

    for (var i = 0; i < allcontributers.length; i++) {
      if (allcontributers[i].id == 0 && allcontributers[i].percentage == '') {
        log('comes here firt');
        allcontributers[i].id = selectedUser.id;

        //allcontributers[i].percentage = contPercentage;
        allcontributers[i].img = urlImage;

      }

    }

    setTimeout(function() {
      angular.element('#' + selectedUser.id).trigger('focus');
      $scope.projectModel.contributers[0].className = "media contributer-cell active-contributer";

    }, 100);

  };

  function clickContributer(contributerId) {
    angular.element('#' + contributerId).trigger('focus');
    log('contributerId is ' + contributerId);

    var allcontributers = $scope.projectModel.contributers,
      sliderDivElement,
      sliderSpanElement;

    for (var i = 0; i < allcontributers.length; i++) {
      if (allcontributers[i].id != contributerId) {
        sliderDivElement = angular.element('#slider' + allcontributers[i].id + " div");
        sliderDivElement.removeClass('ui-widget-header-active');
        allcontributers[i].className = "contributer-cell-wrapper";
        sliderSpanElement = angular.element('#slider' + allcontributers[i].id + " span");
        sliderSpanElement.removeClass('ui-slider-handle-show');
        allcontributers[i].className = "contributer-cell-wrapper";
      } else {
        angular.element('#' + allcontributers[i].id).trigger('focus');
        sliderDivElement = angular.element('#slider' + allcontributers[i].id + " div");
        sliderDivElement.removeClass('ui-widget-header-active');
        sliderDivElement.addClass('ui-widget-header-active');
        sliderSpanElement = angular.element('#slider' + allcontributers[i].id + " span");
        sliderSpanElement.removeClass('ui-slider-handle-show');
        sliderSpanElement.addClass('ui-slider-handle-show');
        allcontributers[i].className = "contributer-cell-wrapper active-contributer";
      }
    }
  };


  function removeCollaboratorItem(contributerId, index) {
    $scope.projectModel.contributers.splice(index, 1);
    var allcontributers = $scope.projectModel.contributers;
    $scope.updatedUsersList = [];
    $scope.selectedContributerId = '';
    for (var i = 0; i < $scope.users.length; i++) {
      var userExist = false;
      for (var j = 0; j < allcontributers.length; j++) {
        if ($scope.users[i].id == allcontributers[j].id) {
          userExist = true;
          break;
        }
      }
      if (userExist == false) {
        $scope.updatedUsersList.push($scope.users[i]);
      }
    }
  };

  function addCollaborator(selectedUser) {
    log('addCollaborator: ', selectedUser);
    var allcontributers = $scope.projectModel.contributers;
    $scope.updatedUsersList = [];
    $scope.selectedContributerId = '';
    for (var i = 0; i < $scope.users.length; i++) {
      if ($scope.users[i].id == selectedUser.id) {
        continue;
      }
      var userExist = false;
      for (var j = 0; j < allcontributers.length; j++) {
        if ($scope.users[i].id == allcontributers[j].id) {
          userExist = true;
          break;
        }
      }
      if (userExist == false) {
        $scope.updatedUsersList.push($scope.users[i]);
      }
    }
    $scope.projectModel.contributers.push({
      id: selectedUser.id,
      percentage: '',
      name: selectedUser.name,
      contribution1: '50',
      className: 'media contributer-cell',
      img: selectedUser.url
    });
    //$scope.buttonDisabled = true;
  };


  function changeTeam() {
    log('comes here in logout');
    $state.go("logout");

  };

  // ******************************* SLACK PLAY ***********************

  $scope.sendTestMessage = function(channelId, message) {
    log('sending test message to slack: ' + message);

    // 'https://slack.com/api/users.list'

    var url = 'https://slack.com/api/chat.postMessage';
    log('url: ' + url);

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

  $scope.gotChannels = function(data) {
    log('received Channels:');
    //console.dir(data);

    // get specific channel:
    var channels = data.channels;
    var message = 'New Collaborative Project created' + ' https://chrome.google.com/webstore/detail/backfeed-slack-extension/feglgahjbjnabofomkpmoacillfnpjpb';
    for (var channelIndex in channels) {
      var channel = channels[channelIndex];
      log('channel.name:' + channel.name);
      if (channel.name == 'testextenstion') {
        //if(channel.name == 'general'){
        var testChannelId = channel.id;
        $scope.sendTestMessage(testChannelId, message);
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
      success: $scope.gotChannels,
      persist: true,
      dataType: 'JSON'
    });

  };


  $scope.gotChannelsForProjectCreation = function(data) {
    log('received Channels:');
    //console.dir(data);

    // get specific channel:
    var channels = data.channels;
    for (var channelIndex in channels) {
      var channel = channels[channelIndex];
      if (channel.id == channelId) {
        $scope.projectModel.channelName = channel.name;
        break;
      }
    }
    $scope.data = SaveProject.save({}, $scope.projectModel);
    $scope.data.$promise.then(function(result) {
      log('channels Ids are' + result.channelId);
      PostMessageService.gesture.setChannelId(result.channelId);
      $scope.userData.orgId = result.organization_id;
      $scope.userData.userOrgId = result.id;
      $scope.userData.projectExists = "true";
      log('Inserted project id : ' + result.organization_id);
      log('Inserted user project id : ' + result.id);
      Account.setUserData($scope.userData);
      $scope.slackPlay($scope.projectModel.name);
      PostMessageService.gesture.showAlert('Successfully created project', 'success');
      $modalInstance.close('submit');
      //$state.go('createContribution', {'channelId': channelId}, {reload: true});
    }, function(error) {
      log('Error in creating project');
      PostMessageService.gesture.showAlert('Your project was not created', 'error');
    });
  };

  function getChannelsForProjectCreation() {

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
      success: $scope.gotChannelsForProjectCreation,
      persist: true,
      dataType: 'JSON'
    });

  };

  $scope.slackPlay = function(projectName) {
    console.dir(projectName);
    $scope.currentProjectName = projectName;

    log('sending to slack, projectName: ' + $scope.currentProjectName);
    getChannels();

  };
  // *****************************************************




  function submit() {
    if ($scope.projectModel.token_name != '') {
      $scope.data1 = CheckProjectTokenName.CheckProjectTokenName({
        tokenName: $scope.projectModel.token_name
      });
      $scope.data1.$promise.then(function(result) {
        if (result.tokenAlreadyExist == 'true') {
          log('comes here in true for token');
          validationFailureForTokenName = true;
          PostMessageService.gesture.showAlert('This name is already taken. Please use a different one', 'error');
        } else {
          log('comes here in false for token');
          validationFailureForTokenName = false;
          if ($scope.projectModel.code != '') {
            $scope.data1 = CheckProjectCode.CheckProjectCode({
              code: $scope.projectModel.code
            });
            $scope.data1.$promise.then(function(result) {
              if (result.codeAlreadyExist == 'true') {
                validationFailureForCode = true;
                PostMessageService.gesture.showAlert('This code is already taken. Please use a different one', 'error');
              } else {
                log('comes here in false for token');
                validationFailureForCode = false;
                log("In Submit method");
                log($scope.projectModel);
                getChannelsForProjectCreation();

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
    return "<div class='select-contributer flex'><img src='" + data.url + "' /><div>" + data.name + "<br />" + data.real_name + "</div></div>";
  }
}