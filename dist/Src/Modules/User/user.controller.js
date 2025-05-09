"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = require("../../Middleware/asyncHandler");
const validation_1 = require("../../Middleware/validation");
const userService = __importStar(require("./user.service"));
const userValidation = __importStar(require("./user.validation"));
const authentication_1 = require("../../Middleware/authentication");
const authorization_1 = require("../../Middleware/authorization");
const enum_1 = require("../../Utils/constant/enum");
const userRouter = (0, express_1.Router)();
// sign up
userRouter.post('/signup', (0, validation_1.isValid)(userValidation.signUpVal), (0, asyncHandler_1.asyncHandler)(userService.signUp));
// confirm email 
userRouter.patch('/confirm-email', (0, validation_1.isValid)(userValidation.confirmEmailVal), (0, asyncHandler_1.asyncHandler)(userService.ConfirmEmail));
//activate-account
userRouter.get('/activate-account/:token', (0, asyncHandler_1.asyncHandler)(userService.activateAccount));
//refresh-Token
userRouter.post('/refresh-token', (0, validation_1.isValid)(userValidation.refreshTokenVal), (0, asyncHandler_1.asyncHandler)(userService.refreshToken));
//login
userRouter.post('/signin', (0, validation_1.isValid)(userValidation.signInVal), (0, asyncHandler_1.asyncHandler)(userService.login));
//login with google
userRouter.post('/google-login', (0, validation_1.isValid)(userValidation.loginWithGoogleVal), (0, asyncHandler_1.asyncHandler)(userService.loginWithGoogle));
//forget password
userRouter.post('/forget-password', (0, validation_1.isValid)(userValidation.forgetPasswordVal), (0, asyncHandler_1.asyncHandler)(userService.forgetPassword));
//change password 
userRouter.put('/change-password', (0, validation_1.isValid)(userValidation.changePasswordVal), (0, asyncHandler_1.asyncHandler)(userService.changePassword));
//share profile
userRouter.get("/profile/:userId", authentication_1.isAuthentication, (0, authorization_1.isAuthorization)([enum_1.roles.USER]), (0, validation_1.isValid)(userValidation.shareProfile), (0, asyncHandler_1.asyncHandler)(userService.shareProfile));
//update Profile
userRouter.put("/update-profile/:userId", authentication_1.isAuthentication, (0, authorization_1.isAuthorization)([enum_1.roles.USER]), (0, validation_1.isValid)(userValidation.updateUser), (0, asyncHandler_1.asyncHandler)(userService.updateProfile));
exports.default = userRouter;
