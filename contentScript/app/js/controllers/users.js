angular.module('MyApp')
  .controller('UsersCtrl', function($scope,$auth,$location,$stateParams,Users,UserDetail,SaveUser,Account) {
	$scope.userId = $stateParams.userId;
	
	// if not authenticated return to splash:
	//if(!$auth.isAuthenticated()){
	//	$location.path('splash'); 
    //}
	
	$scope.UserModel = {			
			name : '',
			tokens : '',
			reputation : ''
					
	};  
	
	userData = Account.getUserData();
	
	$scope.users = Users.getOrg.getUsers({
		organizationId : userData.orgId
	});
	
	console.log('$scope.users:'+$scope.users)
	console.log($scope.users)
	
	//$scope.users = User.query();
  	$scope.orderProp = "name"; // set initial order criteria
	
	$scope.getUser = function(entity) {
		var userId = 0;
		if(entity){
			userId = entity.id;
		}
		console.log("get UserId "+userId);
		$location.path("/user/"+ userId);
			
	};
	
	$scope.createUser = function(){
		console.log("Create User");		
		console.log($scope.UserModel);
		$location.path("/user");
	};
	
	if($scope.userId && $scope.userId != 0){
		console.log('comes here');
		$scope.data1 = UserDetail.getDetail({userId:$scope.userId,organizationId:userData.orgId});	
		$scope.data1.$promise.then(function (result) {
				$scope.UserModel = result;				
			});	
	}
	
	$scope.submit = function(){
		console.log("In Submit method");
		console.log($scope.UserModel)
		$scope.data = SaveUser.save({},$scope.UserModel);
		$scope.data.$promise.then(function (result) {
			alert('Successfully saved');
			$location.path("/users");
		});
	};
	
});