import dotenv from "dotenv";
import fs from "fs";
import mongoose from "mongoose";
import path from "path";
import { Mobile } from "../Database"; 
import dbconnection from "./dbconnection";


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

export const startSeedingMobile = async () => {
  await dbconnection();

  const amazonData = loadJsonFilesFromDir(
    path.join(process.cwd(), "Database/path/amazonMobile")
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

        const productOverview = Array.isArray(p.productOverview)
        ? p.productOverview.map((attr: any) => ({ key: attr.key, value: attr.value }))
        : [];

      const variantAttributes = Array.isArray(p.variantAttributes)
        ? p.variantAttributes.map((attr: any) => ({ key: attr.key, value: attr.value }))
        : [];

      const productPageReviews = Array.isArray(p.productPageReviews)
        ? p.productPageReviews.map((review: any) => ({
            username: review.username ?? "Anonymous",
            userId: review.userId ?? "N/A",
            userProfileLink: review.userProfileLink ?? "N/A",
            ratingScore: review.ratingScore ?? 0,
            reviewTitle: review.reviewTitle ?? "No Title",
            reviewDescription: review.reviewDescription ?? "No Description",
            date: review.date ?? null,
            position: review.position ?? 0,
            reviewedIn: review.reviewedIn ?? "No location",
            reviewId: review.reviewId ?? "N/A",
            reviewUrl: review.reviewUrl ?? "N/A",
            reviewImages: Array.isArray(review.reviewImages) ? review.reviewImages : [],
            reviewReaction: review.reviewReaction ?? "No reactions",
            isVerified: review.isVerified ?? false,
            isAmazonVine: review.isAmazonVine ?? false,
            avatar: review.avatar ?? null,
            variant: review.variant ?? "N/A",
            variantAttributes: review.variantAttributes ?? [],
          }))
        : [];

      return {
        source: p.source,
        title: p.name ?? p.title ?? "Unknown Product",
        url: p.urls?.amazon ?? p.url ?? "N/A",
        urls: {
          amazon: p.urls?.amazon ?? p.url ?? "N/A",
          jumia: p.urls?.jumia ?? "N/A",
        },
        asin,
        sku: p.sku ?? asin,
        priceAmazon: typeof p.priceAmazon === "number" && p.priceAmazon > 0 ? p.priceAmazon : null,
        priceJumia: typeof p.priceJumia === "number" && p.priceJumia > 0 ? p.priceJumia : "غير متوفر",
        oldPrice: p.oldPrice ?? 0,
        discount: p.discount ?? "0%",
        currency: p.currency ?? p.price?.currency ?? "EGP",
        inStock: p.isBuyable ?? p.inStock ?? false,
        brand: p.brand ?? "Unknown",
        rating: p.rating?.average ?? p.rating ?? 0,
        reviewsCount: p.rating?.totalRatings ?? p.reviewsCount ?? 0,
        thumbnailImage: p.thumbnailImage ?? "N/A",
        description: p.description ?? "No description available",
        listPrice: p.listPrice ?? { value: 0, currency: "EGP" },
        features: Array.isArray(p.features) ? p.features : [],
        attributes,
        variantAttributes,
        category: p.category ?? "Mobile",
        manufacturer: p.manufacturer ?? "Unknown",
        galleryThumbnails: Array.isArray(p.galleryThumbnails) ? p.galleryThumbnails : ["default-thumbnail.jpg"],
        highResolutionImages: Array.isArray(p.highResolutionImages) ? p.highResolutionImages : ["default-image.jpg"],
        stars: p.stars ?? 0,
        starsBreakdown: p.starsBreakdown ?? { "5star": 0, "4star": 0, "3star": 0, "2star": 0, "1star": 0 },
        ram: extractAttribute(attributes, "Ram") ?? extractAttribute(attributes, "ram"),
        screenSize: extractAttribute(attributes, "Screen Size"),
        resolution: extractAttribute(attributes, "Screen Resolution") ?? extractAttribute(attributes, "Resolution"),
        battery: extractAttribute(attributes, "Battery") ?? extractAttribute(attributes, "Batteries"),
        storageCapacity: extractAttribute(attributes, "Hard Drive Size") ?? extractAttribute(attributes, "Storage Capacity"),
        processor: extractAttribute(attributes, "Processor Type"),
        graphicsCard: extractAttribute(attributes, "Graphics Processor") ?? extractAttribute(attributes, "Graphics Card Description"),
        graphicsBrand: extractAttribute(attributes, "Graphics Chip Brand"),
        graphicsType: extractAttribute(attributes, "Graphics Card Interface"),
        productPageReviews,
        productOverview: [
          { key: "Screen Size", value: extractAttribute(productOverview, "Screen Size") ?? "Unknown" },
          { key: "Brand Name", value: extractAttribute(productOverview, "Brand") ?? "Unknown" },
          { key: "Operating System", value: extractAttribute(productOverview, "Operating System") ?? "Unknown" },
          { key: "Storage Capacity", value: extractAttribute(productOverview, "Storage Capacity") ?? "Unknown" },
          { key: "Model Name", value: extractAttribute(productOverview, "Model Name") ?? "Unknown" },
          { key: "Wireless Carrier", value: extractAttribute(productOverview, "Wireless Carrier") ?? "Unknown" },
          { key: "Cellular Technology", value: extractAttribute(productOverview, "Cellular Technology") ?? "Unknown" },
          { key: "Color", value: extractAttribute(productOverview, "Color") ?? "Unknown" },
          { key: "Connector Type", value: extractAttribute(productOverview, "Connector Type") ?? "Unknown" },
          { key: "Form Factor", value: extractAttribute(productOverview, "Form Factor") ?? "Unknown" },
          { key: "Battery Capacity", value: extractAttribute(productOverview, "Battery Capacity") ?? "Unknown" },
          { key: "Installed RAM", value: extractAttribute(productOverview, "Installed RAM") ?? "Unknown" },
          { key: "CPU Model", value: extractAttribute(productOverview, "CPU Model") ?? "Unknown" },
          { key: "CPU Speed", value: extractAttribute(productOverview, "CPU Speed") ?? "Unknown" },
          { key: "Resolution", value: extractAttribute(productOverview, "Resolution") ?? "Unknown" },
          { key: "Memory Storage Capacity", value: extractAttribute(productOverview, "Memory Storage Capacity") ?? "Unknown" },
          { key: "Refresh Rate", value: extractAttribute(productOverview, "Refresh Rate") ?? "Unknown" },
        ]
      };
    });

  console.log(`📊 Total valid products after filtering: ${validProducts.length}`);

  try {
    if (validProducts.length === 0) {
      console.log("⚠️ No valid products to insert.");
      return;
    }

    const existingAsins = await Mobile.find({ asin: { $in: validProducts.map((p) => p.asin) } }).select("asin");

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
        update: { $set: p },
        upsert: true,
      },
    }));

    console.log(`⏳ Inserting ${productOps.length} Amazon products...`);
    await Mobile.bulkWrite(productOps);
    console.log("✅ Products inserted successfully!");
  } catch (error) {
    console.error("❌ Error inserting products:", error);
  } finally {
    mongoose.connection.close();
  }
};