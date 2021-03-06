'use strict';

var myApp = angular.module('MyApp', ['ui.slider', 'ngResource', 'ngTouch', 'ngMessages', 'ui.router', 'ui.bootstrap', 'satellizer','BFAPIServices','ngSanitize','ui.select']);

myApp.constant('enviornmentURL', 'https://monitor.backfeed.cc/');

myApp.config(function($stateProvider, $urlRouterProvider, $authProvider, $compileProvider) {
    $stateProvider
        .state('splash', {
            url: '/splash',
            templateUrl: chrome.extension.getURL("extension/contentScript/app/partials/splash.html"),
            controller: 'SplashCtrl'
        })
        .state('contributionDetail', {
            url: '/contribution/:contributionId',
            templateUrl: chrome.extension.getURL("extension/contentScript/app/components/contribution/contributionDetail.html"),
            controller: 'ContributionsCtrl'
        })
        .state('createContribution', {
            url: '/contribution',
            templateUrl: chrome.extension.getURL("extension/contentScript/app/components/contribution/createContribution.html"),
            controller: 'ContributionsCtrl'
        })
        .state('createOrg', {
            url: '/organization',
            templateUrl: chrome.extension.getURL("extension/contentScript/app/components/organization/createOrganization.html"),
            controller: 'OrganizationsCtrl'
        })
        .state('contributionStatus', {
            url: '/contributionStatus/:contributionId',
            templateUrl: chrome.extension.getURL("extension/contentScript/app/components/contributionStatus/contributionStatus.html"),
            controller: 'ContributionStatusCtrl'
        })
        .state('memberStatus', {
            url: '/memberStatus/:memberId',
            templateUrl: chrome.extension.getURL("extension/contentScript/app/components/memberStatus/memberStatus.html"),
            controller: 'MemberStatusCtrl'
        })
        .state('contributions', {
            url: '/contributions',
            templateUrl: 'app/partials/contributions.html',
            controller: 'ContributionsCtrl'
        })
        .state('bids', {
            url: '/bids/:contributionId',
            templateUrl: chrome.extension.getURL("extension/contentScript/app/components/bid/createBid.html"),
            controller: 'BidsCtrl'
        })
        .state('users', {
            url: '/users',
            templateUrl: 'app/partials/users.html',
            controller: 'UsersCtrl'
        })
        .state('orgs', {
            url: '/orgs',
            templateUrl: 'app/partials/orgs.html',
            controller: 'OrganizationCtrl'
        })
        .state('userDetail', {
            url: '/user/:userId',
            templateUrl: 'app/partials/userDetail.html',
            controller: 'UsersCtrl'
        })
        .state('createUser', {
            url: '/user',
            templateUrl: 'app/partials/createUser.html',
            controller: 'UsersCtrl'
        })

        .state('login', {
            url: '/login',
            templateUrl: 'app/partials/login.html',
            controller: 'LoginCtrl'
        })
        .state('signup', {
            url: '/signup',
            templateUrl: 'app/partials/signup.html',
            controller: 'SignupCtrl'
        })
        .state('logout', {
            url: '/logout',
            template: null,
            controller: 'LogoutCtrl'
        })
        .state('profile', {
            url: '/profile',
            templateUrl: 'app/partials/profile.html',
            controller: 'ProfileCtrl',
            resolve: {
                authenticated: function($q, $location, $auth) {
                    var deferred = $q.defer();

                    if (!$auth.isAuthenticated()) {
                        $location.path('/splash');
                    } else {
                        deferred.resolve();
                    }
                    return deferred.promise;
                }
            }
        });

    //$urlRouterProvider.otherwise('/contribution');

    $authProvider.slack({
        clientId: '3655944058.8209971669'
    });

    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);

}).run(function($templateCache) {
    $templateCache.put("bootstrap/match.tpl.html","<div class=\"ui-select-match\" ng-hide=\"$select.open\" ng-disabled=\"$select.disabled\" ng-class=\"{\'btn-default-focus\':$select.focus}\"><span tabindex=\"-1\" class=\"btn btn-default form-control ui-select-toggle\" aria-label=\"{{ $select.baseTitle }} activate\" ng-disabled=\"$select.disabled\" ng-click=\"$select.activate()\" style=\"outline: 0;\"><img src=\"/extension/contentScript/app/images/icon-dude.png\" class=\"ui-select-left-image\"><span ng-show=\"$select.isEmpty()\" class=\"ui-select-placeholder text-muted\">{{$select.placeholder}}</span> <span ng-hide=\"$select.isEmpty()\" class=\"ui-select-match-text pull-left\" ng-class=\"{\'ui-select-allow-clear\': $select.allowClear && !$select.isEmpty()}\" ng-transclude=\"\"><img src=\"/extension/contentScript/app/images/icon-dude.png\"></span> <i class=\"plus-icon pull-right\" ng-click=\"$select.toggle($event)\"></i> <a ng-show=\"$select.allowClear && !$select.isEmpty()\" aria-label=\"{{ $select.baseTitle }} clear\" style=\"margin-right: 10px\" ng-click=\"$select.clear($event)\" class=\"pull-right\"></a></span></div>");
}).directive('contenteditable', function() {
	  return {
		    require: 'ngModel',
		    link: function(scope, element, attrs, ctrl) {
		      // view -> model
		      element.bind('blur', function() {
		        scope.$apply(function() {
		          ctrl.$setViewValue(element.html());
		        });
		      });

		      // model -> view
		      ctrl.$render = function() {
		        element.html(ctrl.$viewValue);
		      };

		      // load init value from DOM
		      ctrl.$render();
		    }
		  };
		});