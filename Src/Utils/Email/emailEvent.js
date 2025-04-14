"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.secondOTPForgetPassword = exports.sendOTPForgetPassword = exports.generateAndSecondSendOTP = exports.generateAndSendOTP = void 0;
var Database_1 = require("../../../Database");
var encryption_1 = require("../encryption");
var email_1 = require("./email");
var emailHtml_1 = require("./emailHtml");
var otp_1 = require("../otp");
// Separate event listener (should be declared once in your setup)
var generateAndSendOTP = function (email, firstName, lastName) { return __awaiter(void 0, void 0, void 0, function () {
    var otp, hash, expiredDateOtp;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                otp = String((0, otp_1.generateOTP)());
                return [4 /*yield*/, (0, encryption_1.Hash)({ key: otp, SALT_ROUNDS: process.env.SALT_ROUNDS })];
            case 1:
                hash = _a.sent();
                expiredDateOtp = new Date(Date.now() + 5 * 60 * 1000);
                return [4 /*yield*/, Database_1.User.updateOne({ email: email }, { otpEmail: hash, expiredDateOtp: expiredDateOtp })];
            case 2:
                _a.sent();
                // Send email after updating the database
                return [4 /*yield*/, (0, email_1.sendEmail)({
                        to: email,
                        subject: "Please Verify",
                        html: (0, emailHtml_1.emailHtml)(otp, "".concat(firstName, " ").concat(lastName)),
                    })];
            case 3:
                // Send email after updating the database
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.generateAndSendOTP = generateAndSendOTP;
//second OTP to Confirm email 
var generateAndSecondSendOTP = function (email, firstName, lastName) { return __awaiter(void 0, void 0, void 0, function () {
    var otp, hash, expiredDateOtp;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                otp = String((0, otp_1.generateOTP)());
                return [4 /*yield*/, (0, encryption_1.Hash)({ key: otp, SALT_ROUNDS: process.env.SALT_ROUNDS })];
            case 1:
                hash = _a.sent();
                expiredDateOtp = new Date(Date.now() + 5 * 60 * 1000);
                return [4 /*yield*/, Database_1.User.updateOne({ email: email }, { otpEmail: hash, expiredDateOtp: expiredDateOtp })];
            case 2:
                _a.sent();
                // Send email after updating the database
                return [4 /*yield*/, (0, email_1.sendEmail)({
                        to: email,
                        subject: "Please Resend Verify",
                        html: (0, emailHtml_1.emailHtml)(otp, "".concat(firstName, " ").concat(lastName)),
                    })];
            case 3:
                // Send email after updating the database
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.generateAndSecondSendOTP = generateAndSecondSendOTP;
//forget password
var sendOTPForgetPassword = function (email, firstName, lastName, otpEmail) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: 
            // Send email after updating the database
            return [4 /*yield*/, (0, email_1.sendEmail)({
                    to: email,
                    subject: "Forget Password",
                    html: (0, emailHtml_1.emailHtml)(otpEmail, "".concat(firstName, " ").concat(lastName)),
                })];
            case 1:
                // Send email after updating the database
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.sendOTPForgetPassword = sendOTPForgetPassword;
//resend forget password
var secondOTPForgetPassword = function (email, firstName, lastName, otpEmail) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: 
            // Send email after updating the database
            return [4 /*yield*/, (0, email_1.sendEmail)({
                    to: email,
                    subject: "Resend Forget Password",
                    html: (0, emailHtml_1.emailHtml)(otpEmail, "".concat(firstName, " ").concat(lastName)),
                })];
            case 1:
                // Send email after updating the database
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.secondOTPForgetPassword = secondOTPForgetPassword;
