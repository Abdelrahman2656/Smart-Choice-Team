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
    category: { type: String, required: true },
    manufacturer: { type: String },
    asin: { type: String, unique: true, sparse: true },
    sku: { type: String, unique: true, sparse: true },
    price: { type: Number, required: true },
    currency: { type: String, required: true },
    inStock: { type: Boolean, required: true },
    brand: { type: String, required: true },
    rating: { type: Number, required: true },
    reviewsCount: { type: Number, required: true },
    questionsCount: { type: Number },
    thumbnailImage: { type: String, required: true },
    description: { type: String, required: true },
    features: { type: [String] },
    attributes: [
        {
            key: { type: String },
            value: { type: String },
        },
    ],
    storageCapacity: { type: String },
    ram: { type: String },
    screenSize: { type: String },
    resolution: { type: String },
    battery: { type: String },
    refreshRate: { type: String },
    salesRank: [
        {
            category: { type: String },
            rank: { type: Number },
        },
    ],
    deliveryInfo: { type: String },
    stars: { type: Number }, // ⭐
    starsBreakdown: { type: Map, of: Number }, // 📊
    galleryThumbnails: { type: [String] }, // 📸
    highResolutionImages: { type: [String] }, // 📸
});
exports.Product = mongoose_1.default.model("Product", ProductSchema);
