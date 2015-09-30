angular.module('MyApp').controller('mileStoneEvaluationsCtrl',
    function(PostMessageService, $modal,$scope) {       
        
        var modal = $modal.open({
            templateUrl: 'MileStoneEvaluationsModalTmpl',
            controller: 'MileStoneEvaluationsModalCtrl',
            scope: $scope,
            size: 'md'
        });

        modal.result.then(function() {
            PostMessageService.hideIframe();
        }, function() {
            PostMessageService.hideIframe();
        });
    });
