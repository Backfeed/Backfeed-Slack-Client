angular.module('MyApp').controller('MemberStatusCtrl',
    function(PostMessageService, $modal,$scope) {
        var modal = $modal.open({
            templateUrl: "MemberStatusModalTmpl",
            controller: 'MemberStatusModalCtrl',
            scope: $scope,
            size: 'lg'
        });

        modal.result.then(function() {
            PostMessageService.sendGesture('hideIframe');
        }, function() {
            PostMessageService.sendGesture('hideIframe');
        });
    });
