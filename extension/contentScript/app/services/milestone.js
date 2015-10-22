angular.module('MyApp')
  .service('Milestone', Milestone);

function Milestone(_DEV, Resource, Project) {

  var log = _DEV.log('MILESTONE SERVICE');

  var service = {

    create: create,
    addEvaluation: addEvaluation,
    getCurrent: getCurrent,
    getCurrentByChannelId: getCurrentByChannelId,
    get: get,
    getAll: getAll

  };

  return service;

  function create(milestone) {
    var milestoneToSubmit = getPreparedMilestoneForCreation(milestone);

    return Resource.post('milestone', milestoneToSubmit);
  }

  function addEvaluation(milestone) {
    return Resource.post('milestoneBids', milestone);
  }

  function get(id) {
    return Resource.get('milestone/' + id);
  }

  function getCurrent(orgId) {
    return Resource.get('organization/currentStatus/' + orgId);
  }

  function getCurrentByChannelId(channelId) {
    var orgId = Project.getByChannelId(channelId).orgId;

    return getCurrent(orgId);
  }

  function getAll(orgId) {
    return Resource.get('milestone/all/' + orgId);
  }

  function getPreparedMilestoneForCreation(milestone) {
    return _.pick(milestone, 'title', 'description', 'evaluatingProject', 'channelId');
  }

}