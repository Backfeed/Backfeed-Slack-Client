angular.module('MyApp')
  .controller('ContributionsModalCtrl', ContributionsModalCtrl);

function ContributionsModalCtrl($stateParams, _DEV, Contribution, $modalInstance, PostMessageService) {

  var log = _DEV.log('Add Contribution');

  var channelId = $stateParams.channelId;

  var ctrl = this;

  angular.extend(ctrl, {
    closeModal: closeModal,
    submit: submit,
    contribution: { channelId: channelId },
    contributorsValid: true
  });

  init();

  function init() {

    PostMessageService.hideIframe();
    PostMessageService.showIframe();

  }

  function closeModal() {
    $modalInstance.dismiss('cancel');
  }

  function submit() {

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