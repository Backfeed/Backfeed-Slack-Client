angular.module('MyApp')
.service('Resource', Resource);

function Resource($http, API_URL, _DEV, $localStorage) {

  var log = _DEV.log("RESOURCE");

  var service = {

    get: get,
    getSlackUsers: getSlackUsers,
    post: post,
    put: put,
    destroy: destroy

  };

  return service;

  function getSlackUsers(searchQuery, userIds) {
    var path = 'allSlackUsers/' + userIds + '/' + searchQuery;
    return post(path);
  }

  function get(url, params) {
    return $http.get(API_URL + url, mergeParams(params))
            .then(function(response) {
              return response.data;
            });
  }

  function post(url, params) {
    return $http.post(API_URL + url, mergeParams(params))
            .then(function(response) {
              return response.data;
            });
  }

  function put(url, params) {
    return $http.put(API_URL + url, mergeParams(params))
            .then(function(response) {
              return response.data;
            });
  }

  function destroy(url, params) {
    return $http.delete(API_URL + url, mergeParams(params))
            .then(function(response) {
              return response.data;
            });
  }

  function getBaseParams() {
    var slackAccessToken = $localStorage.currentUser ? $localStorage.currentUser.slackAccessToken : null;

    return { 
      slackAccessToken: slackAccessToken 
    };
  }
  
  function mergeParams(params) {
    return params ? angular.extend(getBaseParams(), params) : getBaseParams();
  }

}