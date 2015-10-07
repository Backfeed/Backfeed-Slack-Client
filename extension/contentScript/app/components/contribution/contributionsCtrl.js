angular.module('MyApp')
  .controller('ContributionsCtrl', ContributionsCtrl);

function ContributionsCtrl(PostMessageService, $modal, $scope) {
  
  var modal = $modal.open({
    templateUrl: "ContributionsModalTmpl",
    controller: 'ContributionsModalCtrl',
    controllerAs: 'ctrl',
    scope: $scope,
    size: 'add-contribution'
  });

  modal.opened.then(function() {
    $('div[modal-render]').remove();
  });

  modal.result.then(
    function() { PostMessageService.hideIframe(); }, 
    function() { PostMessageService.hideIframe(); }
  );

}