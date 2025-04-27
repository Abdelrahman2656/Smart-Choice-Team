"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
async function dbconnection() {
    await (0, mongoose_1.connect)(process.env.DATABASE_DB).then(() => {
        console.log('db connected successfully');
    }).catch((error) => {
        console.log('Failed to connect to DB', error);
    });
}
exports.default = dbconnection;
