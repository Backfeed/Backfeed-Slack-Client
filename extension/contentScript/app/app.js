'use strict';

var myApp = angular.module('MyApp', ['ui.slider', 'ngResource', 'ngTouch', 'ngMessages', 'ui.router', 'ui.bootstrap', 'satellizer','BFAPIServices','ngSanitize','ui.select', 'ngStorage']);

myApp.constant('environmentURL', 'https://developslackext.elasticbeanstalk.com/');
myApp.constant('SLACK_API_URL', 'https://slack.com/api/');
myApp.constant('API_URL', 'https://developslackext.elasticbeanstalk.com/');

myApp.config(function($tooltipProvider, $modalProvider, $stateProvider, $authProvider, $compileProvider, $locationProvider) {
    $tooltipProvider.options({
        appendToBody: 'true'
    });

    $modalProvider.options.backdrop = 'static';

    $authProvider.slack({
        clientId: '3655944058.8209971669'
    });

    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

    $stateProvider
        .state('splash', {
            url: '/splash',
            templateUrl: chrome.extension.getURL("extension/contentScript/app/partials/splash.html"),
            controller: 'SplashCtrl'
        })
        .state('mileStoneEvaluations', {
            url: '/mileStoneEvaluations/:mileStoneId/:projectId',
            templateUrl: chrome.extension.getURL("extension/contentScript/app/components/mileStoneEvaluation/addMilestoneEvaluation.html"),
            controller: 'MilestoneEvaluationsCtrl'
        });


}).run(function($templateCache) {
    $templateCache.put("bootstrap/match.tpl.html","<div class=\"ui-select-match\" ng-hide=\"$select.open\" ng-disabled=\"$select.disabled\" ng-class=\"{\'btn-default-focus\':$select.focus}\"><span tabindex=\"-1\" class=\"btn btn-default form-control ui-select-toggle\" aria-label=\"{{ $select.baseTitle }} activate\" ng-disabled=\"$select.disabled\" ng-click=\"$select.activate()\" style=\"outline: 0;\"><img src=\"/extension/contentScript/app/images/icon-dude.png\" class=\"ui-select-left-image\"><span ng-show=\"$select.isEmpty()\" class=\"ui-select-placeholder text-muted\">{{$select.placeholder}}</span> <span ng-hide=\"$select.isEmpty()\" class=\"ui-select-match-text pull-left\" ng-class=\"{\'ui-select-allow-clear\': $select.allowClear && !$select.isEmpty()}\" ng-transclude=\"\"><img src=\"/extension/contentScript/app/images/icon-dude.png\"></span> <i class=\"plus-icon pull-right\" ng-click=\"$select.toggle($event)\"></i> <a ng-show=\"$select.allowClear && !$select.isEmpty()\" aria-label=\"{{ $select.baseTitle }} clear\" style=\"margin-right: 10px\" ng-click=\"$select.clear($event)\" class=\"pull-right\"></a></span></div>");
});
