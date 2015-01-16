'use strict';

/**
 * @ngdoc function
 * @name sharepointappApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sharepointappApp
 */
angular.module('sharepointappApp').controller('MainCtrl', 
	['ReportList', '$location',
	function (ReportList, $location) {

		// Get the count of reports that are still active
		ReportList.find('$filter=IsActive eq \'1\'&$select=Id').then(function (reports) {
			// If there is an active report go to it
			if (reports.length > 0) {
				$location.path('/manage-report/' + reports[0].Id);
			} else {
				$location.path('/new-report');
			}

		});

}]);




