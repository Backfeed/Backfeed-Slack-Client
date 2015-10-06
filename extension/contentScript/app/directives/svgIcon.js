angular.module('MyApp').directive('svgIcon', svgIcon);


function svgIcon() {

  return {

    restrict: 'E',
    template: '<span ng-include="getIconUrl()"></span>',
    link: link
    
  };

  function link(scope, element, attrs) {

    scope.getIconUrl = getIconUrl;
    
    function getIconUrl() {

      return chrome.extension.getURL("extension/contentScript/app/images/svg/" + attrs.icon + ".html");

    }

  }

}