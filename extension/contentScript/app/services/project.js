angular.module('MyApp')
  .service('Project', Project);

function Project(_DEV, Resource, $localStorage) {

  var log = _DEV.log('PROJECT');

  var service = {

    getAll: getAll,
    getByChannelId: getByChannelId,
    create: create,
    destroy: destroy

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

  function create(project) {
    log("create", project, $localStorage.BF_projects.length);
    return Resource.post('organization', project).then(function(newProject) {
      $localStorage.BF_projects.push(newProject);
      log("create CB", $localStorage.BF_projects, $localStorage.BF_projects.length);
      return newProject;
    });

  }

  function destroy(projectId) {
    log("destroy", projectId, $localStorage.BF_projects.length, $localStorage.BF_projects.length);
    return Resource.destroy(projectId).then(function() {
      log("destroy CB", $localStorage.BF_projects.length, $localStorage.BF_projects.length);
    });
  }

}