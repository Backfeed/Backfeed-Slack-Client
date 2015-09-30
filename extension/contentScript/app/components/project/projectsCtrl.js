angular.module('MyApp').controller('ProjectsCtrl',
    function(PostMessageService, $modal,$scope) {
        var modal = $modal.open({
            templateUrl: "ProjectsModalTmpl",
            controller: 'ProjectsModalCtrl',
            scope: $scope,
            size: 'add-project',
        });

        modal.result.then(function() {
            PostMessageService.hideIframe();
        }, function() {
            PostMessageService.hideIframe();
        });
    });
