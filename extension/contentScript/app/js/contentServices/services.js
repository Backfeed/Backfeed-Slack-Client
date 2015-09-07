'use strict';
var bfAPIServices = angular.module('BFAPIServices', [ 'ngResource' ]);

bfAPIServices.factory('Contributions', [ '$resource','environmentURL', function($resource,environmentURL) {
	return $resource(environmentURL+'contribution/all/:organizationId', {}, {
		getAllContributions : {
			method : 'GET',
			params : {},
			isArray : true
		}
	});
} ]);

bfAPIServices.factory('ContributionDetail', [ '$resource','environmentURL', function($resource,environmentURL) {
	return $resource(environmentURL+'contribution/:contributionId', {}, {
		getDetail : {
			method : 'GET',
			params : {},
			isArray : false
		}
	});
} ]);

bfAPIServices.factory('SaveContribution', [ '$resource','environmentURL', function($resource,environmentURL) {
	return $resource(environmentURL+'contribution', {}, {
		save : {
			method : 'POST',
			params : {},
			isArray : false
		}
	});
} ]);
bfAPIServices.factory('CloseContribution', [ '$resource','environmentURL', function($resource,environmentURL) {
	return $resource(environmentURL+'contribution/close', {}, {
		save : {
			method : 'POST',
			params : {},
			isArray : false
		}
	});
} ]);
bfAPIServices.factory('SaveEvaluationToContribution', [ '$resource','environmentURL', function($resource,environmentURL) {
	return $resource(environmentURL+'bids', {}, {
		save : {
			method : 'POST',
			params : {},
			isArray : false
		}
	});
} ]);
bfAPIServices.factory('GetEvaluationOfContribution', [ '$resource','environmentURL', function($resource,environmentURL) {
	return $resource(environmentURL+'bid/:contributionId/:userId', {}, {
		Evaluation : {
			method : 'GET',
			params : {},
			isArray : false
		}
	});
} ]);
bfAPIServices.factory('Users', [ '$resource','environmentURL', function($resource,environmentURL) {
	var allOrgUsersData;		 
			return {getOrg :$resource(environmentURL+'users/all/:organizationId', {}, {
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
	
bfAPIServices.factory('UserDetail', [ '$resource','environmentURL', function($resource,environmentURL) {
	return $resource(environmentURL+'users/:userId/:organizationId', {}, {
		getDetail : {
			method : 'GET',
			params : {},
			isArray : false
		}
	});
} ]);

bfAPIServices.factory('Member', [ '$resource','environmentURL', function($resource,environmentURL) {
	return $resource(environmentURL+'organization/member/:slackTeamId', {}, {
		getOrgs : {
			method : 'GET',
			params : {},
			isArray : true
		}
	});
} ]);


bfAPIServices.factory('MemberStatus', [ '$resource','environmentURL', function($resource,environmentURL) {
	return $resource(environmentURL+'member/status/:orgId/:userId', {}, {
		getDetail : {
			method : 'GET',
			params : {},
			isArray : false
		}
	});
} ]);

bfAPIServices.factory('MemberStatusForAllOrgs', [ '$resource','environmentURL', function($resource,environmentURL) {
	return $resource(environmentURL+'member/statusallOrgs/:slackTeamId/:userId', {}, {
		getDetail : {
			method : 'GET',
			params : {},
			isArray : false
		}
	});
} ]);

bfAPIServices.factory('ChannelOrg', [ '$resource','environmentURL', function($resource,environmentURL) {
	return $resource(environmentURL+'organization/channel/:channelId/:slackTeamId/:userId', {}, {
		exits : {
			method : 'GET',
			params : {},
			isArray : false
		}
	});
} ]);


bfAPIServices.factory('SaveUser', [ '$resource','environmentURL', function($resource,environmentURL) {
	return $resource(environmentURL+'users', {}, {
		save : {
			method : 'POST',
			params : {},
			isArray : false
		}
	});
} ]);

bfAPIServices.factory('ContributionStatus', [ '$resource','environmentURL', function($resource,environmentURL) {
	return $resource(environmentURL+'contribution/status/:id/:userId', {}, {
		getDetail : {
			method : 'GET',
			params : {},
			isArray : false
		}
	});
} ]);

bfAPIServices.factory('SaveOrg', [ '$resource','environmentURL', function($resource,environmentURL) {
	return $resource(environmentURL+'organization', {}, {
		save : {
			method : 'POST',
			params : {},
			isArray : false
		}
	});
} ]);

bfAPIServices.factory('CheckOrgTokenName', [ '$resource','environmentURL', function($resource,environmentURL) {
	return $resource(environmentURL+'organization/checkTokenName/:tokenName', {}, {
		checkOrgTokenName : {
			method : 'GET',
			params : {},
			isArray : false
		}
	});
} ]);

bfAPIServices.factory('AllSlackUsers', [ '$resource','environmentURL', function($resource,environmentURL) {
	return $resource(environmentURL+'allSlackUsers', {}, {
		allSlackUsers : {
			method : 'GET',
			params : {},
			isArray : true
		}
	});
} ]);

bfAPIServices.factory('AllOrgs', [ '$resource','environmentURL', function($resource,environmentURL) {
	return $resource(environmentURL+'organization/all', {}, {
		allOrgs : {
			method : 'GET',
			params : {},
			isArray : true
		}
	});
} ]);

bfAPIServices.factory('CheckOrgCode', [ '$resource','environmentURL', function($resource,environmentURL) {
	return $resource(environmentURL+'organization/checkCode/:code', {}, {
		checkOrgCode : {
			method : 'GET',
			params : {},
			isArray : false
		}
	});
} ]);
