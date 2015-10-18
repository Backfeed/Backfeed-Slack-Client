angular.module('MyApp')
  .controller('MilestoneCtrl', MilestoneCtrl);

function MilestoneCtrl(PostMessageService, $modal, $scope) {

  var modal = $modal.open({
    templateUrl: "MilestoneModalTmpl",
    controller: 'MilestoneModalCtrl',
    controllerAs: 'ctrl',
    scope: $scope,
    size: 'add-milestone'
  });

  modal.opened.then(function() {
    $('div[modal-render]').remove();
  });

  modal.result.then(
    function() { PostMessageService.hideIframe(); }, 
    function() { PostMessageService.hideIframe(); }
  );

}