"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bootstrap_1 = require("./Src/bootstrap");
var express = require('express');
var app = express();
var port = process.env.PORT || 3001;
//bootstrap
(0, bootstrap_1.bootstrap)(app, express);
exports.default = app;
app.get('/', function (req, res) { return res.send('Hello World To My Smart Choice App'); });
app.listen(port, function () { return console.log("Example app listening on port ".concat(port, "!")); });
