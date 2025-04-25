"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wishlistRouter = exports.userRouter = exports.televisionRouter = exports.tabletRouter = exports.productRouter = exports.mobileRouter = void 0;
const product_controller_1 = __importDefault(require("./amazon/product.controller"));
exports.productRouter = product_controller_1.default;
const mobile_controller_1 = __importDefault(require("./amazonMobile/mobile.controller"));
exports.mobileRouter = mobile_controller_1.default;
const tablet_controller_1 = __importDefault(require("./amazonTablet/tablet.controller"));
exports.tabletRouter = tablet_controller_1.default;
const television_controller_1 = __importDefault(require("./amazonTV/television.controller"));
exports.televisionRouter = television_controller_1.default;
const user_controller_1 = __importDefault(require("./User/user.controller"));
exports.userRouter = user_controller_1.default;
const wishlist_controller_1 = __importDefault(require("./wishList/wishlist.controller"));
exports.wishlistRouter = wishlist_controller_1.default;
