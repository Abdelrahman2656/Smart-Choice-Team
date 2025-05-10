"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const mongoose_1 = require("mongoose");
async function dbconnection() {
    await (0, mongoose_1.connect)(process.env.DATABASE_DB).then(() => {
        console.log(chalk_1.default.yellow('connected to db Successfully'));
    }).catch(() => {
        console.log(chalk_1.default.red('failed to connected to db'));
    });
}
exports.default = dbconnection;
