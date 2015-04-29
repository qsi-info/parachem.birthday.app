'use strict';

/**
 * @ngdoc overview
 * @name AngularSharePointApp
 * @description
 * # AngularSharePointApp
 *
 * Main module of the application.
 */

 /*jshint unused:false*/
 /*jshint asi:true*/
 /*global moment:true*/



angular.module('AngularSharePointApp', ['ngSharePoint', 'ngRoute'])


.config(['$routeProvider', function ($routeProvider) {

	$routeProvider.when('/', {
		controller: 'MainController',
		templateUrl: 'views/main.html',
	})

}])


.factory('Anniversaires', ['SharePoint', function (SharePoint) {

	return new SharePoint.API.List('Anniversaires');

}])


.controller('MainController', ['Anniversaires', '$scope', '$rootScope', function (Anniversaires, $scope, $rootScope) {

	Anniversaires.all('$select=Anniversaire,Personne/Title,Personne/Id&$expand=Personne').then(function (acc) {
		show_birthdays(acc);
	});

	var today = moment();
	$scope.people = [];
	$scope.myBirthday = false

	var show_birthdays = function (birthdays) {
		birthdays.forEach(function (birthday) {
			if (moment(birthday.Anniversaire).isSame(today, 'day')) {
				$scope.people.push(birthday.Personne);
			}
		});

		for (var i = 0; i < $scope.people.length; i++) {
			if ($rootScope.me.get_id() === $scope.people[i].Id) {
				$scope.myBirthday = true;
			}
		}
	};

}]);











