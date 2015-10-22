angular.module('MyApp')
  .controller('ContributionStatusCtrl', ContributionStatusCtrl);

function ContributionStatusCtrl(PostMessageService, $modal, $scope) {

  var modal = $modal.open({
    templateUrl: "ContributionStatusModalTmpl",
    controllerAs: 'ctrl',
    controller: 'ContributionStatusModalCtrl',
    scope: $scope,
    size: 'contribution-status'
  });

  modal.opened.then(function() {
    $('div[modal-render]').remove();
  });

  modal.result.then(
    function() { PostMessageService.hideIframe(); }, 
    function() { PostMessageService.hideIframe(); }
  );
  
}