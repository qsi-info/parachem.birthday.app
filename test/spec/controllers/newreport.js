'use strict';

describe('Controller: NewreportCtrl', function () {

  // load the controller's module
  beforeEach(module('sharepointappApp'));

  var NewreportCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NewreportCtrl = $controller('NewreportCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
