var eplApp = angular.module('eplApp',[
	'ngRoute', 'ui.router',
	'eplControllers',
	'satellizer',
]);

eplApp.config(['$routeProvider','$authProvider', '$stateProvider', '$urlRouterProvider',
	function($routeProvider,$authProvider, $stateProvider, $urlRouterProvider){
		$urlRouterProvider.otherwise('/home/rooms');
		$stateProvider.
			state('login',{
				url: '/login',
				templateUrl: 'templates/login.html',
				controller: 'AuthCtrl',
				auth: false
			}).
			state('register',{
				url: '/register',
				templateUrl: 'templates/register.html',
				controller: 'AuthCtrl',
				auth: false
			}).
			state('home',{
				abstract: true,
				url: '/home',
				templateUrl: 'templates/home.html',
				controller: 'HomeCtrl as home',
				auth: true
			}).
			state('home.rooms', {
				url: '/rooms',
				templateUrl: 'templates/room.html',
				controller: 'RoomCtrl',
				auth: true
			}).
			state('home.chat', {
				url: '/chat/{roomId}',
				templateUrl: 'templates/chat.html',
				controller: 'ChatCtrl',
				auth: true
			})
		;

		$authProvider.loginUrl = '/login';
  		$authProvider.signupUrl = '/register';
}]);

eplApp.run( function($rootScope, $location,$auth) {

    // register listener to watch route changes
    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
      if ( !$auth.isAuthenticated() ) {
        // no logged user, we should be going to #login
        if ( next.auth == false ) {
          // already going to #login, no redirect needed
        } else {
          event.preventDefault();
          $location.path( "/login" );
        }
      }         
    });
})