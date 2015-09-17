angular.module('MyApp').controller('ProjectStatusModalCtrl',
    function($scope, $auth, $location, $stateParams, SaveProject, Account, Users, AllSlackUsers, CheckProjectTokenName,
             $modalInstance, $state, CheckProjectCode, PostMessageService,ChannelProject,MileStoneCurrent,MileStoneForChannel,MileStone) {

    $scope.userData= '';
    $scope.validationFailureForTokenName = false;
    $scope.validationFailureForCode = false;
    $scope.buttonDisabled = false;
    $scope.channelId = $stateParams.channelId;
    $scope.channelName = '';

    PostMessageService.gesture.hideIframe();

    $scope.closeModal = function() {
      $modalInstance.dismiss('cancel');
    };
    PostMessageService.gesture.showIframe();
    $scope.projectMileStones = '';
    $scope.projectStatusModel = {
    	totalValue : '',
    	tokenName : '',
    	code : '',
    	tokens : '',
    	contributions :'',
    	channelName:'',
    	contributers :'',
        milestoneContributers : [ {
            contributer_id : '',
            contributer_percentage : '',
            name:'',
            real_name:'',
            url: '',
        } ],
        milestoneContributions : [ {
            title : '',
            date : '',
            valuation:'',
            contribution_id:'',
        } ]
    };
    
    $scope.getProfile = function() {
	      Account.getProfile()
	        .success(function(data) {
				Account.setUserData(data);
				var userData = Account.getUserData();
				$scope.userId = userData.userId;
				$scope.slackTeamId = userData.slackTeamId;
				getCurrentProjectStatus();             
				
	        })
	        .error(function(error) {
	        	if (error && error.message) {
                  PostMessageService.gesture.showAlert(error.message, 'error');
              } else {
                  PostMessageService.gesture.showAlert('Please relogin', 'error');
              }
	        });
	    };
	    
	    var userData = Account.getUserData();
		 console.log("userData is"+userData);
		 if(userData == undefined) {
			 $scope.getProfile();
		 } else {
			 $scope.userId = userData.userId;
			$scope.slackTeamId = userData.slackTeamId;
			getCurrentProjectStatus();      
		 }
		 $scope.updateViewforMileStone = function(mileStoneId) {
			 if(mileStoneId != -1){
				 $scope.MileStoneCurrentData = MileStone.getDetail({
		    		  	id: mileStoneId
				      });
				 $scope.MileStoneCurrentData.$promise.then(function(result) {
			    	  $scope.projectStatusModel = result;
			    	  $scope.projectStatusModel.channelName = $scope.channelName;
			    	 
			      });
			 }else{
				 $scope.MileStoneCurrentData = MileStoneCurrent.getDetail({
		    		  	orgId: $scope.orgId
				      });
				 $scope.MileStoneCurrentData.$promise.then(function(result) {
			    	  $scope.projectStatusModel = result;
			    	  $scope.projectStatusModel.channelName = $scope.channelName;
			    	 
			      });
			 }
			 
		    };
	// if not authenticated return to splash:
	if(!$auth.isAuthenticated()){
		$location.path('splash'); 
   }  
	    function getCurrentProjectStatus(){
			if ($scope.channelId && $scope.channelId != 0) {
				 $scope.ChannelProjectExistsData = ChannelProject.exists({
				        channelId: $scope.channelId,
				        slackTeamId: $scope.slackTeamId,
				        userId: $scope.userId
				      });
				

				      $scope.ChannelProjectExistsData.$promise.then(function(result) {
				    	  $scope.orgId = result.orgId;
				    	  $scope.channelName = result.channelName;
				    	  $scope.projectStatusModel.channelName = result.channelName;
				    	  $scope.MileStoneCurrentData = MileStoneCurrent.getDetail({
				    		  	orgId: $scope.orgId
						      });
				    	  $scope.MileStoneForChannelData = MileStoneForChannel.allDetails({
				    		  orgId: $scope.orgId
						      });
				    	  $scope.MileStoneForChannelData.$promise.then(function(result) {
					    	  $scope.projectMileStones = result;
					    	 
					      });
				    	  $scope.MileStoneCurrentData.$promise.then(function(result) {
					    	  $scope.projectStatusModel = result;
					    	 
					      });
				      });
				      
				}
		}

   

    

   
});