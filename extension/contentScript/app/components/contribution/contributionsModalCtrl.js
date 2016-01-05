angular.module('MyApp')
  .controller('ContributionsModalCtrl', ContributionsModalCtrl);

function ContributionsModalCtrl($stateParams, _DEV, Contribution, $modalInstance, PostMessageService,Project) {

  var log = _DEV.log('ADD CONTRIBUTION CTRL');

  var channelId = $stateParams.channelId;
  
  var contributionId = $stateParams.contributionId;
  

  var ctrl = this;

  angular.extend(ctrl, {
    closeModal: closeModal,
    submit: submit,
    contribution: { channelId: channelId },
    contributorsValid: true
  });

  var project = Project.getByChannelId(channelId);
  if(project == null){
  	PostMessageService.showAlert('Please create a collaborative project first, from the channel menu', 'error');
  	return;
  }
  
  
  init();

  function init() {

    PostMessageService.hideIframe();
    PostMessageService.showIframe();    
    if(contributionId != '' && contributionId != undefined){
    	getContribution();
    }

  }

  function closeModal() {
    $modalInstance.dismiss('cancel');
  }
  
  function getContribution() {
	    Contribution.get(contributionId).then(function(contribution) {
	      log("contribution", contribution);
	      ctrl.contribution = contribution;
	      //ctrl.contribution.contributors.push({})
	      ctrl.contribution.contributors[0].percentage = 100
	      contribution.channelId = channelId
	    });
	  }

  function submit() {
	 

	  if(contributionId != '' && contributionId != undefined){
		  Contribution.edit(ctrl.contribution).then(

			      function() {
			        PostMessageService.showAlert('Successfully updated contribution', 'success');
			        $modalInstance.close('submit');
			        PostMessageService.hideIframeEditContribution(ctrl.contribution);
			      },

			      function(err) {
			        log("submit", err);
			        PostMessageService.showAlert('Your contribution was not submitted', 'error');
			      }

			    );
	  }else{
		  Contribution.create(ctrl.contribution).then(

			      function() {
			        PostMessageService.showAlert('Successfully submitted contribution', 'success');
			        $modalInstance.close('submit');
			      },

			      function(err) {
			        log("submit", err);
			        PostMessageService.showAlert('Your contribution was not submitted', 'error');
			      }

			    );
	  }
  

  }

}