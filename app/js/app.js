var app = angular.module('pusheenExplorer', []);

app.config([ '$locationProvider',
    function ($locationProvider) {
        $locationProvider.html5Mode(true);
    }
]);

app.controller('MainCtrl', [ '$scope', '$http', '$timeout', '$filter', '$location',
    function ($scope, $http, $timeout, $filter, $location) {
        function updateEntries () {
            var allEntries = $scope.allEntries,
                query      = $scope.query;
            if (query) {
                $scope.entries = $filter('filter')(allEntries, { text: query })
            } else {
                $scope.entries = _.sample(allEntries, 50);
            }

            $timeout(function () {
                new Masonry(document.querySelector('#photos'));
            });
        }

        $scope.imageWidth = 200;

        $http.get('data/entries.json').success(function (data) {
            $scope.allEntries = data;
        });

        $scope.$watch('allEntries', updateEntries);
        $scope.$watch('query',      updateEntries);

        // $scope.query <-> ?q={query}
        $scope.query = $location.search().q;

        $scope.$watch(
            function () {
                return $location.search().q;
            },
            function (q) {
                $scope.query = q;
            }
        );

        $scope.$watch('query', function (query) {
            if (query) {
                $location.search({ q: query });
            } else {
                $location.search('');
            }
        });
    }
]);
