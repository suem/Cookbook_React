'use strict';

/* Controllers */

var cookbookControllers = angular.module('cookbook.controllers', []);
cookbookControllers.controller('RecipeList', ['$scope', '$location', 'recipes',
    function ($scope, $location, recipes) {
        recipes.findAll(function (data) {
            $scope.recipes = data;
        });
        $scope.viewRecipe = function (r) {
            $location.path('/recipes/' + r.id);
        }
    }]);

cookbookControllers.controller('RecipeDetail', ['$scope', '$routeParams', 'recipes',
    function ($scope, $routeParams, recipes) {
        $scope.recipeId = $routeParams.recipeId;
        recipes.find($scope.recipeId, function (r) {
            $scope.recipe = r;
        });
    }]);


cookbookControllers.controller('RecipeNew', ['$scope', 'recipes', '$routeParams', '$location',
    function ($scope, recipes, $routeParams, $location) {
        $scope.recipeId = $routeParams.recipeId;
        if($scope.recipeId) {
            recipes.find($scope.recipeId, function (r) {
                $scope.recipe = JSON.parse(JSON.stringify(r)); //clone object s.t. original is not changed
            });
        } else {
            $scope.recipe = {name: "", ingredients: []};
        }

        //collect all possible ingredients and units
        recipes.findAll(function (data) {
            $scope.recipes = data;
            var ingredients = {};
            var units = {};
            _.each(data,function(r) {
                _.each(r.ingredients,function(i){
                  ingredients[i.name] = true;
                  units[i.unit] = true;
                });
            });
            $scope.availableIngredients = Object.keys(ingredients);
            $scope.availableUnits = Object.keys(units);
        });

        $scope.newIngredient = {name: null, amount: null, unit: null};
        $scope.addIngredient = function () {
            $scope.recipe.ingredients.push($scope.newIngredient);
            $scope.newIngredient = {name: null, amount: null, unit: null};
            $("#ingredient-name").focus();
        }
        $scope.removeIngredient = function (ing) {
            var i = $scope.recipe.ingredients.indexOf(ing);
            if (i != -1) {
                $scope.recipe.ingredients.splice(i, 1);
            }
        }
        $scope.saveRecipe = function () {
            var id = recipes.saveRecipe($scope.recipe,function(err,saved_recipe){
                $location.path('/recipes/' + saved_recipe.id);
            });
        }
    }]);

