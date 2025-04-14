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
exports.isValid = void 0;
var AppError_1 = require("../Utils/AppError/AppError");
var isValid = function (schema) {
    return function (req, res, next) {
        var data = __assign(__assign(__assign({}, req.body), req.params), req.query);
        var error = schema.validate(data, { abortEarly: false }).error;
        if (error) {
            var errMSG = error.details.map(function (err) { return err.message; });
            return next(new AppError_1.AppError(errMSG.join(", "), 400));
        }
        next();
    };
};
exports.isValid = isValid;
