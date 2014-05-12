'use strict'

var fs = require('fs');
var async = require('async')
var moment = require('moment')

var idPattern = /^[0-9a-zA-Z_]*\.json$/;
var dataDirectory = 'data';
var archiveDirectory = dataDirectory + '/archive';
var data;

var validId = function (id) {
    return idPattern.test(id);
}

exports.getData = function (callback) {
    fs.readdir(dataDirectory, function (err, files) {
        var filteredFiles = files.filter(validId);
        var readFromFiles = filteredFiles.map(function (file) {
            return function (callback) {
                fs.readFile(dataDirectory + '/' + file, 'utf8', function (err, content) {
                    var fileObject;
                    var recipe;
                    if (!err) recipe = JSON.parse(content);
                    callback(err, recipe);
                });
            }
        });
        async.parallel(readFromFiles, function (err, res) {
            if (!err) {
                data = {};
                res.forEach(function (recipe) {
                    data[recipe.id] = recipe;
                })
            }
            callback(err, data);
        });
    });

};

exports.storeRecipe = function (recipe) {
    var fileName = recipe.id + ".json";
    var fileURI = dataDirectory + '/' + recipe.id + ".json";
    var timestamp = moment().format('YYYY-MM-DD_hh-mm-ss');
    var fileArchiveURI = archiveDirectory + '/' + recipe.id + ".json_" + timestamp;
    if (idPattern.test(fileName)) {
        var storeFunction = function () {
            fs.writeFile(fileURI, JSON.stringify(recipe,null,4), function (err) {
                if (err) console.error('failed to store new recipe: ' + fileName);
                else console.log('stored recipe: ' + fileName);
            });
        }
        var exists = fs.exists(fileURI,function(exists){
           if(exists) {
               fs.rename(fileURI, fileArchiveURI, function (err) {
                  if(err)  console.error('failed to archive '+recipe.id);
                  else {
                      console.log('archived '+recipe.id);
                      storeFunction();
                  }
               });
           } else storeFunction();
        });

    } else {
        console.error('invalid filename: ' + fileName);
    }
};

exports.removeRecipe = function (recipe) {
    var fileURI = dataDirectory + '/' + recipe.id + ".json";
    var targetURI = archiveDirectory + '/' + recipe.id + ".json.DELETED";
    fs.rename(fileURI, targetURI, function (err) {
        if (err) console.error('failed to delete' + recipe.id);
        else console.log('deleted ' + recipe.id);
    })
}
