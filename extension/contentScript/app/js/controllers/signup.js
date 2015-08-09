angular.module('MyApp')
  .controller('SignupCtrl', function($scope, PostMessageService, $auth) {
    $scope.signup = function() {
      $auth.signup({
        displayName: $scope.displayName,
        email: $scope.email,
        password: $scope.password
      }).catch(function(response) {
        if (typeof response.data.message === 'object') {
          angular.forEach(response.data.message, function(message) {
            PostMessageService.gesture.showAlert(message[0], 'error');
          });
        } else {
          PostMessageService.gesture.showAlert(response.data.message, 'error');
        }
      });
    };
  });