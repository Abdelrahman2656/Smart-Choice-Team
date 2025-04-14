"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var productService = require("./product.service");
var authentication_1 = require("../../Middleware/authentication");
var authorization_1 = require("../../Middleware/authorization");
var asyncHandler_1 = require("../../Middleware/asyncHandler");
var enum_1 = require("../../Utils/constant/enum");
var productRouter = (0, express_1.Router)();
// 🟢 إنشاء منتج (متاح فقط للمسؤولين)
productRouter.post("/", authentication_1.isAuthentication, (0, authorization_1.isAuthorization)([enum_1.roles.ADMIN]), (0, asyncHandler_1.asyncHandler)(productService.createProduct));
// 🟢 جلب كل المنتجات (متاح للجميع)
productRouter.get("/all-amazon-product", (0, asyncHandler_1.asyncHandler)(productService.getAllProducts));
// 🟢 جلب منتج معين حسب الـ ID (متاح للجميع)
productRouter.get("/get-amazon-product/:id", (0, asyncHandler_1.asyncHandler)(productService.getProductById));
// 🟢 تحديث منتج معين (متاح فقط لـ ADMIN)
productRouter.put("/:id", authentication_1.isAuthentication, (0, authorization_1.isAuthorization)([enum_1.roles.ADMIN]), (0, asyncHandler_1.asyncHandler)(productService.updateProduct));
// 🟢 حذف منتج معين (متاح فقط لـ ADMIN)
productRouter.delete("/:id", authentication_1.isAuthentication, (0, authorization_1.isAuthorization)([enum_1.roles.ADMIN]), (0, asyncHandler_1.asyncHandler)(productService.deleteProduct));
exports.default = productRouter;
