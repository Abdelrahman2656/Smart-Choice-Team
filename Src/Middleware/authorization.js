"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthorization = void 0;
var AppError_1 = require("../Utils/AppError/AppError");
var messages_1 = require("../Utils/constant/messages");
var isAuthorization = function (roles) {
    if (roles === void 0) { roles = []; }
    return function (req, res, next) {
        if (!req.authUser || !roles.includes(req.authUser.role)) {
            return next(new AppError_1.AppError(messages_1.messages.user.notAuthorized, 401));
        }
    };
};
exports.isAuthorization = isAuthorization;
