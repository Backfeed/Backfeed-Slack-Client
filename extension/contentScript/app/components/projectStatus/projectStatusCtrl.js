angular.module('MyApp').controller('ProjectStatusCtrl', ProjectStatusCtrl);

function ProjectStatusCtrl($scope, $modal, PostMessageService) {
  var modal = $modal.open({
    templateUrl: "ProjectStatusModalTmpl",
    controller: 'ProjectStatusModalCtrl',
    controllerAs: 'ctrl',
    scope: $scope,
    size: 'project-status'
  });

  modal.result.then(
    function() { PostMessageService.hideIframe(); }, 
    function() { PostMessageService.hideIframe(); }
  );
}