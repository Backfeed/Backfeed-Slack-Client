angular.module('MyApp').directive('svgIcon', function() {
    return {
        restrict: 'E',
        template: '<span ng-include="getIconUrl()"></span>',
        link: function (scope, element, attrs) {
            scope.getIconUrl = function() {
                return chrome.extension.getURL("extension/contentScript/app/images/svg/" + attrs.icon + ".html");
            }
        }
    };
});