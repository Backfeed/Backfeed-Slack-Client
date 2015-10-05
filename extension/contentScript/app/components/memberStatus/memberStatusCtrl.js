angular.module('MyApp').controller('MemberStatusCtrl',
    function(PostMessageService, $modal,$scope) {
        var modal = $modal.open({
            templateUrl: "MemberStatusModalTmpl",
            controller: 'MemberStatusModalCtrl',
            scope: $scope,
            size: 'member-status',
            backdrop: 'static'
        });

        modal.result.then(function() {
            PostMessageService.hideIframe();
        }, function() {
            PostMessageService.hideIframe();
        });
    });
