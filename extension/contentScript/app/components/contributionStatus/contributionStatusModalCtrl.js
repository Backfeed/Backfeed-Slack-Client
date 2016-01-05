angular.module('MyApp')
  .controller('ContributionStatusModalCtrl', ContributionStatusModalCtrl);

function ContributionStatusModalCtrl($stateParams, $modalInstance,$state, _DEV, PostMessageService, Contribution,Milestone) {

  var log = _DEV.log("CONTRIBUTION STATUS CTRL");

  var contributionId = $stateParams.contributionId;
  var milestoneId    = $stateParams.milestoneId;
  var frompage = $stateParams.frompage;
  var milestoneIdFrom    = $stateParams.milestoneIdFrom;
  

  var ctrl = this;

  angular.extend(ctrl, {
    closeModal: closeModal,
    contribution: {}
  });

  init();

  function init() {

    PostMessageService.hideIframe();
    PostMessageService.showIframe();
    if(milestoneId != '' && milestoneId != undefined){
    	frompage = '';
    	ctrl.milestonePresent = 'true';
    	getMilestone();
    }else{
    	ctrl.milestonePresent = 'false';
    	getContribution();
    }
    
  }

  function getContribution() {
    Contribution.get(contributionId).then(function(contribution) {
      log("contribution", contribution);
      ctrl.contribution = contribution;
      ctrl.contribution.codeForScore = ctrl.contribution.code;
      if(ctrl.contribution.reputationPercentage > 0 ){
		  ctrl.contribution.reputationPercentage = '+'+ctrl.contribution.reputationPercentage;
	  }
	  if(ctrl.contribution.reputationPercentage < 0 ){
		  ctrl.contribution.reputationPercentage = '-'+ctrl.contribution.reputationPercentage;
	  }
      if(ctrl.contribution.teamValuation <=0 ){
    	  ctrl.contribution.teamValuation = '-';
    	  ctrl.contribution.code = '';
      }
      if(ctrl.contribution.myScore <=0 ){
    	  ctrl.contribution.myScore = '-';
    	  ctrl.contribution.codeForScore = '';
      }
    });
  }
  
  function getMilestone(){
	 Milestone.get(milestoneId).then(function(milestone) {
		 contributionId = milestone.contribution_id;
		 Contribution.get(contributionId).then(function(contribution) {
		      log("contribution", contribution);
		      ctrl.contribution = contribution;
		      ctrl.contribution.codeForScore = ctrl.contribution.code;
		      if(ctrl.contribution.teamValuation ==0 ){
		    	  ctrl.contribution.teamValuation = '-';
		    	  ctrl.contribution.code = '';
		      }
		      if(ctrl.contribution.myScore <=0 ){
		    	  ctrl.contribution.myScore = '-';
		    	  ctrl.contribution.codeForScore = '';
		      }
		      ctrl.contribution.title = milestone.title;
			  ctrl.contribution.description = milestone.description;
			  if(ctrl.contribution.reputationPercentage > 0 ){
				  ctrl.contribution.reputationPercentage = '+'+ctrl.contribution.reputationPercentage;
			  }
			  if(ctrl.contribution.reputationPercentage < 0 ){
				  ctrl.contribution.reputationPercentage = '-'+ctrl.contribution.reputationPercentage;
			  }
			  ctrl.milestoneContributions = milestone.contributions;
			  ctrl.milestoneContributors = milestone.contributors;
			  ctrl.tokens = milestone.tokens;
			  ctrl.code = milestone.code;
			  ctrl.totalSourceValue = milestone.totalSourceValue
			  ctrl.channelName = milestone.channelName
			  ctrl.code = milestone.code
		    });
	 });
  }
		       

  function closeModal() {
    $modalInstance.dismiss('cancel');
    if(frompage != '' && frompage != undefined && frompage == 'projectstatus'){
		$state.go('projectStatus', {'channelId': ctrl.contribution.channelId,'milestoneId': ''}, {reload: true});
	}
    if(frompage != '' && frompage != undefined && frompage == 'milestonestatus'){
		$state.go('contributionStatus', {'contributionId': '','milestoneId': milestoneIdFrom}, {reload: true});
	}
  }

}