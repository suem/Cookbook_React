'use strict';

var cookbook = angular.module('cookbook', [
    'ngRoute',
    'ui.bootstrap',
    'cookbook.recipes',
    'cookbook.controllers'
]);

cookbook.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/recipes', {
        templateUrl: 'partials/recipes.html',
        controller: 'RecipeList'
    });
    $routeProvider.when('/recipes/:recipeId', {
        templateUrl: 'partials/recipeDetail.html',
        controller: 'RecipeDetail'
    });
    $routeProvider.when('/editrecipe/:recipeId', {
        templateUrl: 'partials/newRecipe.html',
        controller: 'RecipeNew'
    });
    $routeProvider.when('/newrecipe', {
        templateUrl: 'partials/newRecipe.html',
        controller: 'RecipeNew'
    });
    $routeProvider.otherwise({redirectTo: '/recipes'});
}]);
