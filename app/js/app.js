var app = angular.module('pusheenExplorer', []);

app.controller('MainCtrl', [ '$scope', '$http', '$timeout', '$filter',
    function ($scope, $http, $timeout, $filter) {
        function updateEntries () {
            var allEntries = $scope.allEntries,
                query = $scope.query;
            if (query) {
                $scope.entries = $filter('filter')(allEntries, { text: query })
            } else {
                $scope.entries = _.sample(allEntries, 50);
                // return $filter('limitTo')($scope.allEntries, 50)
            }

            $timeout(function () {
                new Masonry(document.querySelector('#photos'));
            });
        }

        $http.get('data/entries.json').success(function (data) {
            $scope.allEntries = data;
            $scope.imageWidth = 200;

            updateEntries();
        });

        $scope.$watch('query', function (query) {
            $scope.entries = updateEntries();

            updateEntries();
        });
    }
]);
