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
    updateViewforMilestone: updateViewforMilestone,
    selectedMilestonetId: mileStoneId,
    channelName: project.channelName,
    milestones: [],
    milestoneContributors: [],
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

    if (ctrl.selectedMilestonetId === ''){
    	Milestone.getCurrent(project.orgId).then(function(currentMilestone) {
    	      log("init: current milestones", currentMilestone);
    	      angular.extend(ctrl, {

    	        milestoneContributors: currentMilestone.milestoneContributors,
    	        milestoneContributions: currentMilestone.milestoneContributions,
    	        tokenName: currentMilestone.tokenName,
    	        tokens: currentMilestone.tokens,
    	        totalValue: currentMilestone.totalValue

    	      });

    	    });
    }else{
    	Milestone.get(ctrl.selectedMilestonetId).then(function(result) {
    		  log('updateViewforMilestone', result);
    	      angular.extend(ctrl, {

    	        milestoneContributors: result.milestoneContributors,
    	        milestoneContributions: result.milestoneContributions,
    	        tokenName: result.tokenName,
    	        tokens: result.tokens,
    	        totalValue: result.totalValue

    	      });

    	    });
    }
        

  }

  function updateViewforMilestone() {
    if (ctrl.selectedMilestonetId == null || ctrl.selectedMilestonetId == ''){
    		Milestone.getCurrent(project.orgId).then(function(currentMilestone) {
    					ctrl.milestoneContributors = currentMilestone.milestoneContributors;
    					ctrl.milestoneContributions = currentMilestone.milestoneContributions;
    					ctrl.totalValue = currentMilestone.totalValue;
    					ctrl.tokens = currentMilestone.tokens;
    		      },

    		      function(err) {
    		        log('updateViewforMilestone ERROR', err);
    		      }

    		    );
    	return;
    }
      

    Milestone.get(ctrl.selectedMilestonetId).then(

      function(result) {
        log('updateViewforMilestone', result);

        ctrl.milestoneContributions = result.milestoneContributions;
        ctrl.milestoneContributors = result.milestoneContributors;
        ctrl.totalValue = result.totalValue;
        ctrl.tokens = result.tokens;
      },

      function(err) {
        log('updateViewforMilestone ERROR', err);
      }

    );

  }

  function closeModal() {
    $modalInstance.dismiss('cancel');
  };

}