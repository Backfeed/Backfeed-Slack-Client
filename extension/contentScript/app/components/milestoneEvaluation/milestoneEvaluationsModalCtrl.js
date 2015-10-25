angular.module('MyApp')
  .controller('MilestoneEvaluationsModalCtrl', MilestoneEvaluationsModalCtrl);

function MilestoneEvaluationsModalCtrl($stateParams, $modalInstance, _DEV, PostMessageService, Milestone) {
	
  var log = _DEV.log('MILESTONE EVALUATION CTRL');

  var milestoneId  = $stateParams.milestoneId;
	var evaluationId = $stateParams.evaluationId;
	var projectId    = $stateParams.projectId;

  var ctrl = this;

	angular.extend(ctrl, {
    closeModal: closeModal,
		submit: submit,
		evaluation: { milestoneId: milestoneId }
	});

	init();

	function init() {

	  PostMessageService.hideIframe();
	  PostMessageService.showIframe();

	  getMilestone();
		
	}

  function closeModal() {
    $modalInstance.dismiss('cancel');
  }


  function getMilestone() {

  	Milestone.get(milestoneId).then(function(milestone) {
  		log("milestone", milestone);
  		ctrl.milestone = milestone;
  	});

  }

  function submit() {

    log("submit", ctrl.evaluation);

    ctrl.isProcessing = true;

    Milestone.evaluate(ctrl.evaluation).then(

      function() { 

        ctrl.isProcessing = true;
        $modalInstance.close('submit');
        PostMessageService.showAlert('Evaluation submitted', 'success');
        PostMessageService.hideIframeMilstone(milestoneId);

      },

      function(response) {

        PostMessageService.showAlert(response.data, 'error');

      }
      
    );

  }

}