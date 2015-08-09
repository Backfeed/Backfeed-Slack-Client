angular.module('MyApp').controller('OrganizationsCtrl',
    function(PostMessageService, $modal) {
        var modal = $modal.open({
            templateUrl: "OrganizationsModalTmpl",
            controller: 'OrganizationsModalCtrl'
        });

        modal.result.then(function() {
            PostMessageService.sendGesture('hideIframe');
        }, function() {
            PostMessageService.sendGesture('hideIframe');
        });
    });
