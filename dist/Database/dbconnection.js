"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbconnection = dbconnection;
const mongoose_1 = __importDefault(require("mongoose"));
async function dbconnection() {
    await mongoose_1.default.connect(process.env.DATABASE_DB).then(() => {
        console.log('db connected successfully');
    }).catch(() => {
        console.log('failed to connected to db');
    });
}
