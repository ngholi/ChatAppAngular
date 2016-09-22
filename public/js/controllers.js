var eplControllers = angular.module('eplControllers',['ui.bootstrap','services','satellizer','webcam']);

eplControllers.controller('MainCtrl',['$scope','$location','$auth','$http',
	function($scope,$location,$auth){
		$scope.$watch(function(){
			$scope.user = $auth.getPayload();
		})
		

		$scope.isAuthenticated = function(){
			return $auth.isAuthenticated();
		}

		$scope.logout = function(){
			$location.path('/login');
			$auth.logout();
		}

}]);

eplControllers.controller('AuthCtrl',['$scope','$location','$auth',
	function($scope,$location,$auth){
	
		$scope.register = function(){
			$auth.signup($scope.user).then(function (response) {

          		$auth.login($scope.user).then(function (response) {
					$location.path('/home');
          		}).catch(function (response) {    
            		console.log($scope.message);
        		});

     	 	}).catch(function (response) {
        		console.log(response);
        		$scope.message = response.data.message;
        		console.log($scope.message);
      		});
		};


		$scope.logIn = function(){
			$auth.login($scope.user)
			.then(function(response){
				$location.path('/home');
			}).catch(function(response){
				$scope.message = response.data.message;
				console.log($scope.message);
			})
		};
}]);

eplControllers.controller('TableCtrl',['$scope','$location','$auth', 'ChatUIRender',
	function($scope,$location,$auth, render){


	var chatBox = document.getElementById('chat-box');
	document.getElementsByTagName('textarea')[0].onkeydown = function(e){
		if(e.keyCode == 13){
			if(e.shiftKey !== true){
				$scope.$apply($scope.send());
				e.preventDefault();
			}
		}
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

eplControllers.controller('RoomCtrl',['$scope','$http','$auth',
	function($scope,$http,$auth){
		var payload = $auth.getPayload();
		var user = {
			name: payload.username,
			id: payload.id
		}
		$scope.rooms = [];
		$scope.joinedRooms = [];
		$scope.createRoom = function(){
			var payload = $auth.getPayload();
			
			var room = {
				roomName: $scope.newRoomName,
				owner: payload.id
			}
			console.log(room);

			$http.post('/rooms/create',room)
				.then(function(res){
					console.log(res.data);
					$scope.message = 'Room created successfully';
					$scope.$broadcast('join a room',{user: user, room: res.data.roomId});
				},function(res){
					console.log(res);
					$scope.message = res.data.message;
			});
		}

		$scope.joinRoom = function(roomId){
			$http.post('/rooms/join', {roomId: roomId})
				.then(function(res){
					console.log(res);
					$scope.$broadcast('join a room',{user: user, room: roomId});
				},function(res){
					console.log(res);
			})
		}

		$scope.getAllRooms = function(){
			$http.get('/rooms/all')
				.then(function(res){
					console.log(res.data);
					$scope.rooms = res.data.rooms;
				},function(res){
					console.log(res);
			});
		}

		$scope.getJoinedRooms = function(){
			$http.get('/rooms/joinedrooms')
				.then(function(res){
					console.log(res.data);
					$scope.joinedRooms = res.data.rooms;
				},function(res){
					console.log(res);
			});
		}

		$scope.sendToRoom = function(id){
			console.log(id);
			$scope.$broadcast('send new message',{roomId: id, sender: user.id, message: $scope.roomMessage});
			$scope.roomMessage = "";
		}

}]);

eplControllers.controller('ChatCtrl',['$scope','$http','$auth','$rootScope',
	function($scope,$http,$auth,$rootScope){
		$scope.roomMessages = [];
		$scope.rooms = [];
		$scope.onlineUsers = [];

		var payload = $auth.getPayload();
		var user = {
			name: payload.username,
			id: payload.id
		}

		var socket = $rootScope.socket|| io('localhost:3000/',{query: 'user='+user.id});
		$rootScope.socket = socket;
		

		
		socket.emit("rejoin rooms",{user: user}, function(result,message){
			if(result){
				$scope.rooms = result;
				console.log($scope.rooms);
				console.log(message);
				socket.emit("update online users",function(users){
					$scope.$apply(function(){
						$scope.onlineUsers = users;
					})
				})
			}else{
				console.log(message);
			}
		})

		

		$scope.$on('join a room', function(ev, args){
			socket.emit('join room', args, function(result, message){
				console.log(message);
			});
		})
		$scope.$on('send new message', function(ev, args){
			socket.emit('new room message', args);
		})

		
		socket.on('user online noti', function(userData){
			socket.emit("update online users",function(users){
				$scope.$apply(function(){
					$scope.onlineUsers = users;
				})
				console.log('users online: ');
				console.log($scope.onlineUsers);
			})
			
		})
		socket.on('user offline noti', function(userId){
			socket.emit("update online users",function(users){
				$scope.$apply(function(){
					$scope.onlineUsers = users;
				})
				console.log('users online: ');
				console.log($scope.onlineUsers);
			})
			
		})
		socket.on('receive room message', function(data){
			console.log(data);
			$scope.$apply(function(){
				$scope.roomMessages.push(data);
			})
		})

}]);



