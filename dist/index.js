"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_controller_1 = __importDefault(require("./Src/app.controller"));
const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
//hello
//bootstrap
(0, app_controller_1.default)(app, express);
exports.default = app;
app.get('/', (req, res) => res.send('Hello World In My Smart Choice App'));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
