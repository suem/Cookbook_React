'use strict';

var recipeService = angular.module('cookbook.recipes', []);
recipeService.factory('recipes', ['$http', '$q', function ($http,$q) {

    function getNewId(title) {
        var fixed_title = title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        var rand_id = Math.random().toString(36).substring(10);
        return fixed_title + '_' + rand_id;
    }


    var data = null;
    var getData = function (callback) {
        if (data) {
            //data already loaded
            callback(data);
        } else {
            $http.get('/data').success(function (d) {
                //try to get from server
                data = d;
                localStorage['recipeData'] = JSON.stringify(data);
                callback(data);
            }).error(function () {
                //try to get from local storage
                var storageValue = localStorage['recipeData'];
                if (storageValue) {
                    data = JSON.toJSON(storageValue);
                }
            });
        }
    };

    var ingredients = null;
    var units = null;
    var clearDataValues = function () {
        ingredients = null;
        units = null;
    }
    var collectDataValues = function (callback) {
        getData(function (data) {
            ingredients = _.chain(data)
                .map(function(v){return v.ingredients})
                .flatten()
                .groupBy(function(v){return v.name})
                .map(function(v,k){
                    var sortedUnitsDesc = _.chain(v)
                        .map(function(v){return v.unit})
                        .groupBy(_.identity)
                        .map(function(v,k) { return {name : k, weight : v ? v.length : 1}; })
                        .sortBy(function(o){return o.weight})
                        .map(function(o){return o.name})
                        .reverse()._wrapped;
                    return {name:k, unit: sortedUnitsDesc[0]};
                })._wrapped;

            units = _.chain(data)
                .map(function(v){return v.ingredients})
                .flatten()
                .map(function(v){return v.unit})
                .groupBy(_.identity)
                .keys()._wrapped;
//            ingredients = [];
//            units = [];
            callback();
        });
    }

    var recipes = {};
    recipes.saveRecipe = function (r, callback) {
        if (!r.id) {
            //new recipe
            var id = getNewId(r.name);
            r.id = id;
            data[id] = r;
            $http.post('/store', r).success(function () {
                console.log('sent new recipe ' + r.id);
            });
        } else {
            data[r.id] = r;
            $http.post('/store', r).success(function () {
                console.log('sent updated recipe ' + r.id);
            });
        }
        clearDataValues();
        callback(null, r);
    }

    recipes.removeRecipe = function (r, callback) {
        $http.post('/remove', r).success(function () {
            console.log('deleted ' + r.id);
            callback(null);
        });
        clearDataValues();
        delete data[r.id];
    }

    recipes.findAll = function (callback) {
        getData(callback)
    };

    recipes.findAllQ = function () {
        var d = $q.defer();
        getData(function(data){
            d.resolve(data);
        });
        return d.promise;
    };

    recipes.getIngredients = function (callback) {
        if (ingredients) callback(ingredients);
        else {
            collectDataValues(function () {
                callback(ingredients);
            });
        }
    };

    recipes.getUnits = function (callback) {
        if (units) callback(units);
        else {
            collectDataValues(function () {
                callback(units);
            });
        }
    };

    recipes.find = function (id, callback) {
        if (data) {
            callback(data[id]);
        } else {
            getData(function (data) {
                callback(data[id]);
            });
        }
    }

    return recipes;
}]);