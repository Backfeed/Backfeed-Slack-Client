angular.module('MyApp').controller('ContributionStatusCtrl',
    function(PostMessageService, $modal,$scope) {
        var modal = $modal.open({
            templateUrl: "ContributionStatusModalTmpl",
            controller: 'ContributionStatusModalCtrl',
            scope: $scope
        });

        modal.result.then(function() {
            PostMessageService.sendGesture('hideIframe');
        }, function() {
            PostMessageService.sendGesture('hideIframe');
        });
    });
