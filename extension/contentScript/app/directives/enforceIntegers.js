angular.module('MyApp')
  .directive('enforceIntegers', enforceIntegers);

function enforceIntegers(_DEV) {

  var log = _DEV.log("ENFORCE INTEGERS");

  return {

    require: 'ngModel',
    link:  enforceIntegersLink


  };

  function enforceIntegersLink(scope, element, attrs, modelCtrl) {

    element.on('keydown', function(e) {

      if ( e.keyCode === 69 || e.keyCode === 189 || e.keyCode === 190 ) {
        log("'e' / '.' / '-'  detected, censored! only integers plz!");
        e.preventDefault();
        return false;
      }

    });

    element.on('keyup', function(e) {

      if ( modelCtrl.$$rawModelValue > 100 ) {
        log("Oh ha! looks like you are way beyond your limit! (100)");
        modelCtrl.$setViewValue(100);
        modelCtrl.$render();
      }

      if ( e.keyCode === 48 && modelCtrl.$error.min && modelCtrl.$$rawModelValue === 0 ) {
        log("Integer be greater than 0!");
        modelCtrl.$setViewValue(null);
        modelCtrl.$render();
      }

    });

  }

}