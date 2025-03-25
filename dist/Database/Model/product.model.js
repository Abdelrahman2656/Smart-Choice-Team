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
exports.Product = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ProductSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    url: { type: String, required: true },
    asin: { type: String, unique: true, sparse: true }, // ✅ `asin` غير مطلوب، ولكن يجب أن يكون فريدًا إذا وجد
    sku: { type: String, unique: true, sparse: true }, // ✅ `sku` غير مطلوب، ولكن يجب أن يكون فريدًا إذا وجد
    price: { type: Number, required: true },
    currency: { type: String, required: true },
    inStock: { type: Boolean, required: true },
    brand: { type: String, required: true },
    rating: { type: Number, required: true },
    reviewsCount: { type: Number, required: true },
    thumbnailImage: { type: String, required: true },
    description: { type: String, required: true },
    features: { type: [String], required: true },
    attributes: [
        {
            key: { type: String, required: true },
            value: { type: String, required: true },
        },
    ],
    storageCapacity: { type: String },
    ram: { type: String },
    screenSize: { type: String },
    resolution: { type: String },
    battery: { type: String },
});
// ✅ أضف `sparse: true` لمنع مشاكل الفهارس عند غياب `sku` أو `asin`
exports.Product = mongoose_1.default.model("Product", ProductSchema);
