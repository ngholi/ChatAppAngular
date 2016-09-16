var services = angular.module('services',['ngResource']);

services.factory('Auth',['$http','$window','$location',function($http,$window,$location){
	var auth = {};

	auth.saveToken = function(token){
		$window.localStorage['my-chat-app'] = token;
	}

	auth.getToken = function(){
		return $window.localStorage['my-chat-app'];
	}

	auth.isLoggedIn = function(){
		$window.localStorage.removeItem('my-chat-app');
		var token = auth.getToken();
		if(token){
			var payload = JSON.parse($window.atob(token.split('.')[1]));

			return payload.exp > Date.now() / 1000;
		}else{
			return false;
		}
	}
	auth.currentUser = function(){
		if(auth.isLoggedIn()){
			var token = auth.getToken();
			var payload = JSON.parse($window.atob(token.split('.')[1]));
			return payload.username;
		}
	}

	auth.currentUserEmail = function(){
		if(auth.isLoggedIn()){
			var token = auth.getToken();
			var payload = JSON.parse($window.atob(token.split('.')[1]));
			return payload.useremail;
		}
	}


	auth.register = function(user){
		return $http.post('/register', user).success(function(data){
			auth.saveToken(data.token);
		});
	}

	auth.login = function(user){
	  	return $http.post('/login', user).success(function(data){
	    	auth.saveToken(data.token);
	  });
	};

	auth.logOut = function(){
		$window.localStorage.removeItem('my-chat-app');
		$location.path('/login');
	}

	return auth;

}]);

services.factory('ChatUIRender', function(){
	var print2number = function(number){
		if(number<10)
			return '0' + number;
		return number;
	}
	return {
		messageInWithContainer: function(data){
			return '<div class="left-chat user-chat"><img src="'+ 
					data.avatarUrl +
					'" class="img-rounded left"/><div class="messages left"><div class="direct-chat-text">' + 
					data.text + 
					'</div></div></div>';
		},
		messageOutWithContainer: function(data){
			return '<div class="right-chat user-chat"><img src="'+ 
					data.avatarUrl +
					'" class="img-rounded right"/><div class="messages right"><div class="direct-chat-text" time="'+ data.time +'">' + 
					data.text + 
					'</div></div></div>';
		},
		singleLine: function(timeInMillis){
			if(timeInMillis)
				var date = new Date(timeInMillis);
			else
				var date = new Date();
			let time = print2number(date.getHours()) + ':' + print2number(date.getMinutes()) + ' ' + print2number(date.getDate()) + '/' + print2number((date.getMonth()+1)) + '/' + date.getFullYear();
			return '<div class="chat-box-single-line"><span class="timestamp">' + 
					time + 
					'</span></div>';
		},
		messageOut: function(data){
			return '<div class="direct-chat-text" time="'+ data.time +'">' + data.text + '</div>';
		},
	};
});