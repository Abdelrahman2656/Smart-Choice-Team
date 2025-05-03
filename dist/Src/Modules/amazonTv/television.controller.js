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
const televisionService = __importStar(require("./television.service"));
const televisionValidation = __importStar(require("./television.validation"));
const authentication_1 = require("../../Middleware/authentication");
const authorization_1 = require("../../Middleware/authorization");
const asyncHandler_1 = require("../../Middleware/asyncHandler");
const enum_1 = require("../../Utils/constant/enum");
const validation_1 = require("../../Middleware/validation");
const televisionRouter = (0, express_1.Router)();
// 🟢 إنشاء منتج (متاح فقط للمسؤولين)
televisionRouter.post("/", authentication_1.isAuthentication, (0, authorization_1.isAuthorization)([enum_1.roles.ADMIN]), (0, asyncHandler_1.asyncHandler)(televisionService.createTelevision));
// 🟢 جلب كل المنتجات (متاح للجميع)
televisionRouter.get("/amazon-television", authentication_1.isAuthentication, (0, authorization_1.isAuthorization)([enum_1.roles.USER]), (0, asyncHandler_1.asyncHandler)(televisionService.getAllTelevisions));
// 🟢 جلب منتج معين حسب الـ ID (متاح للجميع)
televisionRouter.get("/amazon-television/:id", authentication_1.isAuthentication, (0, authorization_1.isAuthorization)([enum_1.roles.USER]), (0, asyncHandler_1.asyncHandler)(televisionService.getTelevisionById));
//get recommend Mobile
televisionRouter.get("/recommend-television/:tvId", authentication_1.isAuthentication, (0, authorization_1.isAuthorization)([enum_1.roles.USER]), (0, validation_1.isValid)(televisionValidation.getRecommendTv), (0, asyncHandler_1.asyncHandler)(televisionService.getRecommendTelevision));
// 🟢 تحديث منتج معين (متاح فقط لـ ADMIN)
televisionRouter.put("/:id", authentication_1.isAuthentication, (0, authorization_1.isAuthorization)([enum_1.roles.ADMIN]), (0, asyncHandler_1.asyncHandler)(televisionService.updateTelevision));
// 🟢 حذف منتج معين (متاح فقط لـ ADMIN)
televisionRouter.delete("/:id", authentication_1.isAuthentication, (0, authorization_1.isAuthorization)([enum_1.roles.ADMIN]), (0, asyncHandler_1.asyncHandler)(televisionService.deleteTelevision));
exports.default = televisionRouter;
