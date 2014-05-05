'use strict'

var fs = require('fs');
var async = require('async')

var idPattern = /^[0-9a-zA-Z_]*\.json$/;
var dataDirectory = 'data';
var data;

var validId = function(id) {
    return idPattern.test(id);
}

exports.getData = function(callback) {
    fs.readdir(dataDirectory,function(err,files) {
        var filteredFiles = files.filter(validId);
        var readFromFiles = filteredFiles.map(function(file){
            return function(callback) {
                fs.readFile(dataDirectory+'/'+file, 'utf8', function(err,content){
                    var fileObject;
                    var recipe;
                    if(!err) recipe = JSON.parse(content);
                    callback(err,recipe);
                });
            }
        });
        async.parallel(readFromFiles, function(err,res){
            if(!err) {
                data = {};
                res.forEach(function(recipe){
                    data[recipe.id] = recipe;
                })
            }
            callback(err,data);
        });
    });

};

exports.storeRecipe = function(recipe) {
    var fileName = recipe.id + ".json";
    if(idPattern.test(fileName)) {
        fs.writeFile(dataDirectory+'/'+fileName,JSON.stringify(recipe),'utf8',function(err){
            if(!err){
                console.log('stored new recipe: '+fileName);
            }
        });
    } else {
        console.error('invalid filename: '+fileName);
    }
};
