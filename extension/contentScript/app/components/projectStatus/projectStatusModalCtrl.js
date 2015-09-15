angular.module('MyApp').controller('ProjectStatusModalCtrl',
    function($scope, $auth, $location, $stateParams, SaveProject, Account, Users, AllSlackUsers, CheckProjectTokenName,
             $modalInstance, $state, CheckProjectCode, PostMessageService,ChannelProject) {

    $scope.userData= '';
    $scope.validationFailureForTokenName = false;
    $scope.validationFailureForCode = false;
    $scope.buttonDisabled = false;
    $scope.channelId = $stateParams.channelId;

    PostMessageService.gesture.hideIframe();

    $scope.closeModal = function() {
      $modalInstance.dismiss('cancel');
    };
    PostMessageService.gesture.showIframe();
    $scope.projectStatusModel = {
        token_name : '',
        slack_teamid : '',
        name : '',
        code : '',
        token :'',
        channelId :$scope.channelId,
        channelName :'',
        a :'50',
        b :'50',
        contributers : [ {
            contributer_id : '0',
            contributer_percentage : '100',
            contributer_name:'',
            contributer_fullname:'',
            contribution1: '50',
            className:'contributer-cell-wrapper',
            img:'/extension/contentScript/app/images/icon-dude.png'
        } ]
    };

   

    

   
});