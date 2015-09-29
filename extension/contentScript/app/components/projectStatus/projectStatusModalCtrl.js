angular.module('MyApp').controller('ProjectStatusModalCtrl',
    function($scope, $auth, $location, $stateParams, Account,
             $modalInstance, $state, PostMessageService,ChannelProject,MileStoneCurrent,MileStoneForChannel,MileStone) {

    $scope.userData= '';
    $scope.validationFailureForTokenName = false;
    $scope.validationFailureForCode = false;
    $scope.buttonDisabled = false;
    $scope.channelId = $stateParams.channelId;
    $scope.mileStoneId = $stateParams.mileStoneId;
    $scope.channelName = '';
    $scope.selectedMileStonetId = '';    
    PostMessageService.gesture.hideIframe();

    function closeModal() {
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
            id : '',
            percentage : '',
            name:'',
            real_name:'',
            url: '',
        } ],
        milestoneContributions : [ {
            title : '',
            date : '',
            valuation:'',
            contribution_id:'',
            desciption:'',
            remainingContributers:'',
            contributers : [ {
            	memberId : '',
            	url : '',
            } ]
        } ]
    };
    
    angular.extend($scope, {
        closeModal: closeModal,
        userData: '',
        activeContribution: {},
        projectStatusModel: $scope.projectStatusModel
      });
    
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
	    $scope.updateViewforMileStone = function() {
			 
			 if($scope.selectedMileStonetId && $scope.selectedMileStonetId != -1){
				 
				 $scope.MileStoneCurrentData = MileStone.getDetail({
		    		  	id: $scope.selectedMileStonetId.id
				      });
				 $scope.MileStoneCurrentData.$promise.then(function(result) {
			    	  $scope.projectStatusModel = result;
			    	  $scope.orgId = result.current_org_id;
			    	  $scope.channelName = result.channelName;
			    	  if($scope.projectMileStones == ''){
			    		  $scope.MileStoneForChannelData = MileStoneForChannel.allDetails({
				    		  orgId: $scope.orgId
						      });
				    	  $scope.MileStoneForChannelData.$promise.then(function(result) {
					    	  $scope.projectMileStones = result;
					      });
			    	  }
			    	 
			    	 
			    	  $scope.projectStatusModel.channelName = $scope.channelName;
			    	 
			      });
			 } else if($scope.mileStoneId && $scope.mileStoneId != -1){
				 
				 $scope.MileStoneCurrentData = MileStone.getDetail({
		    		  	id: $scope.mileStoneId
				      });
				 $scope.MileStoneCurrentData.$promise.then(function(result) {
			    	  $scope.projectStatusModel = result;
			    	  $scope.orgId = result.current_org_id;
			    	  $scope.channelName = result.channelName;
			    	  if($scope.projectMileStones == ''){
			    		  $scope.MileStoneForChannelData = MileStoneForChannel.allDetails({
				    		  orgId: $scope.orgId
						      });
				    	  $scope.MileStoneForChannelData.$promise.then(function(result) {
					    	  $scope.projectMileStones = result;
					    	  for (var i = 0; i < $scope.projectMileStones.length; i++) {
					    		  if($scope.projectMileStones[i].id == $scope.mileStoneId){
					    			  $scope.selectedMileStonetId = $scope.projectMileStones[i];
					    			  break;
					    		  }
					    	  }
					    	  $scope.mileStoneId = '';
					      });
			    	  }
			    	  $scope.projectStatusModel.channelName = $scope.channelName;
			      });
			 }
				 
				 else{
				 $scope.MileStoneCurrentData = MileStoneCurrent.getDetail({
		    		  	orgId: $scope.orgId
				      });
				 $scope.MileStoneCurrentData.$promise.then(function(result) {
			    	  $scope.projectStatusModel = result;
			    	  $scope.projectStatusModel.channelName = $scope.channelName;
			    	 
			      });
			 }
			 
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
		
	// if not authenticated return to splash:
	if(!$auth.isAuthenticated()){
		$location.path('splash'); 
   }  
	    function getCurrentProjectStatus(){
			if ($scope.channelId && $scope.channelId != 0 && $scope.channelId != '') {
				 $scope.ChannelProjectExistsData = ChannelProject.exists({
				        channelId: $scope.channelId,
				        slackTeamId: $scope.slackTeamId,
				        userId: $scope.userId
				      });
				

				      $scope.ChannelProjectExistsData.$promise.then(function(result) {
				    	  $scope.orgId = result.orgId;
				    	  $scope.channelName = result.channelName;
				    	  
				    	  $scope.MileStoneCurrentData = MileStoneCurrent.getDetail({
				    		  	orgId: $scope.orgId
						      });
				    	  $scope.MileStoneForChannelData = MileStoneForChannel.allDetails({
				    		  orgId: $scope.orgId
						      });
				    	  $scope.MileStoneForChannelData.$promise.then(function(result) {
					    	  $scope.projectMileStones = result;
					    	  $scope.projectStatusModel.channelName = $scope.channelName;
					    	 
					      });
				    	  $scope.MileStoneCurrentData.$promise.then(function(result) {
					    	  $scope.projectStatusModel = result;
					    	  $scope.projectStatusModel.channelName = $scope.channelName;
					    	 console.log($scope.projectStatusModel);
					      });
				      });
				      
				}
			else if ($scope.mileStoneId && $scope.mileStoneId != 0){
				$scope.updateViewforMileStone();
			}
		}

   

    

   
});