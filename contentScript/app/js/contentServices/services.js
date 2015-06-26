'use strict';
var bfAPIServices = angular.module('BFAPIServices', [ 'ngResource' ]);

bfAPIServices.factory('Contributions', [ '$resource', function($resource) {
	return $resource('https://127.0.0.1:8100/contribution/all/:organizationId', {}, {
		getAllContributions : {
			method : 'GET',
			params : {},
			isArray : true
		}
	});
} ]);

bfAPIServices.factory('ContributionDetail', [ '$resource', function($resource) {
	return $resource('https://127.0.0.1:8100/contribution/:contributionId', {}, {
		getDetail : {
			method : 'GET',
			params : {},
			isArray : false
		}
	});
} ]);

bfAPIServices.factory('SaveContribution', [ '$resource', function($resource) {
	return $resource('https://127.0.0.1:8100/contribution', {}, {
		save : {
			method : 'POST',
			params : {},
			isArray : false
		}
	});
} ]);
bfAPIServices.factory('CloseContribution', [ '$resource', function($resource) {
	return $resource('https://127.0.0.1:8100/contribution/close', {}, {
		save : {
			method : 'POST',
			params : {},
			isArray : false
		}
	});
} ]);
bfAPIServices.factory('SaveBidTOContribution', [ '$resource',function($resource) {
	return $resource('https://127.0.0.1:8100/bids', {}, {
		save : {
			method : 'POST',
			params : {},
			isArray : false
		}
	});
} ]);
bfAPIServices.factory('Users', [ '$resource', function($resource) {
	var allOrgUsersData;		 
			return {getOrg :$resource('https://127.0.0.1:8100/users/all/:organizationId', {}, {
			getUsers: {
				method : 'GET',
				params : {},
				isArray : true
		}
	}),getAllOrgUsersData: function() {return allOrgUsersData},
	 setAllOrgUsersData: function(data) {		
		allOrgUsersData = data;
    },};
} ]);
	
bfAPIServices.factory('UserDetail', [ '$resource', function($resource) {
	return $resource('https://127.0.0.1:8100/users/:userId/:organizationId', {}, {
		getDetail : {
			method : 'GET',
			params : {},
			isArray : false
		}
	});
} ]);

bfAPIServices.factory('SaveUser', [ '$resource', function($resource) {
	return $resource('https://127.0.0.1:8100/users', {}, {
		save : {
			method : 'POST',
			params : {},
			isArray : false
		}
	});
} ]);

bfAPIServices.factory('ContributionStatus', [ '$resource', function($resource) {
	return $resource('https://127.0.0.1:8100/contribution/status/:id/:userId', {}, {
		getDetail : {
			method : 'GET',
			params : {},
			isArray : false
		}
	});
} ]);

bfAPIServices.factory('SaveOrg', [ '$resource', function($resource) {
	return $resource('https://127.0.0.1:8100/organization', {}, {
		save : {
			method : 'POST',
			params : {},
			isArray : false
		}
	});
} ]);

bfAPIServices.factory('CheckOrgTokenName', [ '$resource', function($resource) {
	return $resource('https://127.0.0.1:8100/organization/checkTokenName/:tokenName', {}, {
		checkOrgTokenName : {
			method : 'GET',
			params : {},
			isArray : false
		}
	});
} ]);

bfAPIServices.factory('AllSlackUsers', [ '$resource', function($resource) {
	return $resource('https://127.0.0.1:8100/allSlackUsers', {}, {
		allSlackUsers : {
			method : 'GET',
			params : {},
			isArray : true
		}
	});
} ]);

bfAPIServices.factory('AllOrgs', [ '$resource', function($resource) {
	return $resource('https://127.0.0.1:8100/organization/all', {}, {
		allOrgs : {
			method : 'GET',
			params : {},
			isArray : true
		}
	});
} ]);
