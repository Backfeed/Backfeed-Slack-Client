angular.module('MyApp').controller('ProjectStatusModalCtrl', ProjectStatusModalCtrl);

function ProjectStatusModalCtrl($scope, $auth, $location, $state, $stateParams, $modalInstance, _DEV, CurrentUser, PostMessageService, ChannelProject, Milestone, Project) {

  var log = _DEV.log("PROJECT STATUS MODAL");

  var currentUser = CurrentUser.get();

  var channelId   = $stateParams.channelId;
  var mileStoneId = $stateParams.mileStoneId;
  var project     = Project.getByChannelId(channelId);
  var ctrl = this;

  angular.extend(ctrl, {

    closeModal: closeModal,
    updateViewforMileStone: updateViewforMileStone,
    selectedMileStonetId: '',
    channelName: project.channelName,
    currentUser: currentUser,
    milestones: [],
    milestoneContributers: [],
    activeContribution: {}

  });

  init();

  function init() {

    PostMessageService.hideIframe();
    PostMessageService.showIframe();
    
    Milestone.getAll(project.orgId).then(function(milestones) {
      log("init: milestones", milestones);
      ctrl.milestones = milestones;
    });

    Milestone.getCurrent(project.orgId).then(function(currentMilestone) {
      log("init: current milestones", currentMilestone);
      angular.extend(ctrl, {

        milestoneContributers: currentMilestone.milestoneContributers,
        milestoneContributions: currentMilestone.milestoneContributions,
        tokenName: currentMilestone.tokenName,
        tokens: currentMilestone.tokens,
        totalValue: currentMilestone.totalValue

      });

    });

  }

  function updateViewforMileStone() {

    if (ctrl.selectedMileStonetId === '')
      return;

    Milestone.get(ctrl.selectedMileStonetId).then(

      function(result) {

        $scope.projectStatusModel = result;
        log("updateViewforMileStone: TODO: assignto controller instead of projectStatusModel");

      },

      function(err) {
        log('updateViewforMileStone ERROR', err);
      }

    );

  }

  function closeModal() {
    $modalInstance.dismiss('cancel');
  };

}