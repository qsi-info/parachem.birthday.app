'use strict';

/**
 * @ngdoc function
 * @name AngularSharePointApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the AngularSharePointApp
 */

angular.module('AngularSharePointApp').controller('MainCtrl', ['$rootScope', '$location', function ($rootScope, $location) {

	if (typeof $rootScope.isInitialize === 'undefined' || !$rootScope.isInitialize) {
		return $location.path('/gateway');
	}

}]);




