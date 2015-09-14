angular.module('MyApp').controller('MilestoneCtrl',
    function(PostMessageService, $modal,$scope) {
        var modal = $modal.open({
            templateUrl: "MilestoneModalTmpl",
            controller: 'MilestoneModalCtrl',
            scope: $scope,
            size: 'lg'
        });

        modal.result.then(function() {
            PostMessageService.sendGesture('hideIframe');
        }, function() {
            PostMessageService.sendGesture('hideIframe');
        });
    });
