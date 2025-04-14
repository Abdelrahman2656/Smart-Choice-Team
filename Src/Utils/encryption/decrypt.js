"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Decrypt = void 0;
var crypto_js_1 = require("crypto-js");
var Decrypt = function (_a) {
    var key = _a.key, _b = _a.secretKey, secretKey = _b === void 0 ? process.env.SECRET_CRYPTO : _b;
    return crypto_js_1.default.AES.decrypt(key, secretKey).toString(crypto_js_1.default.enc.Utf8);
};
exports.Decrypt = Decrypt;
