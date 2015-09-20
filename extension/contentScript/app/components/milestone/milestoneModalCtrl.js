angular.module('MyApp').controller('MilestoneModalCtrl', MilestoneModalCtrl);

function MilestoneModalCtrl($scope, $stateParams, $timeout, $modalInstance, _DEV, Resource, Account, Milestone, PostMessageService) {

  var log = _DEV.log('MILESTONE');

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
    } ],
    contributions: []
  };

  angular.extend($scope, {
    submit: submit,
    closeModal: closeModal,
    userData: '',
    activeContribution: {},
    teams: [],
    milestoneModel: milestoneModel
  });

  init();

  function init() {

    PostMessageService.gesture.hideIframe();
    
    $scope.userData = Account.getUserData();
    log("userData is"+$scope.userData);

    if ( $scope.userData == undefined ) {

     getProfile();

    } 

    else {

     $scope.userId = $scope.userData.userId;
     $scope.access_token = $scope.userData.access_token;
     PostMessageService.gesture.showIframe();

    }

    $timeout(function() {
      var path = "organization/channel/" + channelId + "/" + $scope.userData.slackTeamId + "/" + $scope.userId;
      log('init Timeout: path: ', path);
      
      Resource.get(path).then(function(result) {
        log('init Timeout: Get channel : ', result); 
        Milestone.getCurrent(result.orgId).then(function(result) {
          log('init Timeout: Get channel: get milestone ', result);
          $scope.milestoneModel.contributions = result.milestoneContributions;
          $scope.milestoneModel.contributers = result.milestoneContributers;
          $scope.contributersCount = result.contributers;
          $scope.tokenCode = result.code;
          $scope.totalValue = result.totalValue;
        });
      });
    }, 1000);

  }

  function closeModal() {
    $modalInstance.dismiss('cancel');
  };
 
  function submit() {
    log('Create Milestone', $scope.milestoneModel.title, $scope.milestoneModel.description, $scope.milestoneModel.evaluatingTeam, channelId);
    Milestone.create($scope.milestoneModel.title, $scope.milestoneModel.description, $scope.milestoneModel.evaluatingTeam, channelId)
    .then(function(result) {
      log('Create Milestone CB', result);
    });
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