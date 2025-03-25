import mongoose, { Schema, Document } from "mongoose";

interface IProduct extends Document {
  title: string;
  url: string;
  asin?: string;  // اجعل `asin` اختياريًا
  sku?: string;   // ✅ أضف `sku` كبديل اختياري
  price: number;
  currency: string;
  inStock: boolean;
  brand: string;
  rating: number;
  reviewsCount: number;
  thumbnailImage: string;
  description: string;
  features: string[];
  attributes: { key: string; value: string }[];
  storageCapacity?: string;
  ram?: string;
  screenSize?: string;
  resolution?: string;
  battery?: string;
}

const ProductSchema = new Schema<IProduct>({
  title: { type: String, required: true },
  url: { type: String, required: true },
  asin: { type: String, unique: true, sparse: true },  // ✅ `asin` غير مطلوب، ولكن يجب أن يكون فريدًا إذا وجد
  sku: { type: String, unique: true, sparse: true },   // ✅ `sku` غير مطلوب، ولكن يجب أن يكون فريدًا إذا وجد
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

export const Product = mongoose.model<IProduct>("Product", ProductSchema);


