var eplApp = angular.module('eplApp',[
	'ngRoute',
	'eplControllers',
	'satellizer',
]);

eplApp.config(['$routeProvider','$authProvider',
	function($routeProvider,$authProvider){
		$routeProvider.
			when('/login',{
				templateUrl: 'templates/teams.html',
				controller: 'AuthCtrl',
				auth: false
			}).
			when('/register',{
				templateUrl: 'templates/register.html',
				controller: 'AuthCtrl',
				auth: false
			}).
			when('/home',{
				templateUrl: 'templates/table.html',
				controller: 'TableCtrl',
				auth: true
			}).
			otherwise({
				redirectTo: '/home'
			});

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