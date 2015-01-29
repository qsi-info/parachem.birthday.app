'use strict';

/**
 * @ngdoc function
 * @name sharepointappApp.controller:NewreportCtrl
 * @description
 * # NewreportCtrl
 * Controller of the sharepointappApp
 */
angular.module('sharepointappApp').controller('NewReportCtrl', 
	['$scope', '$location', 'ReportList', 'User', 'cfpLoadingBar',
	function ($scope, $location, ReportList, User, cfpLoadingBar) {

	cfpLoadingBar.start();

	$scope.report = {
		Title: '',
		useLastReport: true,
	};

	$scope.isLoad = false;

	$scope.accessLastReport = false;
	$scope.lastReportUrl = '';


	ReportList.find('&$filter=(IsActive eq 1)&$orderby=Modified desc&$top=1').then(function (reports) {
		if (reports.length > 0) {
			$location.path('/manage-report/' + reports[0].Id);
		} else {
			User.get().then(function (user) {
				ReportList.find('$filter=(Author/Id eq \'' + user.Id + '\') and (IsActive eq 0)&$orderby=Modified desc&$top=1').then(function (reports) {
					if (reports.length > 0) {
						$scope.accessLastReport = true;
						$scope.lastReportUrl = '#/manage-report/' + reports[0].Id;
					}
					$scope.isLoad = true;
					cfpLoadingBar.complete();
				});
			});
		}
	});






	$scope.setReportGroup = function (team) {
		$scope.report.Team = team;
	};

	$scope.setReportPeriod = function (period) {
		$scope.report.Period = period;
	};


	$scope.create = function () {
		if (typeof $scope.report.Period === 'undefined') {
			return window.alert('Vous devez selectionner la période de votre quart.');
		}

		if (typeof $scope.report.Team === 'undefined') {
			return window.alert('Vous devez selectionner une équipe');
		}

		ReportList.add($scope.report).then(function (reportCreated) {
			$location.path('/manage-report/' + reportCreated.Id);
		});
	};


}]);
