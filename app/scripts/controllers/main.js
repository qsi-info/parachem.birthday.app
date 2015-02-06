'use strict';

/**
 * @ngdoc function
 * @name sharepointappApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sharepointappApp
 */

 /*global $:false */
 /*global moment:false */
angular.module('sharepointappApp').controller('MainCtrl', ['$scope', 'ReportList', 'cfpLoadingBar', function ($scope, ReportList, cfpLoadingBar) {


	$scope.reports = [];
	$scope.notFound = false;

	var now = moment();

	var datepicker = $('.datepicker').datepicker({
		language: 'fr',
		todayHighlight: true,
		format: 'yyyy-mm-dd',
		autoclose: true,
	});

	datepicker.on('changeDate', function (e) {
		cfpLoadingBar.start();

		$scope.notFound = false;

		var rDate = moment(e.date).format();
		var tDate = moment(e.date).add(1, 'days').format();

		var filter = '$filter=(Modified ge datetime\'' + rDate + '\' and Modified le datetime\'' + tDate + '\')';
		var select = '$select=Id,Created,Team,Period,Author/Id,Author/Title&$expand=Author';

		ReportList.find(filter + '&' + select).then(function (reports) {
			$scope.reports = reports;
			if (reports.length < 1) {
				$scope.notFound = true;
			}
			cfpLoadingBar.complete();
		});		
	});

	datepicker.datepicker('setDate', now.format());



	$scope.back = function () {
		var currentDate = moment(datepicker.datepicker('getDate'));
		datepicker.datepicker('setDate', new Date(currentDate.subtract(1, 'days').format()));
	};


	$scope.foward = function () {
		var currentDate = moment(datepicker.datepicker('getDate'));
		datepicker.datepicker('setDate', new Date(currentDate.add(1, 'days').format()));
	};



}]);




