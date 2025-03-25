"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startSeeding = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const dbconnection_1 = require("./dbconnection");
const Database_1 = require("../Database/");
dotenv_1.default.config({ path: path_1.default.resolve("./.env") }); // Load environment variables
(0, dbconnection_1.dbconnection)();
console.log(process.env.DATABASE_DB);
// Connect to MongoDB
// ✅ File Paths
const filePath1 = path_1.default.join(process.cwd(), "Database/path/dataset_product.json");
// const filePath2 = path.join(process.cwd(), "Database/path/lab_top.json");
// ✅ Ensure Files Exist
if (!fs_1.default.existsSync(filePath1)) {
    console.error("❌ JSON files are missing! Check file paths.");
    process.exit(1);
}
// ✅ Load Data from JSON Files
const loadJsonData = (filePath) => {
    try {
        return JSON.parse(fs_1.default.readFileSync(filePath, "utf-8"));
    }
    catch (error) {
        console.error(`❌ Error reading JSON file: ${filePath}`, error);
        return [];
    }
};
// ✅ Merge Product Data
const products1 = loadJsonData(filePath1);
// const products2 = loadJsonData(filePath2);
const allProducts = [...products1];
console.log(`📊 Total products loaded: ${allProducts.length}`);
// ✅ Filter Products: Remove duplicates & invalid `asin`
const seenAsins = new Set();
const validProducts = allProducts
    .filter((p) => (p.asin || p.sku) && !seenAsins.has(p.asin ?? p.sku)) // 🔹 إزالة التكرارات
    .map((p) => {
    const asinOrSku = p.asin ?? p.sku ?? `Unknown-ASIN-${Math.random().toString(36).substr(2, 9)}`;
    seenAsins.add(asinOrSku); // 🔹 تتبع `asin` أو `sku` المستخدم
    return {
        title: p.name ?? p.title ?? "Unknown Product",
        url: p.url ?? "N/A",
        asin: asinOrSku, // ✅ تأكد أنه ليس `null`
        sku: p.sku ?? asinOrSku, // ✅ استخدام `asinOrSku` كبديل إذا لم يوجد `sku`
        price: p.price?.value ?? 0,
        currency: p.price?.currency ?? "جنيه",
        inStock: p.isBuyable ?? p.inStock ?? false,
        brand: p.brand ?? "Unknown",
        rating: p.rating?.average ?? 0,
        reviewsCount: p.rating?.totalRatings ?? 0,
        thumbnailImage: p.thumbnailImage ?? "N/A",
        description: p.description ?? "No description available",
        features: Array.isArray(p.features) ? p.features : [],
        attributes: Array.isArray(p.attributes)
            ? p.attributes.map((attr) => ({ key: attr.key, value: attr.value }))
            : [],
        storageCapacity: p.attributes?.find((attr) => attr.key === "Memory Storage Capacity")?.value ?? "Unknown",
        ram: p.attributes?.find((attr) => attr.key === "RAM")?.value ?? "Unknown",
        screenSize: p.attributes?.find((attr) => attr.key === "Screen Size")?.value ?? "Unknown",
        resolution: p.attributes?.find((attr) => attr.key === "Resolution")?.value ?? "Unknown",
        battery: p.attributes?.find((attr) => attr.key === "Battery")?.value ?? "Unknown",
    };
});
console.log(`📊 Total valid products after filtering: ${validProducts.length}`);
// ✅ Insert Products into MongoDB
const startSeeding = async () => {
    try {
        console.log("⏳ Inserting new products...");
        if (validProducts.length === 0) {
            console.log("⚠️ No valid products to insert.");
            return;
        }
        await Database_1.Product.bulkWrite(validProducts.map((p) => ({
            updateOne: {
                filter: { asin: p.asin }, // Prevent duplicate `asin`
                update: { $set: p },
                upsert: true, // Insert if not found
            },
        })));
        console.log("✅ Database updated successfully!");
    }
    catch (error) {
        console.error("❌ Seeding Error:", error);
    }
    finally {
        mongoose_1.default.connection.close();
    }
};
exports.startSeeding = startSeeding;
// 🚀 Start Seeding
(0, exports.startSeeding)();
