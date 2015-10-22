angular.module('MyApp')
  .service('CurrentUser', CurrentUser);

function CurrentUser(_DEV, Resource, $localStorage) {

  var log = _DEV.log('CURRENT USER');

  var service = {

    init: init,
    isLogged: isLogged,
    get: get,
    set: set,
    update: update,
    destroy: destroy

  };

  return service;

  function init() {

    if ( !isLogged() )
      return;
    
    Resource.get('api/me').then(function(user) {

      log("init", user);

      $localStorage.currentUser = user;

    });

  }

  function isLogged() {
    return !!localStorage['satellizer_token'];
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