var app = angular.module("myApp", ['ngRoute']);

app.config(function($routeProvider) {
    $routeProvider
     .when("/movie", {
        templateUrl : 'movie.html'
     })
     .otherwise({
         templateUrl : 'default.html'
     });
});

app.controller("defaultController", function ($scope, $http, $location) {
     $scope.searchbox = '';
     $scope.Movies = [];
     $scope.recentSearch = (localStorage.getItem('recentSearch') && localStorage.getItem('recentSearch').split(',')) || [];
     
     $scope.showRecent = function () {
        if ($scope.recentSearch.length > 5) {
           $scope.recentSearchToShow = $scope.recentSearch.slice(-5);
        } else {
            $scope.recentSearchToShow = $scope.recentSearch;
        }
     };
     $scope.showRecent();

     $scope.searchMovie  = function () {
         if ($scope.searchbox) {
            localStorage.setItem('searchTitle', $scope.searchbox);
            $location.path('/movie');
         } else {
             alert('please enter movie name');
         }
         
     };

     $scope.recentClick = function ($event, text) {
         $event.preventDefault();
         $scope.searchbox = text;
         $scope.searchMovie();
     }
});

app.controller('movieController', function ($scope, $http, $location) {
    $scope.recentSearch = (localStorage.getItem('recentSearch') && localStorage.getItem('recentSearch').split(',')) || [];
    $scope.searchTitle = localStorage.getItem('searchTitle');
    
    var url = 'http://www.omdbapi.com/?s=' +  $scope.searchTitle + '&apikey=d578f6ac';
    $http.get(url).then(onSuccess, onError);

     function onSuccess(result) {
        console.log('data : ', result);
        if (result.data && !result.data.Error) {
            $scope.Movies = result.data.Search;
            $scope.recentSearch.push($scope.searchTitle);
            localStorage.setItem('recentSearch', $scope.recentSearch);
        } else {
            alert('No Movie found!!');
            $location.path('/');
        }
     }

     function onError(error) {
        console.log('error : ', error );
     }
});



