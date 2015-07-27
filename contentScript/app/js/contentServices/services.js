'use strict';
var bfAPIServices = angular.module('BFAPIServices', [ 'ngResource' ]);

bfAPIServices.factory('Contributions', [ '$resource','enviornmentURL', function($resource,enviornmentURL) {
	return $resource(enviornmentURL+'contribution/all/:organizationId', {}, {
		getAllContributions : {
			method : 'GET',
			params : {},
			isArray : true
		}
	});
} ]);

bfAPIServices.factory('ContributionDetail', [ '$resource','enviornmentURL', function($resource,enviornmentURL) {
	return $resource(enviornmentURL+'contribution/:contributionId', {}, {
		getDetail : {
			method : 'GET',
			params : {},
			isArray : false
		}
	});
} ]);

bfAPIServices.factory('SaveContribution', [ '$resource','enviornmentURL', function($resource,enviornmentURL) {
	return $resource(enviornmentURL+'contribution', {}, {
		save : {
			method : 'POST',
			params : {},
			isArray : false
		}
	});
} ]);
bfAPIServices.factory('CloseContribution', [ '$resource','enviornmentURL', function($resource,enviornmentURL) {
	return $resource(enviornmentURL+'contribution/close', {}, {
		save : {
			method : 'POST',
			params : {},
			isArray : false
		}
	});
} ]);
bfAPIServices.factory('SaveBidTOContribution', [ '$resource','enviornmentURL', function($resource,enviornmentURL) {
	return $resource(enviornmentURL+'bids', {}, {
		save : {
			method : 'POST',
			params : {},
			isArray : false
		}
	});
} ]);
bfAPIServices.factory('GetBidTOContribution', [ '$resource','enviornmentURL', function($resource,enviornmentURL) {
	return $resource(enviornmentURL+'bid/:contributionId/:userId', {}, {
		Bid : {
			method : 'GET',
			params : {},
			isArray : false
		}
	});
} ]);
bfAPIServices.factory('Users', [ '$resource','enviornmentURL', function($resource,enviornmentURL) {
	var allOrgUsersData;		 
			return {getOrg :$resource(enviornmentURL+'users/all/:organizationId', {}, {
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
	
bfAPIServices.factory('UserDetail', [ '$resource','enviornmentURL', function($resource,enviornmentURL) {
	return $resource(enviornmentURL+'users/:userId/:organizationId', {}, {
		getDetail : {
			method : 'GET',
			params : {},
			isArray : false
		}
	});
} ]);

bfAPIServices.factory('SaveUser', [ '$resource','enviornmentURL', function($resource,enviornmentURL) {
	return $resource(enviornmentURL+'users', {}, {
		save : {
			method : 'POST',
			params : {},
			isArray : false
		}
	});
} ]);

bfAPIServices.factory('ContributionStatus', [ '$resource','enviornmentURL', function($resource,enviornmentURL) {
	return $resource(enviornmentURL+'contribution/status/:id/:userId', {}, {
		getDetail : {
			method : 'GET',
			params : {},
			isArray : false
		}
	});
} ]);

bfAPIServices.factory('SaveOrg', [ '$resource','enviornmentURL', function($resource,enviornmentURL) {
	return $resource(enviornmentURL+'organization', {}, {
		save : {
			method : 'POST',
			params : {},
			isArray : false
		}
	});
} ]);

bfAPIServices.factory('CheckOrgTokenName', [ '$resource','enviornmentURL', function($resource,enviornmentURL) {
	return $resource(enviornmentURL+'organization/checkTokenName/:tokenName', {}, {
		checkOrgTokenName : {
			method : 'GET',
			params : {},
			isArray : false
		}
	});
} ]);

bfAPIServices.factory('AllSlackUsers', [ '$resource','enviornmentURL', function($resource,enviornmentURL) {
	return $resource(enviornmentURL+'allSlackUsers', {}, {
		allSlackUsers : {
			method : 'GET',
			params : {},
			isArray : true
		}
	});
} ]);

bfAPIServices.factory('AllOrgs', [ '$resource','enviornmentURL', function($resource,enviornmentURL) {
	return $resource(enviornmentURL+'organization/all', {}, {
		allOrgs : {
			method : 'GET',
			params : {},
			isArray : true
		}
	});
} ]);

bfAPIServices.factory('CheckOrgCode', [ '$resource','enviornmentURL', function($resource,enviornmentURL) {
	return $resource(enviornmentURL+'organization/checkCode/:code', {}, {
		checkOrgCode : {
			method : 'GET',
			params : {},
			isArray : false
		}
	});
} ]);
