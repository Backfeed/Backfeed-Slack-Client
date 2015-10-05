angular.module('MyApp')
  .controller('ProjectsCtrl', ProjectsCtrl);

function ProjectsCtrl(PostMessageService, $modal, $scope) {
  var modal = $modal.open({
    templateUrl: "ProjectsModalTmpl",
    controller: 'ProjectsModalCtrl',
    controllerAs: 'ctrl',
    scope: $scope,
    size: 'add-project',
    backdrop: 'static'
  });

  modal.result.then(
    function() { PostMessageService.hideIframe(); }, 
    function() { PostMessageService.hideIframe(); }
  );
}
