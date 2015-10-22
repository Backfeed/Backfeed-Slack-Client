angular.module('MyApp')
  .directive('stripWhitespace', stripWhitespace);

function stripWhitespace(_DEV) {

  var log = _DEV.log("STRIP WHITEPSACE DIRECTIVE");

  return {

    require: 'ngModel',
    link:  stripWhitespaceLink


  };

  function stripWhitespaceLink(scope, element, attrs, modelCtrl) {

    element.on('keydown', function(e) {
      if ( e.keyCode === 32 ) {
        log("no spacebar plz!");
        e.preventDefault();
        return false;
      }
    });

  }

}