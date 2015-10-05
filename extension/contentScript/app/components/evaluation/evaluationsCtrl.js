angular.module('MyApp').controller('EvaluationsCtrl',
    function(PostMessageService, $modal, $scope) {
        var modal = $modal.open({
            templateUrl: 'EvaluationsModalTmpl',
            controller: 'EvaluationsModalCtrl',
            scope: $scope,
            size: 'add-evaluation'
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
