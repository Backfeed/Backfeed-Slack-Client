angular.module('MyApp').controller('MilestoneEvaluationsCtrl',
    function(PostMessageService, $modal, $scope) {
        var modal = $modal.open({
            templateUrl: 'MileStoneEvaluationsModalTmpl',
            controller: 'MileStoneEvaluationsModalCtrl',
            scope: $scope,
            size: 'md'
        });

        modal.opened.then(function() {
            $('div[modal-render]').remove();
        });

        modal.result.then(function() {
            PostMessageService.hideIframe();
        }, function() {
            PostMessageService.hideIframe();
        });
    });
