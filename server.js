'use strict';

var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
//var TopCube = require('topcube');
var database = require('./database.js');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'app')));

app.get('/', function (req, res) {
    res.send('Hello World');
});

app.get('/data', function (req, res) {
    database.getData(function(err,data){
        res.send(data);
    });
});

app.post('/store', function (request, response) {
    var newRecipe = request.body;
    database.storeRecipe(newRecipe);
    response.send({status:"oke"})
});

app.post('/remove', function (request, response) {
    var recipe = request.body;
    database.removeRecipe(recipe);
    response.send({status:"oke"})
});

app.listen(8080, function () {
    console.log("Listening on port 8080...");
});

//TopCube({
//  url: 'http://localhost:8080',
//  name: 'My webapp',
//  width: 800,
//  height: 600
//});
