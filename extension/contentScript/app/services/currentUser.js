angular.module('MyApp')
  .service('CurrentUser', CurrentUser);

function CurrentUser(_DEV, Resource, $localStorage) {

  var log = _DEV.log('CURRENT USER');

  var service = {

    get: get,
    set: set,
    update: update,
    destroy: destroy

  };

  init();

  return service;

  function init() {

    Resource.get('api/me').then(function(user) {

      log("init", user);

      $localStorage.currentUser = user;

    });

  }

  function get() {
    return $localStorage.currentUser || null;
  }

  function set(user) {
    $localStorage.currentUser = user;
  }

  function update(params) {
    angular.extend($localStorage.currentUser, params);
  }

  function destroy() {
    $localStorage.currentUser = null;
  }

}