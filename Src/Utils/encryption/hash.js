"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hash = void 0;
var bcrypt_1 = require("bcrypt");
var Hash = function (_a) {
    var key = _a.key, _b = _a.SALT_ROUNDS, SALT_ROUNDS = _b === void 0 ? process.env.SALT_ROUNDS : _b;
    return bcrypt_1.default.hashSync(key, Number(SALT_ROUNDS));
};
exports.Hash = Hash;
