angular.module('MyApp').controller('ProjectStatusModalCtrl', ProjectStatusModalCtrl);

function ProjectStatusModalCtrl($scope, $auth, $location, $state, $stateParams, $modalInstance, _DEV, CurrentUser, PostMessageService, ChannelProject, Milestone) {

  var log = _DEV.log("PROJECT STATUS MODAL");

  var currentUser = CurrentUser.get();

  var channelId   = $stateParams.channelId;
  var mileStoneId = $stateParams.mileStoneId;

  var orgId       = '';

  var ctrl = this;

  angular.extend(ctrl, {

    closeModal: closeModal,
    updateViewforMileStone: updateViewforMileStone,
    channelName: '',
    selectedMileStonetId: '',
    milestones: [],
    milestoneContributers: [],
    currentUser: currentUser,
    activeContribution: {}

  });

  init();

  function init() {

    PostMessageService.hideIframe();
    PostMessageService.showIframe();
    
    getCurrentProjectStatus();

    // CurrentUser.get().then(function(me) {
    //   log('CurrentUser.get', me);
    // });

  }

  function updateViewforMileStone() {

    if (ctrl.selectedMileStonetId === '')
      return;

    Milestone.get(ctrl.selectedMileStonetId).then(

      function(result) {

        $scope.projectStatusModel = result;
        log("updateViewforMileStone: TODO: assignto controller instead of projectStatusModel");

        orgId            = result.current_org_id;
        ctrl.channelName = result.channelName;

      },

      function(err) {
        log('updateViewforMileStone ERROR', err);
      }

    );

  }

  function getCurrentProjectStatus() {

    if ( !( channelId && channelId != 0 && channelId != '' ) )
      return;

    var ChannelProjectExistsData = ChannelProject.exists({
      channelId: channelId,
      slackTeamId: currentUser.slackTeamId,
      userId: currentUser.userId
    });

    ChannelProjectExistsData.$promise.then(function(result) {
      orgId            = result.orgId;
      ctrl.channelName = result.channelName;

      Milestone.getAll(orgId).then(function(milestones) {
        ctrl.milestones = milestones;
      });

      Milestone.getCurrent(orgId).then(function(result) {
        angular.extend(ctrl, {

          milestoneContributers: result.milestoneContributers,
          milestoneContributions: result.milestoneContributions,
          tokenName: result.tokenName,
          tokens: result.tokens,
          totalValue: result.totalValue

        });

      });

    });

  }

  function closeModal() {
    $modalInstance.dismiss('cancel');
  };

}