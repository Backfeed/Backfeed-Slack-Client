angular.module('MyApp').service('Milestone', Milestone);

function Milestone(_DEV, Resource) {

  var log = _DEV.log('Milestone Service');

  var service = {

    create: create,
    getCurrent: getCurrent


  };

  return service;

  function create(title, description, evaluatingTeam, channelId) {
    return Resource.post('milestone', title, description, evaluatingTeam, channelId);
  }

  function getCurrent(orgId) {
    var path = 'organization/currentStatus/' + orgId;
    return Resource.get(path);
  }

}


