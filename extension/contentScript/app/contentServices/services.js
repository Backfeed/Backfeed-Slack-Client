'use strict';
var bfAPIServices = angular.module('BFAPIServices', [ 'ngResource' ]);

bfAPIServices.factory('Contributions', [ '$resource','environmentURL', function($resource,environmentURL) {
	return $resource(environmentURL+'contribution/all/:projectId', {}, {
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



bfAPIServices.factory('SlackTeam', [ '$resource','environmentURL', function($resource,environmentURL) {
	return $resource(environmentURL+'organization/all/team/:slackTeamId', {}, {
		getProjects : {
			method : 'GET',
			params : {},
			isArray : false
		}
	});
} ]);

bfAPIServices.factory('MilestoneCurrent', [ '$resource','environmentURL', function($resource,environmentURL) {
	return $resource(environmentURL+'organization/currentStatus/:orgId', {}, {
		getDetail : {
			method : 'GET',
			params : {},
			isArray : false
		}
	});
} ]);

bfAPIServices.factory('MilestoneForChannel', [ '$resource','environmentURL', function($resource,environmentURL) {
	return $resource(environmentURL+'milestone/all/:orgId', {}, {
		allDetails : {
			method : 'GET',
			params : {},
			isArray : true
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

bfAPIServices.factory('SaveMilestone', [ '$resource','environmentURL', function($resource,environmentURL) {
	return $resource(environmentURL+'milestone', {}, {
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

bfAPIServices.factory('SaveEvaluationToMilestone', [ '$resource','environmentURL', function($resource,environmentURL) {
	return $resource(environmentURL+'milestoneBids', {}, {
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

bfAPIServices.factory('GetEvaluationOfMilestone', [ '$resource','environmentURL', function($resource,environmentURL) {
	return $resource(environmentURL+'milestonebid/:milestoneId/:userId', {}, {
		Evaluation : {
			method : 'GET',
			params : {},
			isArray : false
		}
	});
} ]);

bfAPIServices.factory('MilestoneDetail', [ '$resource','environmentURL', function($resource,environmentURL) {
	return $resource(environmentURL+'milestone/:id', {}, {
		getDetail : {
			method : 'GET',
			params : {},
			isArray : false
		}
	});
} ]);

bfAPIServices.factory('Users', [ '$resource','environmentURL', function($resource,environmentURL) {
	var allProjectUsersData;
			return {
				getProject: $resource(environmentURL+'users/all/:projectId',
				{},
				{
					getUsers: {
						method : 'GET',
						params : {},
						isArray : true
					}
				}),
				getAllProjectUsersData: function() {return allProjectUsersData},
				setAllProjectUsersData: function(data) {
					allProjectUsersData = data;
				}
			};
} ]);
	
bfAPIServices.factory('UserDetail', [ '$resource','environmentURL', function($resource,environmentURL) {
	return $resource(environmentURL+'users/:userId/:projectId', {}, {
		getDetail : {
			method : 'GET',
			params : {},
			isArray : false
		}
	});
} ]);

bfAPIServices.factory('Member', [ '$resource','environmentURL', function($resource,environmentURL) {
	return $resource(environmentURL+'organization/member/:slackTeamId', {}, {
		getProjects : {
			method : 'GET',
			params : {},
			isArray : true
		}
	});
} ]);


bfAPIServices.factory('MemberStatus', [ '$resource','environmentURL', function($resource,environmentURL) {
	return $resource(environmentURL+'member/status/:projectId/:userId', {}, {
		getDetail : {
			method : 'GET',
			params : {},
			isArray : false
		}
	});
} ]);

bfAPIServices.factory('MemberStatusForAllProjects', [ '$resource','environmentURL', function($resource,environmentURL) {
	return $resource(environmentURL+'member/statusallOrgs/:slackTeamId/:userId', {}, {
		getDetail : {
			method : 'GET',
			params : {},
			isArray : false
		}
	});
} ]);

bfAPIServices.factory('ChannelProject', [ '$resource','environmentURL', function($resource,environmentURL) {
	return $resource(environmentURL+'organization/channel/:channelId/:slackTeamId/:userId', {}, {
		exists : {
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

bfAPIServices.factory('SaveProject', [ '$resource','environmentURL', function($resource,environmentURL) {
	return $resource(environmentURL+'organization', {}, {
		save : {
			method : 'POST',
			params : {},
			isArray : false
		}
	});
} ]);

bfAPIServices.factory('CheckProjectTokenName', [ '$resource','environmentURL', function($resource,environmentURL) {
	return $resource(environmentURL+'organization/checkTokenName/:tokenName', {}, {
		CheckProjectTokenName : {
			method : 'GET',
			params : {},
			isArray : false
		}
	});
} ]);

bfAPIServices.factory('AllSlackUsers', [ '$resource','environmentURL', function($resource,environmentURL) {
	return $resource(environmentURL+'allSlackUsers', {}, {
		allSlackUsers : {
			method : 'POST',
			params : {},
			isArray : true
		}
	});
} ]);

bfAPIServices.factory('AllProjects', [ '$resource','environmentURL', function($resource,environmentURL) {
	return $resource(environmentURL+'organization/all', {}, {
		allProjects : {
			method : 'GET',
			params : {},
			isArray : true
		}
	});
} ]);

bfAPIServices.factory('CheckProjectCode', [ '$resource','environmentURL', function($resource,environmentURL) {
	return $resource(environmentURL+'organization/checkCode/:code', {}, {
		CheckProjectCode : {
			method : 'GET',
			params : {},
			isArray : false
		}
	});
} ]);
