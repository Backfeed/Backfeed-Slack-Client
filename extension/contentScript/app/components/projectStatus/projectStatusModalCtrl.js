angular.module('MyApp').controller('ProjectStatusModalCtrl', ProjectStatusModalCtrl);

function ProjectStatusModalCtrl($scope, $auth, $location, $state, $stateParams, $modalInstance, _DEV, CurrentUser, PostMessageService, ChannelProject, Milestone, Project) {

  var log = _DEV.log("PROJECT STATUS MODAL");

  var currentUser = CurrentUser.get();

  var channelId = $stateParams.channelId;
  var milestoneId = $stateParams.milestoneId !== '' ? parseInt($stateParams.milestoneId) : null; // availble if got here by pressing "status" button on milestone
  var project = Project.getByChannelId(channelId);
  var ctrl = this;
  angular.extend(ctrl, {

    closeModal: closeModal,
    updateViewforMilestone: updateViewforMilestone,
    selectedMilestonetId: milestoneId,
    channelName: project.channelName,
    milestones: [],
    milestoneContributors: [],
    activeContribution: {}

  });

  init();

  function init() {
    log("init", "channelId", channelId, "project", project);

    PostMessageService.hideIframe();
    PostMessageService.showIframe();

    Milestone.getAll(project.orgId).then(function(milestones) {
      log("init: milestones", milestones);
      ctrl.milestones = milestones;

      updateViewforMilestone();

    });

  }

  function updateViewforMilestone() {
    if (ctrl.selectedMilestonetId == null || ctrl.selectedMilestonetId == '') {

      Milestone.getCurrent(project.orgId).then(
        function(currentMilestone) {
          log('updateViewforMilestone: current:', currentMilestone);
          ctrl.milestoneContributors = currentMilestone.contributors;
          ctrl.milestoneContributions = currentMilestone.contributions;
          ctrl.totalValue = currentMilestone.totalValue;
          ctrl.tokens = currentMilestone.tokens;
          ctrl.code = currentMilestone.code;
        },

        function(err) {
          log('updateViewforMilestone ERROR', err);
        }

      );

    } else {

      Milestone.get(ctrl.selectedMilestonetId).then(

        function(selectedMilestone) {
          log('updateViewforMilestone: ', ctrl.selectedMilestonetId, selectedMilestone);

          ctrl.milestoneContributions = selectedMilestone.contributions;
          ctrl.milestoneContributors = selectedMilestone.milestoneContributors;
          ctrl.totalValue = selectedMilestone.totalValue;
          ctrl.tokens = selectedMilestone.tokens;
          ctrl.code = selectedMilestone.code;

        },

        function(err) {
          log('updateViewforMilestone ERROR', err);
        }

      );

    }

  }

  function closeModal() {
    $modalInstance.dismiss('cancel');
  };

}