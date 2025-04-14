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
exports.changePassword = exports.forgetPassword = exports.refreshToken = exports.activateAccount = exports.loginWithGoogle = exports.login = exports.ConfirmEmail = exports.signUp = void 0;
var Database_1 = require("../../../Database");
var AppError_1 = require("../../Utils/AppError/AppError");
var messages_1 = require("../../Utils/constant/messages");
var emailEvent_1 = require("../../Utils/Email/emailEvent");
var encryption_1 = require("../../Utils/encryption");
var token_1 = require("../../Utils/Token/token");
var otp_1 = require("../../Utils/otp");
var verifyGoogle_1 = require("../../Utils/verifyGoogle/verifyGoogle");
var enum_1 = require("../../Utils/constant/enum");
//---------------------------------------------------Sign Up --------------------------------------------------------------
var signUp = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, firstName, phone, lastName, email, password, role, userExist, cipherText, user, userCreated;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.body, firstName = _a.firstName, phone = _a.phone, lastName = _a.lastName, email = _a.email, password = _a.password, role = _a.role;
                return [4 /*yield*/, Database_1.User.findOne({ email: email })];
            case 1:
                userExist = _c.sent();
                if (!userExist) return [3 /*break*/, 3];
                if (userExist.isConfirmed) {
                    return [2 /*return*/, next(new AppError_1.AppError(messages_1.messages.user.alreadyExist, 400))]; // Prevent duplicate accounts
                }
                if (userExist.provider == enum_1.providers.GOOGLE) {
                    return [2 /*return*/, next(new AppError_1.AppError('User Already Login With Google', 400))];
                }
                if ((userExist === null || userExist === void 0 ? void 0 : userExist.otpEmail) && ((_b = userExist === null || userExist === void 0 ? void 0 : userExist.expiredDateOtp) === null || _b === void 0 ? void 0 : _b.getTime()) > Date.now()) {
                    return [2 /*return*/, next(new AppError_1.AppError(messages_1.messages.user.AlreadyHasOtp, 400))];
                }
                if (!(!(userExist === null || userExist === void 0 ? void 0 : userExist.expiredDateOtp) || userExist.expiredDateOtp.getTime() < Date.now())) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, emailEvent_1.generateAndSecondSendOTP)(email, firstName, lastName)];
            case 2:
                _c.sent(); // Ensure OTP is sent
                return [2 /*return*/, res.status(200).json({
                        message: "OTP expired. A new OTP has been sent.",
                        success: false,
                    })];
            case 3:
                cipherText = (0, encryption_1.Encrypt)({ key: phone, secretKey: process.env.SECRET_CRYPTO });
                user = new Database_1.User({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    phone: cipherText || undefined,
                    password: password,
                    role: role,
                });
                return [4 /*yield*/, user.save()];
            case 4:
                userCreated = _c.sent();
                if (!userCreated) {
                    return [2 /*return*/, next(new AppError_1.AppError(messages_1.messages.user.failToCreate, 500))];
                }
                return [4 /*yield*/, (0, emailEvent_1.generateAndSendOTP)(email, firstName, lastName)
                    // response
                ];
            case 5:
                _c.sent();
                // response
                return [2 /*return*/, res.status(201).json({
                        message: messages_1.messages.user.createdSuccessfully,
                        success: true,
                        UserData: userCreated,
                    })];
        }
    });
}); };
exports.signUp = signUp;
//---------------------------------------------------Confirm Email --------------------------------------------------------------
var ConfirmEmail = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, code, email, userExist, match;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, code = _a.code, email = _a.email;
                return [4 /*yield*/, Database_1.User.findOne({ email: email })];
            case 1:
                userExist = _b.sent();
                if (!userExist) {
                    return [2 /*return*/, next(new AppError_1.AppError(messages_1.messages.user.notFound, 404))];
                }
                if (userExist.isConfirmed == true) {
                    return [2 /*return*/, next(new AppError_1.AppError(messages_1.messages.user.AlreadyVerified, 401))];
                }
                if (!userExist.otpEmail) {
                    return [2 /*return*/, next(new AppError_1.AppError("OTP Not Found", 400))];
                }
                match = (0, encryption_1.comparePassword)({
                    password: String(code),
                    hashPassword: userExist.otpEmail.toString(),
                });
                if (!match) {
                    return [2 /*return*/, next(new AppError_1.AppError(messages_1.messages.user.invalidOTP, 400))];
                }
                //update user
                return [4 /*yield*/, Database_1.User.updateOne({ email: email }, { isConfirmed: true, $unset: { otpEmail: "", expiredDateOtp: "" } })];
            case 2:
                //update user
                _b.sent();
                return [4 /*yield*/, userExist.save()];
            case 3:
                _b.sent();
                //send response
                return [2 /*return*/, res
                        .status(201)
                        .json({ message: messages_1.messages.user.verifiedSuccessfully, success: true })];
        }
    });
}); };
exports.ConfirmEmail = ConfirmEmail;
//---------------------------------------------------Login --------------------------------------------------------------
var login = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, userExist, match, accessToken, refreshToken;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password;
                return [4 /*yield*/, Database_1.User.findOne({ email: email })];
            case 1:
                userExist = _c.sent();
                if (!userExist) {
                    return [2 /*return*/, next(new AppError_1.AppError(messages_1.messages.user.notFound, 404))];
                }
                match = (0, encryption_1.comparePassword)({
                    password: password,
                    hashPassword: ((_b = userExist.password) === null || _b === void 0 ? void 0 : _b.toString()) || "",
                });
                if (!match) {
                    return [2 /*return*/, next(new AppError_1.AppError(messages_1.messages.user.Incorrect, 400))];
                }
                accessToken = (0, token_1.generateToken)({
                    payload: { email: email, id: userExist._id },
                    options: { expiresIn: '1d' },
                });
                refreshToken = (0, token_1.generateToken)({
                    payload: { email: email, id: userExist._id },
                    options: { expiresIn: "7d" },
                });
                //return response
                return [2 /*return*/, res
                        .status(200)
                        .json({
                        message: messages_1.messages.user.loginSuccessfully,
                        success: true,
                        access_token: accessToken,
                        refresh_token: refreshToken,
                    })];
        }
    });
}); };
exports.login = login;
//---------------------------------------------------Login With Google --------------------------------------------------------------
var loginWithGoogle = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var idToken, _a, email, given_name, family_name, userExist, accessToken, refreshToken;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                idToken = req.body.idToken;
                return [4 /*yield*/, (0, verifyGoogle_1.verifyGoogleToken)(idToken)
                    //check user exist
                ];
            case 1:
                _a = _b.sent(), email = _a.email, given_name = _a.given_name, family_name = _a.family_name;
                return [4 /*yield*/, Database_1.User.findOne({ email: email })];
            case 2:
                userExist = _b.sent();
                if (!!userExist) return [3 /*break*/, 4];
                return [4 /*yield*/, Database_1.User.create({
                        email: email,
                        firstName: given_name,
                        lastName: family_name,
                        provider: enum_1.providers.GOOGLE,
                        isConfirmed: true,
                        phone: undefined,
                    })];
            case 3:
                userExist = _b.sent();
                _b.label = 4;
            case 4:
                accessToken = (0, token_1.generateToken)({
                    payload: { email: email, id: userExist._id },
                    options: { expiresIn: "1d" },
                });
                refreshToken = (0, token_1.generateToken)({
                    payload: { email: email, id: userExist._id },
                    options: { expiresIn: "7d" },
                });
                //return response
                return [2 /*return*/, res
                        .status(200)
                        .json({
                        message: messages_1.messages.user.loginSuccessfully,
                        success: true,
                        access_token: accessToken,
                        refresh_token: refreshToken,
                    })];
        }
    });
}); };
exports.loginWithGoogle = loginWithGoogle;
//---------------------------------------------------Activate Account--------------------------------------------------------------
var activateAccount = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var token, result, user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                token = req.params.token;
                if (!token) {
                    return [2 /*return*/, next(new AppError_1.AppError("Verification token is missing", 400))];
                }
                result = (0, token_1.verifyToken)({ token: token });
                if (!result || typeof result !== "object" || !("id" in result)) {
                    return [2 /*return*/, next(result)];
                }
                return [4 /*yield*/, Database_1.User.findByIdAndUpdate(result.id, { isConfirmed: true })];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, next(new AppError_1.AppError(messages_1.messages.user.notFound, 404))];
                }
                //return response
                res.status(200).json({ message: messages_1.messages.user.login, success: true });
                return [2 /*return*/];
        }
    });
}); };
exports.activateAccount = activateAccount;
//---------------------------------------------------Refresh Token--------------------------------------------------------------
var refreshToken = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var refreshToken, result, accessToken;
    return __generator(this, function (_a) {
        refreshToken = req.body.refreshToken;
        if (!refreshToken) {
            return [2 /*return*/, next(new AppError_1.AppError("Verification token is missing", 400))];
        }
        result = (0, token_1.verifyToken)({ token: refreshToken });
        if (!result) {
            return [2 /*return*/, next(new AppError_1.AppError("Invalid or expired token", 401))];
        }
        if (!result || typeof result !== "object" || !("email" in result) || !("_id" in result)) {
            return [2 /*return*/, next(new AppError_1.AppError("Invalid or expired token", 401))];
        }
        accessToken = (0, token_1.generateToken)({
            payload: { email: result.email, id: result.id },
            options: { expiresIn: "7d" },
        });
        //send response
        return [2 /*return*/, res.status(200).json({ success: true, accessToken: accessToken })];
    });
}); };
exports.refreshToken = refreshToken;
//---------------------------------------------------Forget Password--------------------------------------------------------------
var forgetPassword = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var email, userExist, forgetOTP;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                email = req.body.email;
                return [4 /*yield*/, Database_1.User.findOne({ email: email })];
            case 1:
                userExist = _a.sent();
                if (!userExist) {
                    return [2 /*return*/, next(new AppError_1.AppError(messages_1.messages.user.notFound, 404))];
                }
                //check if user already have otp
                if (userExist.otpEmail && userExist.expiredDateOtp.getTime() > Date.now()) {
                    return [2 /*return*/, next(new AppError_1.AppError(messages_1.messages.user.AlreadyHasOtp, 400))];
                }
                forgetOTP = String((0, otp_1.generateOTP)());
                //hash
                userExist.otpEmail = forgetOTP;
                userExist.expiredDateOtp = new Date(Date.now() + 5 * 60 * 1000);
                //save to db
                return [4 /*yield*/, userExist.save()];
            case 2:
                //save to db
                _a.sent();
                //update
                setTimeout(function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, Database_1.User.updateOne({ _id: userExist._id, expiredDateOtp: { $lte: Date.now() } }, { $unset: { otpEmail: "", expiredDateOtp: "" } })];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); }, 5 * 60 * 1000);
                //send email
                return [4 /*yield*/, (0, emailEvent_1.sendOTPForgetPassword)(email, userExist.firstName, userExist.lastName, forgetOTP)
                    //send response
                ];
            case 3:
                //send email
                _a.sent();
                //send response
                return [2 /*return*/, res
                        .status(200)
                        .json({ message: messages_1.messages.user.checkEmail, success: true })];
        }
    });
}); };
exports.forgetPassword = forgetPassword;
//---------------------------------------------------Change Password--------------------------------------------------------------
var changePassword = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, otpEmail, email, password, userExist, secondForgetPassword, hash, hashPassword;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, otpEmail = _a.otpEmail, email = _a.email, password = _a.password;
                return [4 /*yield*/, Database_1.User.findOne({ email: email })];
            case 1:
                userExist = _b.sent();
                if (!userExist) {
                    return [2 /*return*/, next(new AppError_1.AppError(messages_1.messages.user.notFound, 404))];
                }
                //check otp
                if (userExist.otpEmail !== otpEmail) {
                    return [2 /*return*/, next(new AppError_1.AppError(messages_1.messages.user.invalidOTP, 401))];
                }
                if (!(userExist.expiredDateOtp.getTime() < Date.now())) return [3 /*break*/, 5];
                secondForgetPassword = String((0, otp_1.generateOTP)());
                return [4 /*yield*/, (0, encryption_1.Hash)({ key: secondForgetPassword, SALT_ROUNDS: process.env.SALT_ROUNDS })
                    //add to otp
                ];
            case 2:
                hash = _b.sent();
                //add to otp
                userExist.otpEmail = hash;
                userExist.expiredDateOtp = new Date(Date.now() + 5 * 60 * 1000);
                //save to db
                return [4 /*yield*/, userExist.save()];
            case 3:
                //save to db
                _b.sent();
                //send resend email
                return [4 /*yield*/, (0, emailEvent_1.secondOTPForgetPassword)(email, userExist.firstName, userExist.lastName, secondForgetPassword)];
            case 4:
                //send resend email
                _b.sent();
                _b.label = 5;
            case 5:
                hashPassword = (0, encryption_1.Hash)({
                    key: password,
                    SALT_ROUNDS: process.env.SALT_ROUNDS,
                });
                //update in db
                return [4 /*yield*/, Database_1.User.updateOne({ email: email }, { password: hashPassword, $unset: { otpEmail: "", expiredDateOtp: "" } })];
            case 6:
                //update in db
                _b.sent();
                //send response 
                return [2 /*return*/, res.status(200).json({ success: true, message: messages_1.messages.user.updateSuccessfully })];
        }
    });
}); };
exports.changePassword = changePassword;
