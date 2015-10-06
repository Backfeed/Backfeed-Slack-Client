angular.module('MyApp')
	.controller('MainCtrl', MainCtrl);


function MainCtrl($state, _DEV, PostMessageService, CurrentUser, Project) {

  Project.init();
  CurrentUser.init();

  var log = _DEV.log("MAIN CTRL");

  var GESTURES = {

    openAddProject: goToAddProject,
    openProjectStatus: goToProjectStatus,

    openAddContributionPage: goToAddContribution,
    openContributionStatusPage: goToContributionStatus,

    openAddEvaluationPage: goToAddEvaluation,

    openAddMilestone: goToAddMilestone,
    openMileStoneStatus: goToMileStoneStatus,
    openAddMileStoneEvaluationPage: goToAddMileStoneEvaluation,

    openMemberStatusPage: goToMemberStatus,
    
    showAlertFromMainCtr: showAlert,
    refreshWindows: refreshWindows,
    logout: logout

  };

  init();

  function init() {

    log('init');

    PostMessageService.init("myport");

    chrome.runtime.onMessage.addListener(onMessageListener);

  }

  //************    Listen to incoming messages in order to open modal and navigate the App       ************

  function onMessageListener(request, sender, sendResponse) {
    if (request.gesture && request.gesture in GESTURES) {
      GESTURES[request.gesture](request.options)
    }
  }

  function goToAddProject(channelId) {
    log('Creating Project');
    $state.go('addProject', {
      'channelId': channelId
    }, {
      reload: true
    });
  }

  function goToProjectStatus(channelId) {
    log('Project Status');
    $state.go('projectStatus', {
      'channelId': channelId,
      'mileStoneId': ''
    }, {
      reload: true
    });
  }

  function goToMileStoneStatus(mileStoneId) {
    log('Project Status from MileStone');
    $state.go('projectStatus', {
      'channelId': '',
      'mileStoneId': mileStoneId
    }, {
      reload: true
    });
  }

  function goToAddMilestone(channelId) {
    log('Creating Milestone');
    //PostMessageService.navigateToAddMilestone(); // NOT IMPLEMENTED
    $state.go('addMilestone', {
      'channelId': channelId
    }, {
      reload: true
    });
  }

  function goToAddContribution(channelId) {
    log('Starting contributions' + channelId);
    $state.go('createContribution', {
      'channelId': channelId
    }, {
      reload: true
    });
  }

  function goToAddEvaluation(contributionId) {
    log('Starting evaluations for contributionID: ' + contributionId);
    $state.go('evaluations', {
      'contributionId': contributionId
    }, {
      reload: true
    });
  }

  function goToAddMileStoneEvaluation(mileStoneId) {
    log('Starting evaluations for mileStoneId: ' + mileStoneId);
    $state.go('mileStoneEvaluations', {
      'mileStoneId': mileStoneId
    }, {
      reload: true
    });
  }

  function goToContributionStatus(contributionId) {
    log('Starting showing contribution status: ' + contributionId);
    $state.go('contributionStatus', {
      'contributionId': contributionId,
      'mileStoneId': ''
    }, {
      reload: true
    });
  }

  function goToMemberStatus(memberId) {
    log('Starting showing member status: ' + memberId);
    $state.go('memberStatus', {
      'memberId': memberId
    }, {
      reload: true
    });
  }

  function showAlert() {
    log('Showing Alert');
    PostMessageService.showAlert('You need to login in order to use the extension. Click the extension icon above.', 'error');
  }

  function refreshWindows() {
    log('Refresh Windows');
    PostMessageService.showAlert('Successful authorized. Please continue', 'success');
    PostMessageService.windowRefresh();
  }

  function logout() {
    log('Logging Out');
    PostMessageService.windowRefresh();
  }

}