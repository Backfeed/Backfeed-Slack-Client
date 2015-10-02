angular.module('MyApp')
  .service('CurrentUser', CurrentUser);

function CurrentUser(Resource) {

  var service = {

    get: get

  };

  return service;

  function get() {
    return Resource.get('api/me');
  }

}