'use strict';

/**
 * @ngdoc function
 * @name sharepointappApp.controller:NewreportCtrl
 * @description
 * # NewreportCtrl
 * Controller of the sharepointappApp
 */
/* global $:false */
/* jshint loopfunc:true */
/* jslint browser: true, plusplus: true */


angular.module('sharepointappApp').controller('ManageReportCtrl', 
	
	['$scope', '$location', 'ReportList', 'CommentList', '$routeParams', 'cfpLoadingBar',
	
	function ($scope, $location, ReportList, CommentList, $routeParams, cfpLoadingBar) {

		function init () {

			cfpLoadingBar.start();

			// Comments array
			$scope.comments = [];

			// View loading trigger to show to view
			$scope.isLoad = false;

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

			// All the input fields reference by section
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


			// Caret icon orientation when section collapse or open
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


			// Startup algorithm
			ReportList.findOne($routeParams.id, '$select=Id,useLastReport,HasReadNote,Created,IsInitialize,IsActive,Team,Period,Author/Id,Author/Title&$expand=Author').then(function (report) {
				$scope.report = report;
				ReportList.find('&$filter=(IsActive eq 0)&$orderby=Modified desc&$top=1&$select=Note,Id').then(function (reports) {
					if (reports.length > 0) {
						var lastReport = reports[0];
						$scope.lastNote = lastReport.Note;
						if (report.IsInitialize) {
							console.log('Is initialized');
							CommentList.find('$filter=(Report eq \'' + report.Id + '\')').then(function (comments) {
								for (var i=0, len=comments.length; i < len; i++) {
									$scope.comments.push(comments[i]);
								}
								cfpLoadingBar.complete();
								$scope.isLoad = true;
							});
						} else if (report.useLastReport) {
							console.log('User last report');
							CommentList.find('$filter=(Report eq \'' + lastReport.Id + '\')').then(function (comments) {
								if (comments.length > 0) {
									var inc = comments.length;
									for (var i=0, len=comments.length; i < len; i++) {
										CommentList.add({ Title: comments[i].Title, Section: comments[i].Section, ReportId: report.Id }).then(function (addedComment) {
											$scope.comments.push(addedComment);
											inc--;
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
							console.log('Plain report');
							ReportList.update(report.Id, { IsInitialize: true }).then(function () {
								cfpLoadingBar.complete();
								$scope.isLoad = true;
							});
						}
					} else {
						console.log('First plain report');
						ReportList.update(report.Id, { IsInitialize: true }).then(function () {
							cfpLoadingBar.complete();
							$scope.isLoad = true;
						});
					}
				});
			});
		}


		// initialization
		init();

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
				document.getElementById(section + 'Comment').focus();
				cfpLoadingBar.complete();				
			});
		};

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


		$scope.editComment = function (comment) {
			cfpLoadingBar.start();
			var buffer = comment;
			CommentList.remove(comment.Id).then(function () {
				$scope.comments.splice($scope.comments.indexOf(comment), 1);
				$scope.inputs[buffer.Section] = buffer.Title;
				document.getElementById(buffer.Section + 'Comment').focus();
				cfpLoadingBar.complete();				
			});
		};



		$scope.markNoteAsRead = function () {
			ReportList.update($scope.report.Id, { HasReadNote: true }).then(function () {
				$scope.report.HasReadNote = true;
			});
		};


		$scope.submitReport = function () {
			if (window.confirm('Etes-vous certain de vouloir soumettre le rapport? Ceci sera la version finale.')) {
				ReportList.update($scope.report.Id, { IsActive: false }).then(function () {
					$location.path('/end-report');
				});
			}
		};


}]);
