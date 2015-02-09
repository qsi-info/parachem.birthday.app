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
angular.module('sharepointappApp').controller('MainCtrl', ['$scope', 'ReportList', 'CommentList', 'cfpLoadingBar', function ($scope, ReportList, CommentList, cfpLoadingBar) {


	$scope.results = [];
	$scope.notFound = false;
	$scope.comments = [];



	// All the sections of this kind of report
	$scope.sections = [
		{ name: 'Sécurité', id: 'securite' },
		{ name: 'Chaudières et Utilités', id: 'chaudieres' },
		{ name: 'Hydrogène', id: 'hydrogene' },
		{ name: 'Paraxylène', id: 'paraxylene' },
		{ name: 'STDP', id: 'stdp' },
		{ name: 'Tours d\'eau de refroidissement', id: 'tours' },
		{ name: 'Divers', id: 'divers' },
		{ name: 'Personnel', id: 'personnel' },
	];	

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
		$scope.comments = [];
		$scope.results = [];
		$scope.searchContext = '';

		var rDate = moment(e.date).format();
		var tDate = moment(e.date).add(1, 'days').format();

		var filter = '$filter=(Modified ge datetime\'' + rDate + '\' and Modified le datetime\'' + tDate + '\')';
		var select = '$select=Id,Created,Team,Period,Modified,Author/Id,Author/Title&$expand=Author';

		ReportList.find(filter + '&' + select).then(function (results) {
			$scope.results = results;
			if (results.length < 1) {
				$scope.notFound = true;
			}
			cfpLoadingBar.complete();
		});		
	});

	datepicker.datepicker('setDate', now.format());


	$scope.highlight = function(text) {
	  return text.replace(new RegExp($scope.searchContext, 'gi'), '<span class="highlightedText">$&</span>');
	};


	$scope.back = function () {
		var currentDate = moment(datepicker.datepicker('getDate'));
		datepicker.datepicker('setDate', new Date(currentDate.subtract(1, 'days').format()));
	};


	$scope.foward = function () {
		var currentDate = moment(datepicker.datepicker('getDate'));
		datepicker.datepicker('setDate', new Date(currentDate.add(1, 'days').format()));
	};


	$scope.search = function () {
		var odataExpand = '$expand=Author,Report';
		var odataSelect = '$select=Author/Id,Author/Title,Report/Period,Report/Id,Report/Team,Report/Modified';
		var odataFilter = '$filter=substringof(\'' + $scope.searchContext + '\', Title)';

		cfpLoadingBar.start();
		$scope.notFound = false;
		$scope.comments = [];
		$scope.results = [];

		CommentList.find(odataFilter + '&' + odataSelect + '&' + odataExpand).then(function (results) {

			$scope.results = [];

			var isFound;

			results.forEach(function (result) {

				isFound = false;

				for (var i=0, len = $scope.results.length; i < len; i++) {
					if (result.Report.Id === $scope.results[i].Id) {
						isFound = true;
						console.log(result);
						break;
					}
				}

				if (!isFound) {
					$scope.results.push({
						Author: result.Author,
						Id: result.Report.Id,
						Team: result.Report.Team,
						Modified: result.Report.Modified,
						Period: result.Report.Period,
					});
				}

			});

			// $scope.results = results;

			if (results.length < 1) {
				$scope.notFound = true;
			}
			cfpLoadingBar.complete();			
		});
	};


	$scope.fetchComments = function (report) {
		var reportId = report.Id || report.Report.Id;
		var $collapseDiv = $('.collapse' + reportId);
		if ($collapseDiv.hasClass('in')) {
			$collapseDiv.collapse('hide');
		} else {
			cfpLoadingBar.start();
			$('.comment-collapse.in').collapse('hide');
			var odataSelect = '$select=Title,Section,ReportId';
			var odataFilter = '$filter=Report eq ' + reportId;
			CommentList.find(odataFilter + '&' + odataSelect).then(function (comments) {
				$scope.comments = comments;
				$collapseDiv.collapse('show');
				cfpLoadingBar.complete();
			});
		}
	};



}]);




