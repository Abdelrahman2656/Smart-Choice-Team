"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_controller_1 = __importDefault(require("./Src/app.controller"));
const express = require('express');
const port = process.env.PORT || 3001;
const app = express();
(0, app_controller_1.default)(app, express);
app.get('/', (req, res) => res.send('Hello World In My Smart Choice App'));
exports.default = app; // ✅ خلي بالك: ده أهم حاجة
