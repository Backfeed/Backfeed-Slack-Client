angular.module('MyApp')
	.controller('EvaluationsModalCtrl', EvaluationsModalCtrl);

function EvaluationsModalCtrl($stateParams, $modalInstance, _DEV, PostMessageService, Project, Contribution) {

	var log = _DEV.log('CONTRIBUTION EVALUATION CTRL');

	var contributionId = $stateParams.contributionId;
	var contribution = Contribution.get(contributionId);

	var projectId = $stateParams.projectId;
	var project = Project.get(projectId);

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

		ctrl.contributionTitle = contribution.title;
		ctrl.tokenName = project.token_name;
		ctrl.code = project.code;

		PostMessageService.showIframe();

	}
	
	function closeModal() {
		$modalInstance.dismiss('cancel');
	}

	function submit() {

		$scope.isProcessing = true;

		Contribution.evaluate(contribution.id, ctrl.evaluation).then(function() {

			$modalInstance.close('submit');
      PostMessageService.hideIframe();
      
		});

	}

}