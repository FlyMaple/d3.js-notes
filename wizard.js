var $application = angular.module('application', []);

$application.controller('quickStartCtrl', ['$scope', function ($scope) {
    
    //  =================================
    window.$scope = typeof($scope) === 'undefined' ? {} : $scope;
    window.$rootScope = typeof($rootScope) === 'undefined' ? {} : $rootScope;
    window.managementAPI = typeof(managementAPI) === 'undefined' ? {} : managementAPI;
    window.gatewayAPI = typeof(gatewayAPI) === 'undefined' ? {} : gatewayAPI;
    window.switchAPI = typeof(switchAPI) === 'undefined' ? {} : switchAPI;
    window.accesspointAPI = typeof(accesspointAPI) === 'undefined' ? {} : accesspointAPI;
    window.$modal = typeof($modal) === 'undefined' ? {} : $modal;
    window.$filter = typeof($filter) === 'undefined' ? {} : $filter;
    window.authAPI = typeof(authAPI) === 'undefined' ? {} : authAPI;
    window.$text = typeof($text) === 'undefined' ? {} : $text;
    window.$q = typeof($q) === 'undefined' ? {} : $q;
    //  =================================
    // $scope.stepFlow = false;
    // $scope.step = 4;
    // $scope.isSummary = true;

    $scope.welcome = true;
    $scope.stepFlow = false;
    $scope.isSummary = false;
}]);