"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jumia = void 0;
var mongoose_1 = require("mongoose");
var jumiaSchema = new mongoose_1.Schema({
    sku: { type: String, required: true },
    title: { type: String, required: true },
    url: { type: String, required: true },
    price: { type: Number, required: true },
    oldPrice: { type: Number, required: true },
    discount: { type: String, required: true },
    currency: { type: String, required: true, default: "جنيه" },
    inStock: { type: Boolean, required: true },
    brand: { type: String, required: true },
    rating: { type: Number, required: true },
    reviewsCount: { type: Number, required: true },
    thumbnailImage: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    tags: { type: String, required: true },
    badges: {
        campaign: {
            name: { type: String, default: "No Campaign" },
            identifier: { type: String, default: "N/A" },
            url: { type: String, default: "N/A" },
            txtColor: { type: String, default: "#000000" },
            bgColor: { type: String, default: "#FFFFFF" },
        },
    },
    isBuyable: { type: Boolean, required: true },
    simples: [
        {
            sku: { type: String, required: true },
            isBuyable: { type: Boolean, required: true },
            price: { type: Number, required: true },
            oldPrice: { type: Number, required: true },
            discount: { type: String, required: true },
        },
    ],
});
exports.Jumia = mongoose_1.default.model("Jumia", jumiaSchema);
