"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var asyncHandler_1 = require("../../Middleware/asyncHandler");
var validation_1 = require("../../Middleware/validation");
var userService = require("./user.service");
var userValidation = require("./user.validation");
var userRouter = (0, express_1.Router)();
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
exports.default = userRouter;
