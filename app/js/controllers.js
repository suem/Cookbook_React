'use strict';

/* Controllers */

var cookbookControllers = angular.module('cookbook.controllers', []);
cookbookControllers.controller('RecipeList', ['$scope', '$location', 'recipes',
    function ($scope, $location, recipes) {
        recipes.findAll(function (data) {
            $scope.recipes = data;
            $scope.recipeList = _.values(data);
        });

//        $scope.recipes = recipes.findAllQ();

        $scope.viewRecipe = function (r) {
            $scope.searchInput = null;
            $location.path('/recipes/' + r.id);
        }
        $scope.searchInput = null;
    }]);

cookbookControllers.controller('RecipeDetail', ['$scope', '$routeParams', 'recipes', '$location',
    function ($scope, $routeParams, recipes, $location) {
        $scope.recipeId = $routeParams.recipeId;
        recipes.find($scope.recipeId, function (r) {
            $scope.recipe = r;
        });

        $scope.removeRecipe = function () {
            recipes.removeRecipe($scope.recipe, function (err) {
                $location.path('/');
            });
        };
    }]);


cookbookControllers.controller('RecipeNew', ['$scope', 'recipes', '$routeParams', '$location',
    function ($scope, recipes, $routeParams, $location) {
        //find or create new recipe
        $scope.recipeId = $routeParams.recipeId;
        if ($scope.recipeId) {
            recipes.find($scope.recipeId, function (r) {
                $scope.recipe = JSON.parse(JSON.stringify(r)); //clone object s.t. original is not changed
                $scope.recipe.ingredients.push({name: null, amount: null, unit: null});
            });
        } else {
            $scope.recipe = {name: "", ingredients: [ {name: null, amount: null, unit: null} ]};
        }

        recipes.getIngredients(function(ingredients) {
            $scope.availableIngredients = ingredients;
        });

        recipes.getUnits(function(units) {
            $scope.availableUnits = units;
        });

        $scope.setUnit = function(ingredient,unit) {
            ingredient.unit = unit;
        }

        $scope.lastFocus = false;
        $scope.setLastFocus = function(val) {
            $scope.lastFocus = val;
        }
        $scope.addIngredient = function () {
            $scope.recipe.ingredients.push({name: null, amount: null, unit: null});
            $scope.lastFocus = false;
            setTimeout(function(){
                $('.ing-name').last().focus();
            });
        };
        $scope.addIngredientOnFocus = function () {
            if($scope.lastFocus) $scope.addIngredient();
        };

        $scope.removeIngredient = function (ing) {
            var i = $scope.recipe.ingredients.indexOf(ing);
            if (i != -1) {
                $scope.recipe.ingredients.splice(i, 1);
            }
        };

        $scope.saveRecipe = function () {
            //don't add last ingredient if undefined
            var lastIngredient = $scope.recipe.ingredients.slice(-1)[0];
            if(lastIngredient.name == null || lastIngredient.name == '') $scope.recipe.ingredients.pop();
            var id = recipes.saveRecipe($scope.recipe, function (err, saved_recipe) {
                $location.path('/recipes/' + saved_recipe.id);
            });
        }
    }]);


