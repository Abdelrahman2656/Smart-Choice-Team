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
const productService = __importStar(require("./product.service"));
const asyncHandler_1 = require("../../../Middleware/asyncHandler");
const authentication_1 = require("../../../Middleware/authentication");
const authorization_1 = require("../../../Middleware/authorization");
const enum_1 = require("../../../Utils/constant/enum");
const productRouter = (0, express_1.Router)();
// 🟢 إنشاء منتج (متاح فقط للمسؤولين)
productRouter.post("/", authentication_1.isAuthentication, (0, authorization_1.isAuthorization)([enum_1.roles.ADMIN]), (0, asyncHandler_1.asyncHandler)(productService.createProduct));
// 🟢 جلب كل المنتجات (متاح للجميع)
productRouter.get("/", (0, asyncHandler_1.asyncHandler)(productService.getAllProducts));
// 🟢 جلب منتج معين حسب الـ ID (متاح للجميع)
productRouter.get("/:id", (0, asyncHandler_1.asyncHandler)(productService.getProductById));
// 🟢 تحديث منتج معين (متاح فقط لـ ADMIN)
productRouter.put("/:id", authentication_1.isAuthentication, (0, authorization_1.isAuthorization)([enum_1.roles.ADMIN]), (0, asyncHandler_1.asyncHandler)(productService.updateProduct));
// 🟢 حذف منتج معين (متاح فقط لـ ADMIN)
productRouter.delete("/:id", authentication_1.isAuthentication, (0, authorization_1.isAuthorization)([enum_1.roles.ADMIN]), (0, asyncHandler_1.asyncHandler)(productService.deleteProduct));
exports.default = productRouter;
