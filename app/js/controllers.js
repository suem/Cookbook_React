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


cookbookControllers.controller('RecipeNew', ['$scope', 'recipes', '$location',
    function ($scope, recipes, $location) {
        $scope.recipe = {name: "", ingredients: []};
        $scope.units = [
            {value:'g',label:'Gramm'},
            {value:'ml',label:'Mililiter'},
            {value:'EL',label:'Essloffel'},
            {value:'Kl.',label:'Kaffeeloffel'},
            {value:'Stk.',label:'Stuck'},
            {value:'Prise',label:'Prise'},
            {value:'l',label:'Liter'},
            {value:'dl',label:'Deziliter'},
            {value:'kg',label:'Kilogramm'},
        ]

        recipes.findAll(function (data) {
            $scope.recipes = data;
            var ing = _.map(data,function(r){return _.map(r.ingredients,function(i){return i.name})});
            ing = _.flatten(ing)
            console.log(ing)
        });

        $scope.availableIngredients = function() {

        }

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
            var id = recipes.saveRecipe($scope.recipe);
            $location.path('/recipes/' + id);
        }
    }]);

