'use strict';

/**
 * @ngdoc function
 * @name sharepointappApp.controller:NewreportCtrl
 * @description
 * # NewreportCtrl
 * Controller of the sharepointappApp
 */
/*global $:false */
/* jshint loopfunc:true */


angular.module('sharepointappApp').controller('ManageReportCtrl', 
	
	['$scope', '$location', 'ReportList', 'CommentList', '$routeParams', 'cfpLoadingBar',
	
	function ($scope, $location, ReportList, CommentList, $routeParams, cfpLoadingBar) {

		$scope.comments = [];
		$scope.isLoad = false;
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

		$scope.inputs = {
			securite: '',
			chaudieres: '',
			hydrogene: '',
			paraxylene: '',
			stdp: '',
			tours: '',
			divers: '',
			personnel: '',
		};



		$('body').on('hide.bs.collapse', '#securiteCollapse', function () { $('#securiteIcon').removeClass('fa-caret-down').addClass('fa-caret-right'); });
		$('body').on('show.bs.collapse', '#securiteCollapse', function () { $('#securiteIcon').removeClass('fa-caret-right').addClass('fa-caret-down'); });
		
		$('body').on('hide.bs.collapse', '#chaudieresCollapse', function () { $('#chaudieresIcon').removeClass('fa-caret-down').addClass('fa-caret-right'); });			
		$('body').on('show.bs.collapse', '#chaudieresCollapse', function () { $('#chaudieresIcon').removeClass('fa-caret-right').addClass('fa-caret-down'); });			
		
		$('body').on('hide.bs.collapse', '#hydrogeneCollapse', function () { $('#hydrogeneIcon').removeClass('fa-caret-down').addClass('fa-caret-right'); });			
		$('body').on('show.bs.collapse', '#paraxyleneCollapse', function () { $('#paraxyleneIcon').removeClass('fa-caret-right').addClass('fa-caret-down'); });			
		
		$('body').on('hide.bs.collapse', '#paraxyleneCollapse', function () { $('#paraxyleneIcon').removeClass('fa-caret-down').addClass('fa-caret-right'); });			
		$('body').on('show.bs.collapse', '#stdpCollapse', function () { $('#stdpIcon').removeClass('fa-caret-right').addClass('fa-caret-down'); });			
		
		$('body').on('hide.bs.collapse', '#stdpCollapse', function () { $('#stdpIcon').removeClass('fa-caret-down').addClass('fa-caret-right'); });			
		$('body').on('show.bs.collapse', '#toursCollapse', function () { $('#toursIcon').removeClass('fa-caret-right').addClass('fa-caret-down'); });			
		
		$('body').on('hide.bs.collapse', '#toursCollapse', function () { $('#toursIcon').removeClass('fa-caret-down').addClass('fa-caret-right'); });			
		$('body').on('show.bs.collapse', '#diversCollapse', function () { $('#diversIcon').removeClass('fa-caret-right').addClass('fa-caret-down'); });			
		
		$('body').on('hide.bs.collapse', '#diversCollapse', function () { $('#diversIcon').removeClass('fa-caret-down').addClass('fa-caret-right'); });			
		$('body').on('show.bs.collapse', '#diversCollapse', function () { $('#diversIcon').removeClass('fa-caret-right').addClass('fa-caret-down'); });			
		
		$('body').on('hide.bs.collapse', '#personnelCollapse', function () { $('#personnelIcon').removeClass('fa-caret-down').addClass('fa-caret-right'); });			
		$('body').on('show.bs.collapse', '#personnelCollapse', function () { $('#personnelIcon').removeClass('fa-caret-right').addClass('fa-caret-down'); });			



		ReportList.findOne($routeParams.id, '$select=Id,useLastReport,Created,IsInitialize,IsActive,Team,Period,Author/Id,Author/Title&$expand=Author')
		.then(function (report) {

			// Bind the report
			$scope.report = report;

			// If the last report is needed and this one has not been initialized
			if (report.useLastReport && !report.IsInitialize) {
				// Example to get the last report that was not active, last shift.		
				ReportList.find('&$filter=(IsActive eq 0)&$orderby=Modified desc&$top=1').then(function (reports) {
					// If There is an active report
					if (reports.length > 0) {
						var lastReport = reports[0];
						// Get all the comments from that report and initialize this report with those comments.
						CommentList.find('$filter=(Report eq \'' + lastReport.Id + '\')').then(function (comments) {
							/*jslint browser: true, plusplus: true */
							cfpLoadingBar.start();
							if (comments.length > 0) {
								var inc = comments.length;
								for (var i=0, len=comments.length; i < len; i++) {
									/* jshint loopfunc:true */
									CommentList.add({
										Title: comments[i].Title,
										Section: comments[i].Section,
										ReportId: report.Id,
									})
									.then(function (comment) {
										$scope.comments.push(comment);
										inc --;
										console.log(inc);
										if (inc === 0) {
											ReportList.update(report.Id, { IsInitialize: true }).then(function () {
												cfpLoadingBar.complete();
												$scope.isLoad = true;
											});
										}
									});
								}
							} else {
								ReportList.update(report.Id, { IsInitialize: true }).then(function () {
									cfpLoadingBar.complete();
									$scope.isLoad = true;
								});
							}
						});
					} else {
						ReportList.update(report.Id, { IsInitialize: true }).then(function () {
							$scope.isLoad = true;
						});
					}
				});
			} else {
				cfpLoadingBar.start();				
				CommentList.find('$filter=(Report eq \'' + report.Id + '\')').then(function (comments) {
					for (var i=0, len=comments.length; i < len; i++) {
						$scope.comments.push(comments[i]);
					}
					cfpLoadingBar.complete();
					$scope.isLoad = true;
				});
			}
		});


		$scope.addComment = function (section) {

			if ($scope.inputs[section] === '') {
				return window.alert('Vous devez entrez du texte');
			}
			cfpLoadingBar.start();
			var comment = {
				Title: $scope.inputs[section],
				Section: section,
				ReportId: $scope.report.Id,
			};
			CommentList.add(comment).then(function (addedComment) {
				$scope.comments.push(addedComment);
				$scope.inputs[section] = '';
				cfpLoadingBar.complete();				
			});
		};

		// $scope.addSecuriteComment = function () {
		// 	cfpLoadingBar.start();
		// 	CommentList.add($scope.securite).then(function (addComment) {
		// 		$scope.comments.push(addComment);
		// 		$scope.securite.Title = '';
		// 		cfpLoadingBar.complete();				
		// 	});
		// };


		// $scope.addChaudieresComment = function () {
		// 	cfpLoadingBar.start();
		// 	CommentList.add($scope.chaudieres).then(function (addComment) {
		// 		$scope.comments.push(addComment);
		// 		$scope.chaudieres.Title = '';
		// 		cfpLoadingBar.complete();				
		// 	});			
		// };


		$scope.removeComment = function (comment) {
			if (window.confirm('Etes-vous sur de vouloir supprimer cet élélement?')) {
				cfpLoadingBar.start();
				var commentToRemoveIndex = $scope.comments.indexOf(comment);
				var commentToRemove = $scope.comments[commentToRemoveIndex];
				CommentList.remove(commentToRemove.Id).then(function () {
					$scope.comments.splice(commentToRemoveIndex, 1);
					cfpLoadingBar.complete();
				});
			}
		};


		$scope.submitReport = function () {
			ReportList.update($scope.report.Id, { IsActive: false }).then(function () {
				$location.path('/end-report');
			});
		};


}]);
