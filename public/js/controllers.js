var eplControllers = angular.module('eplControllers',['services','satellizer','webcam', 'ngMaterial']);

eplControllers.controller('MainCtrl',['$scope','$location','$auth','$http',
	function($scope,$location,$auth,$http){	
		console.log("Main");
		console.log($auth.getToken());
		$scope.isAuthenticated = function(){
			return $auth.isAuthenticated();
		}

		$scope.logout = function(){
			console.log('ok');
			$location.path('/login');
			$auth.logout();
		}

}]);

eplControllers.controller('AuthCtrl',['$scope','$location','$auth',
	function($scope,$location,$auth){	
	
		$scope.register = function(){
			$auth.signup($scope.user).then(function (response) {
					console.log(response);
          		$auth.login($scope.user).then(function (response) {
              		console.log($auth.getToken());
					console.log(response);
					$location.path('/home');
          		}).catch(function (response) {    
            		console.log('Login Failed');
        		});

     	 	}).catch(function (response) {
        		console.log(response);
        		$scope.message = response.data.message;
        		console.log('Register Failed');
      		});
		};


		$scope.logIn = function(){
			$auth.login($scope.user)
			.then(function(res){
				console.log($auth.getToken());
				console.log(res);
				$location.path('/home');
			}).catch(function(res){
				$scope.message = res.data.message;
				console.log('Login Failed');
			})
		};
}]);

eplControllers.controller('TableCtrl',['$scope','$location','$auth','$rootScope', 'ChatUIRender',
	function($scope,$location,$auth,$rootScope, render){

	var payload = $auth.getPayload();
	
	$rootScope.user = {
		id: payload.id,
		name: payload.username,
		email: payload.useremail,
		avatarUrl: 'images/default-ava.png'
	};
	

}]);


eplControllers.controller('HomeContentCtrl',['$scope','$http',
	function($scope,$http){
		$http.get('/users')
			.then(function(res){
				console.log(res.data.users);
				$scope.users = res.data.users;
			},function(res){
				console.log(res);
		});

		

}]);

/*eplControllers.controller('WebcamCtrl',['$scope',
	function($scope){
		$scope.wcAllowed = true;
		$scope.turnOnWebCam = function(){
			$scope.onError = function (err) {};
		  	$scope.onStream = function (stream) {};
		  	$scope.onSuccess = function () {};

		  	$scope.myChannel = {
	    	// the fields below are all optional
		    	videoHeight: 450,
		    	videoWidth: 400,
		    	video: null // Will reference the video element on success
		  	};
		}
		
}]);*/

eplControllers.controller('ChatController',['$scope','$window','$rootScope',
	function($scope, $window,$rootScope){
		$scope.messages =[];
		var socket = $window.io('localhost:3000/');
		socket.on("receive-message", function(msg){
	      	$scope.$apply(function(){
	      		console.log("receive message");
	      		console.log(msg);
	      		$scope.messages.push(msg);
	      	})	
      	})

      	$scope.sendMessage = function(){
      	var newMessage = {
      		sender: $rootScope.user,
      		message: $scope.newMessage
      	}
      	socket.emit("new-message", newMessage);
      	$scope.newMessage = undefined;
      }

}]);

