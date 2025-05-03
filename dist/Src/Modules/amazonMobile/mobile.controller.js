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
const mobileService = __importStar(require("./mobile.service"));
const mobileValidation = __importStar(require("./mobile.validation"));
const authentication_1 = require("../../Middleware/authentication");
const authorization_1 = require("../../Middleware/authorization");
const asyncHandler_1 = require("../../Middleware/asyncHandler");
const enum_1 = require("../../Utils/constant/enum");
const validation_1 = require("../../Middleware/validation");
const mobileRouter = (0, express_1.Router)();
// 🟢 إنشاء منتج (متاح فقط للمسؤولين)
mobileRouter.post("/", authentication_1.isAuthentication, (0, authorization_1.isAuthorization)([enum_1.roles.ADMIN]), (0, asyncHandler_1.asyncHandler)(mobileService.createMobile));
// 🟢 جلب كل المنتجات (متاح للجميع)
mobileRouter.get("/amazon-mobile", authentication_1.isAuthentication, (0, authorization_1.isAuthorization)([enum_1.roles.USER]), (0, asyncHandler_1.asyncHandler)(mobileService.getAllMobiles));
// 🟢 جلب منتج معين حسب الـ ID (متاح للجميع)
mobileRouter.get("/:id", authentication_1.isAuthentication, (0, authorization_1.isAuthorization)([enum_1.roles.USER]), (0, asyncHandler_1.asyncHandler)(mobileService.getMobileById));
//get recommend Mobile
mobileRouter.get("/recommend-mobile/:mobileId", authentication_1.isAuthentication, (0, authorization_1.isAuthorization)([enum_1.roles.USER]), (0, validation_1.isValid)(mobileValidation.getRecommendMobile), (0, asyncHandler_1.asyncHandler)(mobileService.getRecommendMobile));
// 🟢 تحديث منتج معين (متاح فقط لـ ADMIN)
mobileRouter.put("/:id", authentication_1.isAuthentication, (0, authorization_1.isAuthorization)([enum_1.roles.ADMIN]), (0, asyncHandler_1.asyncHandler)(mobileService.updateMobile));
// 🟢 حذف منتج معين (متاح فقط لـ ADMIN)
mobileRouter.delete("/:id", authentication_1.isAuthentication, (0, authorization_1.isAuthorization)([enum_1.roles.ADMIN]), (0, asyncHandler_1.asyncHandler)(mobileService.deleteMobile));
exports.default = mobileRouter;
