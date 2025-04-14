import mongoose, { Schema, Document } from "mongoose";

interface IJumiaProduct extends Document {
  sku: string; // SKU المنتج
  title: string; // اسم المنتج
  url: string; // رابط المنتج
  price: number; // السعر
  oldPrice: number; // السعر القديم
  discount: string; // الخصم
  currency: string; // العملة
  inStock: boolean; // متوفر في المخزون أم لا
  brand: string; // العلامة التجارية
  rating: number; // التقييم
  reviewsCount: number; // عدد التقييمات
  thumbnailImage: string; // صورة المنتج
  description: string; // وصف المنتج
  category: string; // الفئة
  tags: string; // علامات المنتج
  badges: {
    campaign: {
      name: string;
      identifier: string;
      url: string;
      txtColor: string;
      bgColor: string;
    };
  }; // العروض الترويجية
  isBuyable: boolean; // هل المنتج قابل للشراء
  simples: [
    {
      sku: string;
      isBuyable: boolean;
      price: number; // تم تعديل السعر إلى Number
      oldPrice: number; // تم تعديل السعر القديم إلى Number
      discount: string;
    }
  ]; // تفاصيل المنتج البديلة
}

const jumiaSchema = new Schema<IJumiaProduct>({
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

export const Jumia = mongoose.model<IJumiaProduct>("Jumia", jumiaSchema);
