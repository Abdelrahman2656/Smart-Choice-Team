"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.generalFields = void 0;
var joi_1 = require("joi");
var enum_1 = require("../constant/enum");
exports.generalFields = {
    firstName: joi_1.default.string().max(15).min(3),
    lastName: joi_1.default.string().max(15).min(3),
    email: joi_1.default.string().email(),
    password: joi_1.default.string().pattern(new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)),
    cPassword: joi_1.default.string().valid(joi_1.default.ref('password')),
    role: (_a = joi_1.default.string()).valid.apply(_a, Object.values(enum_1.roles)),
    otpEmail: joi_1.default.string(),
    DOB: joi_1.default.string(),
    objectId: joi_1.default.string().hex().length(24),
    refreshToken: joi_1.default.string(),
    idToken: joi_1.default.string(),
    phone: joi_1.default.string().pattern(new RegExp(/^(00201|\+201|01)[0-2,5]{1}[0-9]{8}$/)),
};
