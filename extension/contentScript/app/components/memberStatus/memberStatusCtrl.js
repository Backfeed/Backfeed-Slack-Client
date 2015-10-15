angular.module('MyApp')
  .controller('MemberStatusCtrl', MemberStatusCtrl);

function MemberStatusCtrl(PostMessageService, $modal, $scope) {

  var modal = $modal.open({
    templateUrl: "MemberStatusModalTmpl",
    controller: 'MemberStatusModalCtrl',
    scope: $scope,
    size: 'member-status'
  });

  modal.opened.then(function() {
    $('div[modal-render]').remove();
  });

  modal.result.then(
    function() { PostMessageService.hideIframe(); }, 
    function() { PostMessageService.hideIframe(); }
  );
  
}