angular.module('MyApp')
  .service('Project', Project);

function Project(_DEV, Resource, $localStorage) {

  var log = _DEV.log('PROJECT');

  var service = {

    getAll: getAll,
    getByChannelId: getByChannelId

  };

  init();

  return service;

  function init() {

    Resource.get('organization/all').then(function(response) {

      log("init", response);

      $localStorage.BF_projects = response;

    });

  }

  function getAll() {
    return $localStorage.BF_projects || [];
  }

  function getByChannelId(channelId) {
    return _.find($localStorage.BF_projects, matchChannelId);

    function matchChannelId(project) { return project.channelId = channelId; }

  }

}
