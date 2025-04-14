"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
var generateToken = function (_a) {
    var payload = _a.payload, _b = _a.secretKey, secretKey = _b === void 0 ? process.env.SECRET_TOKEN : _b, options = _a.options;
    return jsonwebtoken_1.default.sign(payload, secretKey, options);
};
exports.generateToken = generateToken;
var verifyToken = function (_a) {
    var token = _a.token, _b = _a.secretKey, secretKey = _b === void 0 ? process.env.SECRET_TOKEN : _b;
    try {
        if (!token) {
            console.error("❌ Token is missing");
            return null;
        }
        var decoded = jsonwebtoken_1.default.verify(token, secretKey);
        console.log("✅ Decoded Token:", decoded);
        if (!decoded || (!("_id" in decoded) && !("id" in decoded))) {
            console.error("❌ Token missing 'id' or '_id' field");
            return null;
        }
        // Ensure consistency: Always use "_id"
        decoded._id = decoded._id || decoded.id;
        delete decoded.id;
        return decoded;
    }
    catch (error) {
        console.error("❌ Token Verification Error:", error);
        return null;
    }
};
exports.verifyToken = verifyToken;
