angular.module('MyApp').controller('ProjectStatusCtrl',
    function(PostMessageService, $modal,$scope) {
        var modal = $modal.open({
            templateUrl: "ProjectStatusModalTmpl",
            controller: 'ProjectStatusModalCtrl',
            scope: $scope,
            size: 'project-status'
        });

        modal.result.then(function() {
            PostMessageService.sendGesture('hideIframe');
        }, function() {
            PostMessageService.sendGesture('hideIframe');
        });
    });
