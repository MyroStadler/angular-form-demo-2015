var app = angular.module('app', ['ngAnimate']);
app.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
  }]);

app.factory('RequestFactory', ['$http', function ($http) {
    var send = function (request) {
      return $http.post('/submit', {
        request: {
          code: request.code,
          email: request.email
        }
      });
    };
    return {
      send: send
    };
  }]);

//Main Controller [MainCtrl]
(function (ng, app) {
  function Controller($scope, RequestFactory) {
    $scope.success = false;
    $scope.loading = false;
    $scope.error = '';
    $scope.formChanged = false;
    $scope.request = {
      code: '',
      email: ''
    };
    $scope.submit = function (request) {
      $scope.success = false;
      if ($scope.mainForm.$valid) {
          //console.log('VALID!');
        $scope.loading = true;
        $scope.error = '';
        var req = RequestFactory.send($scope.request);
        req.success(function (data) {
//          console.log('SUCCESS!', data);
          $scope.request = {};
          $scope.success = true;
        });
        req.error(function (data) {
//          console.log('ERROR!', data);
          $scope.error = data.error || 'There was a problem resending your receipt';
        });
        req.finally(function () {
          $scope.formChanged = false;
          $scope.loading = false;
        });
      }else{
          //console.log('NOT VALID!');
      }
    };
  }
  Controller.$inject = ['$scope', 'RequestFactory'];
  app.controller("MainCtrl", Controller);
})(angular, app);
