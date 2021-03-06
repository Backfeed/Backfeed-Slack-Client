angular.module('MyApp')
  .controller('LoginCtrl', function($scope, $auth, PostMessageService) {

    $scope.login = function() {
      $auth.login({ email: $scope.email, password: $scope.password })
        .then(function() {
            PostMessageService.gesture.showAlert('You have successfully logged in', 'success');
        })
        .catch(function(response) {
            PostMessageService.gesture.showAlert(response.data.message, 'error');
        });
    };

    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function() {
            PostMessageService.gesture.showAlert('You have successfully logged in', 'success');
        })
        .catch(function(response) {
            PostMessageService.gesture.showAlert(response.data ? response.data.message : response, 'error');
        });
    };

  });