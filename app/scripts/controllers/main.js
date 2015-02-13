'use strict';

/**
 * @ngdoc function
 * @name sharepointappApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sharepointappApp
 */

angular.module('sharepointappApp').controller('MainCtrl', ['SharePoint', function (SharePoint) {

	SharePoint.API.me().success(function (user) {
		console.log(user);
	});

}]);




