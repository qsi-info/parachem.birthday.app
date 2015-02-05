'use strict';

/**
 * @ngdoc overview
 * @name sharepointappApp
 * @description
 * # sharepointappApp
 *
 * Main module of the application.
 */


function parseQueryString() {
  var query = (window.location.search || '?').substr(1);
  var map = {};
  query.replace(/([^&=]+)=?([^&]*)(?:&+|$)/g, function (match, key, value) {
    (map[key] = map[key] || []).push(window.decodeURIComponent(value));
  });
  return map;
}



angular
  .module('sharepointappApp', [
    'ngCookies',
    'ngResource',
    'ngRoute',
    'cfp.loadingBar',
    'sticky'
  ])

  .config(['$routeProvider', function ($routeProvider) {
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


  }])

  .run(['SharePoint', '$location', function (SharePoint, $location) {

    var host, app, params, sender, isWebPart = true;

    try {
      params = parseQueryString();
      host = params.SPHostUrl[0];
      app = params.SPAppWebUrl[0];
      sender = params.SenderId[0];
    } catch(e) {
      params = $location.search();
      host = params.SPHostUrl;
      app = params.SPAppWebUrl;
      sender = params.SenderId;
      isWebPart = false;
    }


    SharePoint.init(host, app, sender);
    if (isWebPart) {
      SharePoint.resizeCWP();
    }

  }])

  .factory('ReportList', ['SharePoint', function (SharePoint) {
    // Initialize the Report list as a factory
    return new SharePoint.API.List('Rapports de quart');
  }])

  .factory('CommentList', ['SharePoint', function (SharePoint) {
    // Initialize the Comment list as a factory
    return new SharePoint.API.List('Commentaires de rapport');
  }]);











