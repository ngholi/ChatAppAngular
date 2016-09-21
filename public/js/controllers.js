var eplControllers = angular.module('eplControllers',['services','satellizer','webcam', 'ngMaterial', 'ui.router']);

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

eplControllers.controller('HomeCtrl',['$scope','$location','$auth','$rootScope', '$state',
	function($scope,$location,$auth,$rootScope, $state){

	var payload = $auth.getPayload();
	
	$rootScope.user = {
		// id: payload.id,
		id: 2,
		name: payload.username,
		email: payload.useremail,
		avatarUrl: 'images/default-ava.png'
	};

	var fakeData = {
		//user list, users[userID] will access to user corresponding to
		users: {
			1: {state: 'Online', displayName: 'Hoàng Linh', avatarUrl: 'images/default-ava.png'},
			2: {state: 'Offline', displayName: 'Cứng hơn trứng', avatarUrl: 'images/avatar.jpg'}
		},
		rooms: {
			1: {
				id: 1,
				usersID: [1, 2],
				displayName: 'Cứng hơn trứng',
				coverUrl: 'images/cover.jpg',
				messages: [
					{from: 1, text: 'Hello', time: 0},
					{from: 2, text: 'Hi', time: 2}
				]
			},
		}
	};

	$scope.dataCenter = fakeData;
	
	$scope.cssAvatar = function(userID){
		return 'background-image: url(' + $scope.dataCenter.users[userID].avatarUrl + ');';
	};
	$scope.goState = function(state){
		$state.go(state);
	};
	$scope.showHoursMinutes = function(timeInMillis){
		var d = new Date(timeInMillis);
		return print2Number(d.getHours()) + ':' + print2Number(d.getMinutes());
	};

	function print2Number(number){
		if(number < 10)
			return '0' + number;
		return number;
	}
}]);

eplControllers.controller('RoomCtrl', ['$scope', '$rootScope', '$state', function($scope, $rootScope, $state){
	$rootScope.title = 'Tin nhắn';
	$scope.rooms = $scope.dataCenter.rooms;

	$scope.getLastMessageInRoom = function(room){
		return room.messages[room.messages.length - 1] || false;
	};
	$scope.getLastUserIds = function(room, numberUser){
		var number = numberUser || -1;
		var arr = [];
		if(room.usersID.length === 2){
			if(room.usersID[0] === $rootScope.user.id)
				arr.push(room.usersID[1]);
			else
				arr.push(room.usersID[0]);
			return arr;
		}
		if(room){
			var x = room.messages;
			for(var i = x.length-1; i>=0; i--){
				if(arr.indexOf(x[i].from) < 0){
					arr.push(x[i].from);
					if(arr.length === number) return arr;
				}
			}
		}
		console.log(arr);
		return arr;
	};
	$scope.getLastUsers = function(room, numberUser){
		var userIds = $scope.getLastUserIds(room, numberUser);
		var arr = [];
		var x;
		for(x in userIds){
			arr.push($scope.dataCenter.users[userIds[x]]);
		}
		return arr;
	};
	$scope.goRoom = function(roomId){
		$state.go('home.chat', {roomId: roomId});
	}
}]);

eplControllers.controller('ChatCtrl', ['$rootScope', '$scope', '$stateParams', function($rootScope, $scope, $stateParams){
	var roomId = $stateParams.roomId;
	var room = $scope.dataCenter.rooms[roomId];
	$rootScope.title = room.displayName;
	$scope.conversation = room.messages;

	document.getElementById('my-message').onkeydown = function(e){
		if(e.keyCode == 13 && e.shiftKey == false){
			$scope.$apply($scope.send());
		}
	};

	$scope.send = function(){
		console.log($scope.mess);
		if(!$scope.mess) return;
		room.messages.push({from: $rootScope.user.id, text: $scope.mess, time: Date.now()});
		$scope.mess = '';
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

