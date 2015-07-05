'use strict';

angular.module('MyApp', ['uiSlider','ngResource', 'ngMessages', 'ui.router', 'ui.bootstrap', 'mgcrea.ngStrap', 'satellizer','BFAPIServices','ngSanitize','ui.select2','helpers.rangeslider'])
.config(function($stateProvider, $urlRouterProvider, $authProvider) {
  $stateProvider
	  .state('splash', {
		controller: 'SplashCtrl',
      url: '/splash',
      templateUrl: chrome.extension.getURL("contentScript/app/partials/splash.html"),
    })
    .state('contributionDetail', {
      url: '/contribution/:contributionId',
      templateUrl: chrome.extension.getURL("contentScript/app/partials/contributionDetail.html"),
      controller: 'ContributionsCtrl'
    })
    .state('createContribution', {
      url: '/contribution',
      templateUrl: chrome.extension.getURL("contentScript/app/partials/createContribution.html"),
      controller: 'ContributionsCtrl'
    })
    .state('createOrg', {
      url: '/organization',
      templateUrl: chrome.extension.getURL("contentScript/app/partials/createOrganization.html"),
      controller: 'OrganizationCtrl'
    })
    .state('contributionStatus', {
  	  url: '/contributionStatus/:contributionId',
      templateUrl: chrome.extension.getURL("contentScript/app/partials/contributionStatus.html"),
      controller: 'ContributionStatusCtrl'
    })
	  .state('contributions', {
		controller: 'ContributionsCtrl',
      url: '/contributions',
      templateUrl: 'app/partials/contributions.html'
    })
    .state('bids', {
      url: '/bids/:contributionId',
      templateUrl: chrome.extension.getURL("contentScript/app/partials/createBid.html"),
      controller: 'BidsCtrl'
    })
	  .state('users', {
		controller: 'UsersCtrl',
      url: '/users',
      templateUrl: 'app/partials/users.html'
    })
     .state('orgs', {
		controller: 'OrganizationCtrl',
      url: '/orgs',
      templateUrl: 'app/partials/orgs.html'
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

  $urlRouterProvider.otherwise('/contribution');

	$authProvider.slack({
    clientId: '2969711723.3476875864'
  });
 
});
