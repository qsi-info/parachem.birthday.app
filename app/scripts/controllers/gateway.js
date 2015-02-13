'use strict';

/**
 * @ngdoc function
 * @name sharepointappApp.controller:GatewayCtrl
 * @description
 * # GatewayCtrl
 * Controller of the sharepointappApp
 */

angular.module('sharepointappApp').controller('GatewayCtrl', ['SharePoint', '$rootScope', '$location', function (SharePoint, $rootScope, $location) {


	if (typeof $rootScope.me === 'undefined') {


		SharePoint.init($rootScope.sp.host, $rootScope.sp.app, $rootScope.sp.sender).then(function () {
			SharePoint.API.me().then(function (user) {
				$rootScope.me = user;
				$location.path('/home');
			});			
		});

	} else {
		$location.path('/home');
	}


}]);




