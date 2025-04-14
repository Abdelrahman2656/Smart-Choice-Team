"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
var mongoose_1 = require("mongoose");
var ProductSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    urls: {
        amazon: { type: String },
        jumia: { type: String },
    },
    category: { type: String, required: true },
    manufacturer: { type: String },
    asin: { type: String, unique: true, sparse: true },
    sku: { type: String, unique: true, sparse: true },
    priceAmazon: { type: Number, required: true },
    priceJumia: { type: Number },
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
    processor: { type: String },
    graphicsCard: { type: String },
    graphicsBrand: { type: String },
    graphicsType: { type: String },
    salesRank: [
        {
            category: { type: String },
            rank: { type: Number },
        },
    ],
    deliveryInfo: { type: String },
    stars: { type: Number },
    starsBreakdown: { type: Map, of: Number },
    galleryThumbnails: { type: [String] },
    highResolutionImages: { type: [String] },
    source: { type: String },
}, { timestamps: true });
exports.Product = mongoose_1.default.model("Product", ProductSchema);
