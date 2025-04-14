

import dotenv from "dotenv";
import fs from "fs";
import mongoose from "mongoose";
import path from "path";
import { Product } from "../Database"; // ✅ عدل المسار لو مختلف
import { dbconnection } from "./dbconnection";

dotenv.config({ path: path.resolve("./config/.env") });

const loadJsonFilesFromDir = (dirPath: string): any[] => {
  const files = fs.readdirSync(dirPath).filter((file) => file.endsWith(".json"));
  let allData: any[] = [];

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    try {
      const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      allData = allData.concat(jsonData);
    } catch (error) {
      console.error(`❌ Error reading JSON file: ${filePath}`, error);
    }
  });

  return allData;
};

const extractAttribute = (attributes: any[], keyIncludes: string): string | undefined => {
  const found = attributes?.find((attr) =>
    attr.key?.toLowerCase().includes(keyIncludes.toLowerCase())
  );
  return found?.value;
};

export const startSeeding = async () => {
  await dbconnection();

  const amazonData = loadJsonFilesFromDir(
    path.join(process.cwd(), "Database/path/amazon")
  );

  const amazonProducts = amazonData.map((p) => ({ ...p, source: "amazon" }));

  console.log(`📊 Total products loaded: ${amazonProducts.length}`);

  const seenAsins = new Set();
  const validProducts = amazonProducts
    .filter((p) => p.asin && !seenAsins.has(p.asin))
    .map((p) => {
      const asin = p.asin;
      seenAsins.add(asin);

      const attributes = Array.isArray(p.attributes)
        ? p.attributes.map((attr: any) => ({ key: attr.key, value: attr.value }))
        : [];

      return {
        source: p.source,
        title: p.name ?? p.title ?? "Unknown Product",
        url:
          typeof p.urls === "object" && p.urls.amazon
            ? p.urls.amazon
            : typeof p.url === "string"
            ? p.url
            : "N/A",

        urls: {
          amazon:
            typeof p.urls === "object" && p.urls.amazon
              ? p.urls.amazon
              : typeof p.url === "string"
              ? p.url
              : "N/A",
          jumia:
            typeof p.urls === "object" && p.urls.jumia
              ? p.urls.jumia
              : "N/A",
        },

        asin: asin,
        sku: p.sku ?? asin,
        priceAmazon: typeof p.priceAmazon === "number" && p.priceAmazon > 0 ? p.priceAmazon :null,
        priceJumia: typeof p.priceJumia === "number" && p.priceJumia > 0 ? p.priceJumia : "غير متوفر",
        oldPrice: p.oldPrice ?? 0,
        discount: p.discount ?? "0%",
        currency: p.currency ?? p.price?.currency ?? "جنيه",
        inStock: p.isBuyable ?? p.inStock ?? false,
        brand: p.brand ?? "Unknown",
        rating: p.rating?.average ?? p.rating ?? 0,
        reviewsCount: p.rating?.totalRatings ?? p.reviewsCount ?? 0,
        thumbnailImage: p.thumbnailImage ?? "N/A",
        description: p.description ?? "No description available",
        features: Array.isArray(p.features) ? p.features : [],
        attributes: attributes,
        category: p.category ?? "Unknown",
        manufacturer: p.manufacturer ?? "Unknown",
        galleryThumbnails: Array.isArray(p.galleryThumbnails) ? p.galleryThumbnails : ["default-thumbnail.jpg"],
        highResolutionImages: Array.isArray(p.highResolutionImages) ? p.highResolutionImages : ["default-image.jpg"],
        stars: p.stars ?? 0,
        starsBreakdown: p.starsBreakdown ?? { "5star": 0, "4star": 0, "3star": 0, "2star": 0, "1star": 0 },
        ram: extractAttribute(attributes, "رام") ?? extractAttribute(attributes, "ram"),
        screenSize: extractAttribute(attributes, "حجم شاشة العرض"),
        resolution: extractAttribute(attributes, "دقة وضوح الشاشة") ?? extractAttribute(attributes, "دقة الوضوح"),
        battery: extractAttribute(attributes, "البطارية") ?? extractAttribute(attributes, "بطاريات"),
        storageCapacity: extractAttribute(attributes, "حجم القرص الصلب") ?? extractAttribute(attributes, "سعة التخزين"),
        processor: extractAttribute(attributes, "نوع المعالج"),
        graphicsCard: extractAttribute(attributes, "معالج الرسوميات المساعد") ?? extractAttribute(attributes, "وصف بطاقة الرسومات"),
        graphicsBrand: extractAttribute(attributes, "العلامة التجارية لشريحة الرسوم الجرافيكية"),
        graphicsType: extractAttribute(attributes, "واجهة بطاقة الرسومات"),
      };
    });

  console.log(`📊 Total valid products after filtering: ${validProducts.length}`);

  try {
    if (validProducts.length === 0) {
      console.log("⚠️ No valid products to insert.");
      return;
    }

    const existingAsins = await Product.find({ asin: { $in: validProducts.map((p) => p.asin) } }).select("asin");

    const newProducts = validProducts.filter(
      (p) => !existingAsins.some((existing) => existing.asin === p.asin)
    );

    if (newProducts.length === 0) {
      console.log("⚠️ All products already exist in the database.");
      return;
    }

    const productOps = newProducts.map((p) => ({
      updateOne: {
        filter: { asin: p.asin },
        update: {
          $set: {
            title: p.title,
            url: p.url,
            urls: p.urls,
            source: p.source,
            category: p.category,
            manufacturer: p.manufacturer,
            asin: p.asin,
            sku: p.sku,
            priceAmazon: p.priceAmazon,
            priceJumia: p.priceJumia,
            oldPrice: p.oldPrice,
            discount: p.discount,
            currency: p.currency,
            inStock: p.inStock,
            brand: p.brand,
            rating: p.rating,
            reviewsCount: p.reviewsCount,
            thumbnailImage: p.thumbnailImage,
            description: p.description,
            features: p.features,
            attributes: p.attributes,
            storageCapacity: p.storageCapacity,
            ram: p.ram,
            screenSize: p.screenSize,
            resolution: p.resolution,
            battery: p.battery,
            processor: p.processor,
            graphicsCard: p.graphicsCard,
            graphicsBrand: p.graphicsBrand,
            graphicsType: p.graphicsType,
            stars: p.stars,
            starsBreakdown: p.starsBreakdown,
            galleryThumbnails: p.galleryThumbnails,
            highResolutionImages: p.highResolutionImages,
          },
        },
        upsert: true,
      },
    }));

    console.log(`⏳ Inserting ${productOps.length} Amazon products...`);
    await Product.bulkWrite(productOps);
    console.log("✅ Products inserted successfully!");
  } catch (error) {
    console.error("❌ Error inserting products:", error);
  } finally {
    mongoose.connection.close();
  }
};