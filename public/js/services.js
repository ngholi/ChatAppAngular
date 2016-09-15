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

