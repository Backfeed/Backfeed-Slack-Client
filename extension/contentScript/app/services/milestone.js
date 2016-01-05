angular.module('MyApp')
  .service('Milestone', Milestone);

function Milestone(_DEV, Resource, Project,Slack) {

  var log = _DEV.log('MILESTONE SERVICE');

  var service = {

    create: create,
    evaluate: evaluate,
    getCurrent: getCurrent,
    getCurrentByChannelId: getCurrentByChannelId,
    get: get,
    getAll: getAll

  };

  return service;

  function create(milestone) {
    var milestoneToSubmit = getPreparedMilestoneForCreation(milestone);
    return Resource.post('milestone', milestoneToSubmit).then(function(milestoneResponse) {
        Slack.postMessage(milestoneResponse.destChannelId, buildMilestoneMessage(milestoneToSubmit,milestoneResponse.id,milestoneResponse.destChannelId),milestoneResponse.username,milestoneResponse.url);
        Slack.postMessage(milestoneToSubmit.channelId, buildMilestoneMessageForOrigin(milestoneToSubmit,milestoneResponse.destChannelName),milestoneResponse.username,milestoneResponse.url);
      });
    return Resource.post('milestone', milestoneToSubmit);
  }

  function evaluate(milestone) {
    return Resource.post('milestoneBids', milestone);
  }

  function get(id) {
    return Resource.get('milestone/' + id);
  }

  function getCurrent(orgId,milestoneCreate) {
    return Resource.get('organization/currentStatus/' + orgId+'/'+milestoneCreate);
  }

  function getCurrentByChannelId(channelId,milestoneCreate) {
    var orgId = Project.getByChannelId(channelId).orgId;

    return getCurrent(orgId,milestoneCreate);
  }

  function getAll(orgId) {
    return Resource.get('milestone/all/' + orgId);
  }

  function getPreparedMilestoneForCreation(milestone) {
	  var milestoneToSubmit = angular.copy(milestone);

	  milestoneToSubmit.contributors = _.map(milestoneToSubmit.contributors, function(contributor) {

	      return {

	        id: contributor.id,
	        percentage: contributor.percentage,
	        name: contributor.name

	      }

	    });

	    return milestoneToSubmit;
  }
  
  function buildMilestoneMessage(milestoneToSubmit,milestoneId,channelId) {
      var milestoneString = '';
      var contributorsLength = milestoneToSubmit.contributors.length;
      var index = 0;
      milestoneToSubmit.contributors.forEach(function(contributor) {
        if (index == contributorsLength - 1) {
        	milestoneString += '@' + contributor.name + ' ' + contributor.percentage + '%';
        } else {
        	milestoneString += '@' + contributor.name + ' ' + contributor.percentage + '%, ';
        }
        index++;
      });
      
      return 'New Milestone submitted' + '\n' + milestoneId +':' + channelId + '\n' + '*' + milestoneToSubmit.title + '*' + '\n' + milestoneToSubmit.description + '\n' + milestoneString;
    }
    
  function buildMilestoneMessageForOrigin(milestoneToSubmit,channelName) {
        var milestoneString = '';
        var contributorsLength = milestoneToSubmit.contributors.length;
        var index = 0;
        milestoneToSubmit.contributors.forEach(function(contributor) {
          if (index == contributorsLength - 1) {
          	milestoneString += '@' + contributor.name + ' ' + contributor.percentage + '%';
          } else {
          	milestoneString += '@' + contributor.name + ' ' + contributor.percentage + '%, ';
          }
          index++;
        });
        
        return 'New Milestone submitted to #'+channelName+ '\n' + '*' + milestoneToSubmit.title + '*' + '\n' + milestoneToSubmit.description + '\n' + milestoneString;
      }

}