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
    openMilestoneStatus: goToMilestoneStatus,
    openAddMilestoneEvaluationPage: goToAddMilestoneEvaluation,

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
      'milestoneId': ''
    }, {
      reload: true
    });
  }

  function goToMilestoneStatus(options) {
	var optionsAsArray = options.split(",");
	var milestoneId = optionsAsArray[0];
	var channelId = optionsAsArray[1];
    log('Project Status from Milestone'+channelId);
    log('Project Status from Milestone'+milestoneId);
    $state.go('projectStatus', {
      'channelId': channelId,
      'milestoneId': milestoneId
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

  function goToAddMilestoneEvaluation(milestoneId) {
    log('Starting evaluations for milestoneId: ' + milestoneId);
    $state.go('milestoneEvaluations', {
      'milestoneId': milestoneId
    }, {
      reload: true
    });
  }

  function goToContributionStatus(contributionId) {
    log('Starting showing contribution status: ' + contributionId);
    $state.go('contributionStatus', {
      'contributionId': contributionId,
      'milestoneId': ''
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