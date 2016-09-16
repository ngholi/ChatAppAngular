var eplControllers = angular.module('eplControllers',['ui.bootstrap','services','satellizer','webcam']);

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
	var chatBox = document.getElementById('chat-box');
	document.getElementsByTagName('textarea')[0].onkeydown = function(e){
		if(e.keyCode == 13){
			if(e.shiftKey !== true){
				$scope.$apply($scope.send());
				e.preventDefault();
			}
		}
	};
	$rootScope.user = {
		id: payload.id,
		name: payload.username,
		email: payload.useremail
	};
	$scope.friendList = [
		{name: 'Linh'},
		{name: 'Minh'},
		{name: 'Dat'},
		{name: 'Linh'},
		{name: 'Minh'},
		{name: 'Dat'},
		{name: 'Linh'},
		{name: 'Minh'},
		{name: 'Dat'},
		{name: 'Linh'},
		{name: 'Minh'},
		{name: 'Dat'},
		{name: 'Linh'},
		{name: 'Minh'},
		{name: 'Dat'},
		{name: 'Linh'},
		{name: 'Minh'},
		{name: 'Dat'},
	];

	// -----Chat box UI-----

	//This function updates UI only, not handle with network
	var UISendMessage = function(){
		//Check message is empty
		if(!$scope.myMessage) return;

		if(shouldDrawSingleLine()){
			//Draw line and append chat text
			chatBox.innerHTML += render.singleLine();
			let template = render.messageOutWithContainer({avatarUrl: 'images/default-ava.png', text: $scope.myMessage, time: Date.now()});
			chatBox.innerHTML += template;
		}
		else{
			let lastContainer = previousMessIsMine();
			if(!lastContainer){
				//previous message it not mine, create new container
				let template = render.messageOutWithContainer({avatarUrl: 'images/default-ava.png', text: $scope.myMessage, time: Date.now()});
				chatBox.innerHTML += template;
			}
			else{
				//previous message is mine, append my message into container
				lastContainer.getElementsByClassName('messages')[0].innerHTML += render.messageOut({text: $scope.myMessage, time: Date.now()});
			}	
		}
		
		
		//Clear textarea and scroll down chat-box to bottom
		$scope.myMessage = '';
		chatBox.scrollTop = chatBox.scrollHeight;
	}

	//-----Support function-----

	//This function check last mess, if it is not mine, return false. If it is mine, return last element
	var previousMessIsMine = function(){
		//get last message container
		var  x = chatBox.getElementsByClassName('user-chat');
		var last = x[x.length - 1];

		//check this container. If it's mine, return true
		if(last.className.indexOf('right-chat') >= 0){
			return last;
		}
		return false;
	}

	//Return true if now() and last message time are so far (defaultTime is 5 minutes)
	var shouldDrawSingleLine = function(){
		console.log('aaa');
		var defaultTime = 5*60*1000;
		var x = chatBox.getElementsByClassName('direct-chat-text');
		var last = x[x.length - 1];

		last = parseInt(last.getAttribute('time')) || 0;
		return Date.now() - last > defaultTime;
	}

	$scope.send = function(){

		// UI process
		UISendMessage();
		
		return false;
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

