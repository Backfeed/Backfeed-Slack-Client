angular.module('MyApp')
.service('_DEV', _DEV);

function _DEV() {

  var service = {
    log: log
  };

  return service;

  function log(prefix) {

    return function() {
      console.log('***************** ' + prefix + ' *******************');
      $.each(arguments, function(i, msg) { console.log(msg); });
      console.log('***************** /' + prefix + ' *******************');
      console.log('\n');
    };
  }

}
