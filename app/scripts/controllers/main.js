'use strict';

/**
 * @ngdoc function
 * @name AngularSharePointApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the AngularSharePointApp
 */

angular.module('AngularSharePointApp').controller('MainCtrl', ['SharePoint', function (SharePoint) {


	var list = new SharePoint.API.List('Rapports Laboratoire');

	list.lastModification().then(function (count) {
		console.log(count);
	});

}]);




