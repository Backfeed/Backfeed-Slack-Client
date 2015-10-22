angular.module('MyApp')
  .controller('ContributionStatusModalCtrl', ContributionStatusModalCtrl);

function ContributionStatusModalCtrl($stateParams, $modalInstance, _DEV, PostMessageService, Contribution) {

  var log = _DEV.log("CONTRIBUTION STATUS CTRL");

  var contributionId = $stateParams.contributionId;
  var milestoneId    = $stateParams.milestoneId;

  var ctrl = this;

  angular.extend(ctrl, {
    closeModal: closeModal,
    contribution: {}
  });

  init();

  function init() {

    PostMessageService.hideIframe();
    PostMessageService.showIframe();

    getContribution();
  }

  function getContribution() {
    Contribution.get(contributionId).then(function(contribution) {
      log("contribution", contribution);
      ctrl.contribution = contribution;
    });
  }

  function closeModal() {
    $modalInstance.dismiss('cancel');
  }

}