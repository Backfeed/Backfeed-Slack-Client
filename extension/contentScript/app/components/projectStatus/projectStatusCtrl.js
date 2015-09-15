angular.module('MyApp').controller('ProjectStatusCtrl',
    function(PostMessageService, $modal,$scope) {
        var modal = $modal.open({
            templateUrl: "ProjectStatusModalTmpl",
            controller: 'ProjectStatusModalCtrl',
            scope: $scope,
            size: 'lg'            
        });

        modal.result.then(function() {
            PostMessageService.sendGesture('hideIframe');
        }, function() {
            PostMessageService.sendGesture('hideIframe');
        });
    });
