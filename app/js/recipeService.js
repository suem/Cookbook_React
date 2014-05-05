'use strict';

var recipeService = angular.module('cookbook.recipes', []);
recipeService.factory('recipes', ['$http',function ($http) {

    function getNewId(title) {
        var fixed_title = title.replace(/[^a-zA-Z0-9]/g,'_').toLowerCase();
        var rand_id = Math.random().toString(36).substring(10);
        return fixed_title+'_'+rand_id;
    }

    var data = null;
    var getData = function(callback) {
        if(data) {
            //data already loaded
            callback(data);
        } else {
            $http.get('/data').success(function(d) {
                //try to get from server
                data = d;
                localStorage['recipeData'] = JSON.stringify(data);
                callback(data);
            }).error(function(){
                //try to get from local storage
                var storageValue = localStorage['recipeData'];
                if(storageValue) {
                    data = JSON.toJSON(storageValue);
                }
            });
        }
    };

    var recipes = {};
    recipes.saveRecipe = function(r,callback) {
        if(!r.id) {
            //new recipe
            var id  = getNewId(r.name);
            console.log('New Recipe: '+id);
            r.id = id;
            data[id] = r;
            $http.post('/store', r).success(function(){
                console.log('sent new recipe');
            });
        } else {
            console.log('update recipe: '+ r.id)
            data[r.id] = r;
            $http.post('/store', r).success(function(){
                console.log('sent new recipe');
            });
        }
        callback(null,r);
    }

    recipes.findAll = function (callback) {
        getData(callback)
    };

    recipes.find = function(id, callback) {
        if(data) {
            callback(data[id]);
        } else {
            getData(function(data) {
                callback(data[id]);
            });
        }
    }

    return recipes;
}]);