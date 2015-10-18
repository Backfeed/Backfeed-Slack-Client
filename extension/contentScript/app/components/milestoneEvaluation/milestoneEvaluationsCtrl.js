angular.module('MyApp')
  .controller('MilestoneEvaluationsCtrl', MilestoneEvaluationsCtrl);

function MilestoneEvaluationsCtrl(PostMessageService, $modal, $scope) {
  var modal = $modal.open({
    templateUrl: 'MilestoneEvaluationsModalTmpl',
    controllerAs: 'ctrl',
    controller: 'MilestoneEvaluationsModalCtrl',
    scope: $scope,
    size: 'md'
  });

  modal.opened.then(function() {
    $('div[modal-render]').remove();
  });

  modal.result.then(
    function() { PostMessageService.hideIframe(); }, 
    function() { PostMessageService.hideIframe(); }
  );
  
}