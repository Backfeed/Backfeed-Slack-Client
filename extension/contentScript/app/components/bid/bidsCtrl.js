angular.module('MyApp').controller('BidsCtrl',
    function(PostMessageService, $modal,$scope) {       
        
        var modal = $modal.open({
            templateUrl: 'BidsModalTmpl',
            controller: 'BidsModalCtrl',
            scope: $scope,
            size: 'md'
        });

        modal.result.then(function() {
            PostMessageService.sendGesture('hideIframe');
        }, function() {
            PostMessageService.sendGesture('hideIframe');
        });
    });
