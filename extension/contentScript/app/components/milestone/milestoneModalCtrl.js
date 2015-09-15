angular.module('MyApp').controller('MilestoneModalCtrl', MilestoneModalCtrl);

function MilestoneModalCtrl($scope, $auth, $location, $stateParams, SaveProject, Account, Users, AllSlackUsers, CheckProjectTokenName, $modalInstance, $state, CheckProjectCode, PostMessageService) {

  var channelId = $stateParams.channelId;

  var milestoneModel = {
    title: '',
    description: '',
    channelId: channelId,
    channelName :'',
    a :'50',
    b :'50',
    evaluatingTeam: '',
    contributers : [ {
      contributer_id : '0',
      contributer_percentage : '100',
      contributer_name:'',
      contribution1: '50',
      className:'media contributer-cell',
      img:'/extension/contentScript/app/images/icon-dude.png'
    } ]
  };

  angular.extend($scope, {
    submit: submit,
    closeModal: closeModal,
    userData: '',
    activeContribution: {},
    teams: [],
    validationFailureForTokenName: false,
    validationFailureForCode: false,
    milestoneModel: milestoneModel
  });

  init();

  function init() {

    PostMessageService.gesture.hideIframe();
    
    $scope.userData = Account.getUserData();
    console.log("userData is"+$scope.userData);

    if ( $scope.userData == undefined ) {

     getProfile();

    } 

    else {

     $scope.userId = $scope.userData.userId;
     $scope.access_token = $scope.userData.access_token;
     PostMessageService.gesture.showIframe();

    }
    
  }

  function closeModal() {
    $modalInstance.dismiss('cancel');
  };
 
  function submit() {
    console.log('create milestone!');
    console.log($scope.milestoneModel);
  }


  function getProfile() {
    Account.getProfile()
    .success(function(user) {
      Account.setUserData(user);
      $scope.userData = Account.getUserData();
      $scope.userId = $scope.userData.userId;
      $scope.userName = $scope.userData.displayName;
      $scope.access_token = $scope.userData.access_token;
      PostMessageService.gesture.showIframe();
    })
    .error(function(error) {
      if (error && error.message) {
        PostMessageService.gesture.showAlert(error.message, 'error');
      } else {
        PostMessageService.gesture.showAlert('Please relogin', 'error');
      }
    });
  };

}