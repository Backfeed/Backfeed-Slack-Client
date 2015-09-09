angular.module('MyApp').controller('ProjectsCtrl',
    function(PostMessageService, $modal,$scope) {
        var modal = $modal.open({
            templateUrl: "ProjectsModalTmpl",
            controller: 'ProjectsModalCtrl',
            scope: $scope
        });

        modal.result.then(function() {
            PostMessageService.sendGesture('hideIframe');
        }, function() {
            PostMessageService.sendGesture('hideIframe');
        });
    });