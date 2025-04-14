import mongoose, { Schema, Document } from "mongoose";

interface IProduct extends Document {
  title: string;
  urls: string;
  category: string;
  manufacturer?: string;
  asin?: string;
  sku?: string;
  priceAmazon: number;
  priceJumia?: number;
  currency: string;
  inStock: boolean;
  brand: string;
  rating: number;
  reviewsCount: number;
  questionsCount?: number;
  thumbnailImage: string;
  description: string;
  features?: string[];
  attributes?: { key: string; value: string }[];
  storageCapacity?: string;
  ram?: string;
  screenSize?: string;
  resolution?: string;
  battery?: string;
  refreshRate?: string;
  processor?: string;
  graphicsCard?: string;
  graphicsBrand?: string;
  graphicsType?: string;
  salesRank?: { category: string; rank: number }[];
  deliveryInfo?: string;
  stars?: number;
  starsBreakdown?: { [key: string]: number };
  galleryThumbnails?: string[];
  highResolutionImages?: string[];
  source?: string;
}

const ProductSchema = new Schema<IProduct>(
  {
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
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProduct>("Product", ProductSchema);
