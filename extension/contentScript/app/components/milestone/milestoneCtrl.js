angular.module('MyApp').controller('MilestoneCtrl',
    function(PostMessageService, $modal,$scope) {
        var modal = $modal.open({
            templateUrl: "MilestoneModalTmpl",
            controller: 'MilestoneModalCtrl',
            scope: $scope,
            size: 'add-milestone'
        });

        modal.result.then(function() {
            PostMessageService.hideIframe();
        }, function() {
            PostMessageService.hideIframe();
        });
    });
