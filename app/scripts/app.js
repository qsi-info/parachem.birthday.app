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
  ])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider

      // Home
      .when('/home', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })

      .when('/gateway', {
        template: '',
        controller: 'GatewayCtrl',
      })


      // Default
      .otherwise({
        redirectTo: '/gateway'
      });


  }])


  .run(['$location', '$rootScope', function ($location, $rootScope) {

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

    $rootScope.sp = {
      host: host,
      app: app, 
      sender: sender,
      isWebPart: isWebPart,
    };


  }]);



  // This factory is a HACK
  // It creates a fake item in a list to get the current user informations
  // It then destroy the item.
  // .factory('User', ['SharePoint', '$q', function (SharePoint, $q) {
  //   var dummyList = new SharePoint.API.List('CWPUserRequest');
  //   var user;

  //   return {
  //     get: function () {
  //       var deferred = $q.defer();
  //       if (typeof user !== 'undefined') {
  //         deferred.resolve(user);
  //       } else {
  //         dummyList.add({ Title: ''}).then(function (object) {
  //           dummyList.findOne(object.Id, '$select=Author/Id,Author/Title&$expand=Author').then(function (item) {
  //             user = item.Author;
  //             dummyList.remove(object.Id).then(function () {
  //               deferred.resolve(item.Author);
  //             });
  //           });
  //         });
  //       }
  //       return deferred.promise;
  //     }
  //   };

  // }]);











