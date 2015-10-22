angular.module('MyApp')
  .service('Project', Project);

function Project($localStorage, _DEV, Resource, CurrentUser) {

  var log = _DEV.log('PROJECT SERVICE');

  var service = {

    init: init,
    get: get,
    getAll: getAll,
    getByChannelId: getByChannelId,
    create: create,
    destroy: destroy

  };

  return service;

  function init() {

    if ( !CurrentUser.isLogged() )
      return;
    
    Resource.get('organization/all').then(function(response) {

      log("init", response);

      $localStorage.BF_projects = response;

    });

  }

  function get(projectId) {
    return _.findWhere($localStorage.BF_projects, { id: projectId });
  }

  function getAll() {
    return $localStorage.BF_projects || [];
  }

  function getByChannelId(channelId) {
    return _.findWhere($localStorage.BF_projects, { channelId: channelId });
  }

  function create(project) {

    var projectToSubmit = getPreparedProjectForCreation(project);

    log("create", projectToSubmit, "Projects count", $localStorage.BF_projects.length);
    return Resource.post('organization', projectToSubmit).then(function(newProject) {
      init();
      log("create CB: ", "Projects", $localStorage.BF_projects, "Projects count", $localStorage.BF_projects.length);
      return newProject;
    });

  }

  function destroy(projectId) {
    log("destroy", projectId, "Projects count", $localStorage.BF_projects.length);
    return Resource.destroy(projectId).then(function() {
      log("destroy CB", "Projects count", $localStorage.BF_projects.length);
    });
  }

  // We do this to minimalize the data we are sending to the server
  function getPreparedProjectForCreation(project) {

    var projectToSubmit = angular.copy(project);

    projectToSubmit.contributors = _.map(projectToSubmit.contributors, function(contributor) {

      return {

        id: contributor.id,
        percentage: contributor.percentage

      }

    });

    return projectToSubmit;
  }

}