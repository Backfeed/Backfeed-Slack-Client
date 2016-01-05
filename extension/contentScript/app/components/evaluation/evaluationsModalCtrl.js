angular.module('MyApp')
	.controller('EvaluationsModalCtrl', EvaluationsModalCtrl);

function EvaluationsModalCtrl($stateParams, $modalInstance,$state, _DEV, PostMessageService, Project, Contribution) {

	var log = _DEV.log('CONTRIBUTION EVALUATION CTRL');

	var contributionId = $stateParams.contributionId;
	
	var frompage = $stateParams.frompage;
	var milestoneIdFrom    = $stateParams.milestoneIdFrom;

	var ctrl = this;

	angular.extend(ctrl, {

		closeModal: closeModal,
		submit: submit,
		isProcessing: false,
		evaluation: null

	});
	

	init();

	function init() {

		PostMessageService.hideIframe();

		getContribution();


		PostMessageService.showIframe();

	}

	function getContribution() {
		Contribution.get(contributionId).then(function(contribution) {
			log("contribution", contribution);
			ctrl.contribution = contribution;
		});
	}
	
	function closeModal() {
		$modalInstance.dismiss('cancel');
		console.log('frompage is'+frompage);
		if(frompage != '' && frompage != undefined && frompage == 'projectstatus'){
			$state.go('projectStatus', {'channelId': ctrl.contribution.channelId,'milestoneId': ''}, {reload: true});
		}
		
	}

	function submit() {

		ctrl.isProcessing = true;

		Contribution.evaluate(ctrl.contribution.id, ctrl.evaluation).then(function() {

			$modalInstance.close('submit');
			PostMessageService.hideIframe(contributionId);
			if(frompage != '' && frompage != undefined && frompage == 'projectstatus'){
				$state.go('projectStatus', {'channelId': ctrl.contribution.channelId,'milestoneId': ''}, {reload: true});
			}
		    if(frompage != '' && frompage != undefined && frompage == 'milestonestatus'){
				$state.go('contributionStatus', {'contributionId': '','milestoneId': milestoneIdFrom}, {reload: true});
			}									
      
		});

	}

}