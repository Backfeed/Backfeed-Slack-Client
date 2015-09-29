angular.module('MyApp')
  .controller('ProfileCtrl', function($scope, $auth, PostMessageService, Account) {
	
	// if not authenticated return to splash:
	if(!$auth.isAuthenticated()){
		$location.path('splash'); 
    }
    /**
     * Get user's profile information.
     */
    $scope.getProfile = function() {
      Account.getProfile()
        .success(function(data) {
			console.log('profileData:');
			console.dir(data);
          	$scope.user = data;
			Account.setUserData(data);
			
        })
        .error(function(error) {
            PostMessageService.gesture.showAlert(error.message, 'error');
        });
    };


    /**
     * Update user's profile information.
     */
    $scope.updateProfile = function() {
      Account.updateProfile({
        displayName: $scope.user.displayName,
        email: $scope.user.email
      }).then(function() {
        PostMessageService.gesture.showAlert('Profile has been updated', 'success');
      });
    };

    /**
     * Link third-party provider.
     */
    $scope.link = function(provider) {
		var supportedProviders = ['trello','slack'];
		
		if(supportedProviders.indexOf(provider) == -1) {
          PostMessageService.gesture.showAlert('Under construction.', 'warning');
          return;
		}
		
        $auth.link(provider)
          .then(function() {
                PostMessageService.gesture.showAlert('You have successfully linked ' + provider + ' account', 'success');
          })
          .then(function() {
            $scope.getProfile();
          })
          .catch(function(response) {
                PostMessageService.gesture.showAlert(response.data.message, 'success');
          });
    };

    /**
     * Unlink third-party provider.
     */
    $scope.unlink = function(provider) {
	
	   //	*************  currently not supported :
        PostMessageService.gesture.showAlert('Under construction.', 'warning');
		
		/*
        $auth.unlink(provider)
            .then(function() {
                PostMessageService.gesture.showAlert('You have successfully unlinked ' + provider + ' account', 'success');
            })
            .then(function() {
              $scope.getProfile();
            })
            .catch(function(response) {
                PostMessageService.gesture.showAlert(response.data ? response.data.message : 'Could not unlink ' + provider + ' account', 'error');
            });
         */
    };



// ***********	Trello -  Save Token - Quick and Dirty:	TBD: redue this securely		***********
	//var HOST = 'deap-env.elasticbeanstalk.com'
	var HOST = 'localhost:3000';
	var PROTOCL = 'http://';
	var TOKENS_SERVICE = '/auth/trello';

	var saveToken = function(member,token,service) {

		console.log('saving member: service:'+service);
		console.dir(member);

		console.log('saving Token:'+token + ' service:'+service);

		var url = PROTOCL + HOST + TOKENS_SERVICE;

		console.log('url:'+url);

		var data = {
			token:token,
			serviceMemberId:member.id,
			service:service,
			display_name: $scope.user.displayName,
			id: $scope.user.id,
			email: $scope.user.email
		};

		// TBD: move to use angularJS instead of Jquery and get rid of need to change  Host when we deploy...
		$.ajax({
			type: "POST",
		  url: url,
		  data: data,
		  success: tokenSaved,
			persist:true,
			dataType:'JSON'
		});
	};

	var tokenSaved = function(data) {
		console.log('tokenSaved. data:');
		console.dir(data);
		

	
	};

	var onTrelloAuthorized = function() {

		
		var token = Trello.token();
		console.log('authorized!, trello token:'+token);
		
		// update the view since its done with Jquery :
		$scope.user.trello = token;
		//Account.setTrelloToken(token);

		
		// Send Token To App: ( TBD: secure this action )


	    Trello.members.get("me", function(member){
	        console.log('trello User full name:'+member.fullname);
			saveToken(member,$scope.user.trello,'trello');
	    });

	};


	$scope.linkTrello = function() {
			console.log('link trello clicked');

		    Trello.authorize({
				persist:true,
				interactive:true,
				type: "popup",
		        success: onTrelloAuthorized,
		        scope: { write: true, read: true },
				expiration:'never'
		    })
    };

	$scope.unlinkTrello = function() {
			Trello.deauthorize();
    };
	
   
    $scope.getProfile();

  });