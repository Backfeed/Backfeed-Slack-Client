angular.module('MyApp').controller('evaluationsCtrl',
    function(PostMessageService, $modal,$scope) {       
        
        var modal = $modal.open({
            templateUrl: 'EvaluationsModalTmpl',
            controller: 'EvaluationsModalCtrl',
            scope: $scope,
            size: 'md'
        });

        modal.result.then(function() {
            PostMessageService.hideIframe();
        }, function() {
            PostMessageService.hideIframe();
        });
    });
