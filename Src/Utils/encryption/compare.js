"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = void 0;
var bcrypt_1 = require("bcrypt");
var comparePassword = function (_a) {
    var password = _a.password, hashPassword = _a.hashPassword;
    return bcrypt_1.default.compareSync(password, hashPassword);
};
exports.comparePassword = comparePassword;
