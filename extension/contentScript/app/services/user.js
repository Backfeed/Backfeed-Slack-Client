angular.module('MyApp')
  .service('User', User);

function User(_DEV, Resource) {

  var log = _DEV.log('USER SERVICE');

  var service = {

    get: get,
    getByQuery: getByQuery,
    getProjects: getProjects,
    getProject: getProject

  };

  return service;

  function get(userId) {
    return Resource.get('api/user/' + userId);
  }

  function getByQuery(query, userIdsToExclude) {
    return Resource.post('allSlackUsers', {
      searchString: query,
      userIds: userIdsToExclude
    });
  }

  function getProjects(userId) {
    return Resource.get('member/status/' + userId);
  }

  function getProject(userId, projectId) {
    return Resource.get('member/status/' + userId + '/' + projectId);
  }

}