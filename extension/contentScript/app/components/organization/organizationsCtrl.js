angular.module('MyApp').controller('OrganizationsCtrl',
    function(PostMessageService, $modal,$scope) {
        var modal = $modal.open({
            templateUrl: "OrganizationsModalTmpl",
            controller: 'OrganizationsModalCtrl',
            scope: $scope
        });

        modal.result.then(function() {
            PostMessageService.sendGesture('hideIframe');
        }, function() {
            PostMessageService.sendGesture('hideIframe');
        });
    });
