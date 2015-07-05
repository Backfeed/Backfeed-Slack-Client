var App = angular.module('helpers.rangeslider', []);

App.directive('rangeslider', function() {
    return {
        // Restrict it to be an attribute in this case
        restrict: 'A',
        // responsible for registering DOM listeners as well as updating the DOM
        link: function(scope, element, attrs) {
            $('.contribution-slider').rangeslider();
        }
    };
});