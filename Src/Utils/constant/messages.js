"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messages = void 0;
var generateMessage = function (entity) { return ({
    alreadyExist: "".concat(entity, " Already Exist "),
    notFound: "".concat(entity, " Not Found"),
    failToCreate: "Fail To Create ".concat(entity),
    failToUpdate: "Fail To Update ".concat(entity),
    failToDelete: "Fail To Delete ".concat(entity),
    createdSuccessfully: "".concat(entity, " Created Successfully"),
    updateSuccessfully: "".concat(entity, " Updated Successfully"),
    deleteSuccessfully: "".concat(entity, " Deleted Successfully"),
    notAllowed: "".concat(entity, " Not Authorized To Access This Api"),
    verifiedSuccessfully: "".concat(entity, " Verified Successfully"),
}); };
exports.messages = {
    user: __assign(__assign({}, generateMessage("User")), { verified: "User Verified Successfully", notAuthorized: "not authorized to access this api", invalidCredential: "Something Wrong In Password", changePassword: "Password Changed Successfully", AlreadyHasOtp: "You Already Has OTP", checkEmail: "Check Your email", invalidOTP: "Invalid OTP", expireOTP: "OTP IS EXPIRE ", login: "Congratulation Please Login", loginSuccessfully: "User Login Successfully", Incorrect: "Incorrect In Email Or Password", AlreadyVerified: "You Already Verified" }),
};
