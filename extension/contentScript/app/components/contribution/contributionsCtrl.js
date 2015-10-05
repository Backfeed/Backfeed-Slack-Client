angular.module('MyApp').controller('ContributionsCtrl',
    function(PostMessageService, $modal, $scope) {
        var modal = $modal.open({
            templateUrl: "ContributionsModalTmpl",
            controller: 'ContributionsModalCtrl',
            scope: $scope,
            size: 'add-contribution'
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
