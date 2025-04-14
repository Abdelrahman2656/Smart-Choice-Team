"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = exports.productRouter = void 0;
var product_controller_1 = require("./amazon/product.controller");
exports.productRouter = product_controller_1.default;
var user_controller_1 = require("./User/user.controller");
exports.userRouter = user_controller_1.default;
