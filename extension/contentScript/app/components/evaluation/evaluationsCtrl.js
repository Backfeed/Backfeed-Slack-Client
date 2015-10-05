angular.module('MyApp').controller('EvaluationsCtrl',
    function(PostMessageService, $modal, $scope) {
        var modal = $modal.open({
            templateUrl: 'EvaluationsModalTmpl',
            controller: 'EvaluationsModalCtrl',
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
