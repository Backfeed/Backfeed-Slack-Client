angular.module('MyApp').controller('ContributionsCtrl',
    function(PostMessageService, $modal,$scope) {
        var modal = $modal.open({
            templateUrl: "ContributionsModalTmpl",
            controller: 'ContributionsModalCtrl',
            scope: $scope
        });

        modal.result.then(function() {
            PostMessageService.sendGesture('hideIframe');
        }, function() {
            PostMessageService.sendGesture('hideIframe');
        });
    });
