angular.module('MyApp').directive('contenteditable', contenteditable);

function contenteditable() {

  return {

    require: 'ngModel',
    link: link

  };

}

function link(scope, element, attrs, ctrl) {
  // view -> model
  element.bind('blur', set);
  element.bind('keypress', keypress);

  // model -> view
  ctrl.$render = function() {
    element.html(ctrl.$viewValue);
  };

  // load init value from DOM
  ctrl.$render();

  function set() {
    scope.$apply(function() {
      ctrl.$setViewValue(element.html());
    });
  }

  function keypress(e) {
    if (e.keyCode == 13) {
      element.trigger('blur');
      e.preventDefault();
      return false;
    }
  }

}