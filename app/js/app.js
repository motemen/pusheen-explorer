var app = angular.module('pusheenExplorer', []);

app.controller('MainCtrl', [ '$scope', '$http', '$timeout',
    function ($scope, $http, $timeout) {
        $http.get('data/entries.json').success(function (data) {
            $scope.entries = data;
            $scope.imageWidth = 200;
            $timeout(function () {
                new Masonry(document.querySelector('#photos'));
            });
        });

        $scope.$watch('query', function () {
            $timeout(function () {
                new Masonry(document.querySelector('#photos'));
            });
        });
    }
]);
