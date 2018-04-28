var express = require('express');
var app = express();

var ObjectModel = require('../model/ObjectModel.js')
var Storage = require('../storage/MemoryStorage.js')

var ObjectController = require('../controller/ObjectController.js');
var PrinterController = require('../controller/PrinterController.js');

app.use('/objects', ObjectController);
app.use('/prints', PrinterController);

module.exports = app;