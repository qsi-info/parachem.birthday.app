'use strict';

/**
 * @ngdoc overview
 * @name sharepointappApp
 * @description
 * # sharepointappApp
 *
 * Main module of the application.
 */
angular
  .module('sharepointappApp', [
    'ngCookies',
    'ngResource',
    'ngRoute',
    // 'angular-loading-bar',
    'cfp.loadingBar'
  ])

  .config(function ($routeProvider) {
    $routeProvider

      // Home
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })


      .when('/new-report', {
        templateUrl: 'views/new-report.html',
        controller: 'NewReportCtrl',
      })

      .when('/manage-report/:id', {
        templateUrl: 'views/manage-report.html',
        controller: 'ManageReportCtrl',
      })


      .when('/end-report', {
        templateUrl: 'views/end-report.html'
      })

      // Default
      .otherwise({
        redirectTo: '/'
      });


  })

  .run(function ($location, SharePoint) {
    // Initialize the SharePoint librairy
    SharePoint.init($location.search().SPHostUrl, $location.search().SPAppWebUrl);
  })

  .factory('ReportList', ['SharePoint', function (SharePoint) {
    // Initialize the Report list as a factory
    return new SharePoint.API.List('Rapports de quart');
  }])

  .factory('CommentList', ['SharePoint', function (SharePoint) {
    // Initialize the Comment list as a factory
    return new SharePoint.API.List('Commentaires de rapport');
  }]);











