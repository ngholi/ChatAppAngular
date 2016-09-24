var eplControllers = angular.module('eplControllers',['services','satellizer','webcam', 'ngMaterial', 'ui.router']);

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



