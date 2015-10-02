angular.module('MyApp')
  .service('CurrentUser', CurrentUser);

function CurrentUser(Resource) {

  var currentUser = undefined;

  var service = {

    get: get

  };

  init();

  return service;

  function init() {

    Resource.get('api/me').then(function(user) {
      currentUser = user;
    });

  }

  function get() {
    return currentUser;
  }

  function update(params) {
    angular.extend(currentUser, params);
  }

  function destroy() {
    currentUser = undefined;
  }

}