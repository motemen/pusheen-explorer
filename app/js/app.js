function PusheenCtrl ($scope, $http) {
    $http.get('data/entries.json').success(function (data) {
        $scope.entries = data;
    });
}
