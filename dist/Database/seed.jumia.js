"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startSeedingJumia = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const Database_1 = require("../Database"); // تأكد من أن هذا هو المسار الصحيح
const dbconnection_1 = require("./dbconnection");
dotenv_1.default.config({ path: path_1.default.resolve("./config/.env") });
// وظيفة لتنظيف السعر (إزالة العملة من السعر)
function cleanPrice(price) {
    // إزالة أي شيء غير الأرقام والفاصلة العشرية
    const cleanedPrice = price.replace(/[^\d.-]/g, '');
    return parseFloat(cleanedPrice);
}
// وظيفة لتحميل بيانات جوميا من الدليل
const loadJsonFilesFromDir = (dirPath) => {
    const files = fs_1.default
        .readdirSync(dirPath)
        .filter((file) => file.endsWith(".json"));
    let allData = [];
    files.forEach((file) => {
        const filePath = path_1.default.join(dirPath, file);
        try {
            const jsonData = JSON.parse(fs_1.default.readFileSync(filePath, "utf-8"));
            allData = allData.concat(jsonData);
        }
        catch (error) {
            console.error(`❌ Error reading JSON file: ${filePath}`, error);
        }
    });
    return allData;
};
// وظيفة لتخزين بيانات جوميا في قاعدة البيانات
const startSeedingJumia = async () => {
    await (0, dbconnection_1.dbconnection)();
    const jumiaData = loadJsonFilesFromDir(path_1.default.join(process.cwd(), "Database/path/jumia") // تأكد من أن المسار صحيح
    );
    const jumiaProducts = jumiaData.map((p) => ({
        source: p.source,
        sku: p.product.sku ?? "Unknown SKU", // SKU المنتج
        title: p.product.name ?? "Unknown Product", // الاسم
        displayName: p.product.displayName ?? "Unknown Display Name", // display name
        url: p.product.url ?? "N/A", // رابط المنتج
        price: cleanPrice(p.product.prices?.price ?? "0"), // تنظيف السعر
        oldPrice: cleanPrice(p.product.prices?.oldPrice ?? "0"), // تنظيف السعر القديم
        discount: p.product.prices?.discount ?? "0%", // الخصم
        currency: p.product.prices?.price?.includes("جنيه") ? "جنيه" : "EGP", // العملة
        inStock: p.product.isBuyable ?? false, // حالة التوفر
        brand: p.product.brand ?? "Unknown", // العلامة التجارية
        rating: p.product.rating?.average ?? 0, // التقييم
        reviewsCount: p.product.rating?.totalRatings ?? 0, // عدد التقييمات
        thumbnailImage: p.product.image ?? "N/A", // صورة المنتج
        description: p.product.description ?? "No description available", // الوصف
        category: p.product.categories?.join(", ") ?? "Unknown", // الفئات
        tags: p.product.tags ?? "N/A", // الوسوم
        badges: {
            campaign: p.product.badges?.campaign ?? {
                name: "No Campaign",
                identifier: "N/A",
                url: "N/A",
                txtColor: "#000000",
                bgColor: "#FFFFFF",
            },
        },
        isBuyable: p.product.isBuyable ?? false, // هل المنتج قابل للشراء
        simples: p.product.simples?.map((simple) => ({
            sku: simple.sku,
            isBuyable: simple.isBuyable,
            price: cleanPrice(simple.prices?.price ?? "0"), // تنظيف السعر
            oldPrice: cleanPrice(simple.prices?.oldPrice ?? "0"), // تنظيف السعر القديم
            discount: simple.prices?.discount ?? "0%", // الخصم
        })) ?? [],
    }));
    console.log(`📊 Total valid products after filtering: ${jumiaProducts.length}`);
    try {
        // التأكد من وجود المنتجات في قاعدة البيانات
        if (jumiaProducts.length === 0) {
            console.log("⚠️ No valid products to insert.");
            return;
        }
        // نبحث عن المنتجات الموجودة في قاعدة البيانات باستخدام الـ SKU
        const existingSkus = await Database_1.Jumia.find({ sku: { $in: jumiaProducts.map((p) => p.sku) } }).select("sku");
        console.log(`📊 Total existing ASINs found: ${existingSkus.length}`);
        // فلترة المنتجات الجديدة
        const newProducts = jumiaProducts.filter((p) => !existingSkus.some((existing) => existing.sku === p.sku));
        if (newProducts.length === 0) {
            console.log("⚠️ All products already exist in the database.");
            return;
        }
        const productOps = newProducts.map((p) => ({
            updateOne: {
                filter: { sku: p.sku },
                update: { $set: p },
                upsert: true,
            },
        }));
        console.log(`⏳ Inserting ${productOps.length} Jumia products...`);
        if (productOps.length > 0)
            await Database_1.Jumia.bulkWrite(productOps);
        console.log("✅ Products inserted successfully!");
    }
    catch (error) {
        console.error("❌ Error inserting products:", error);
    }
    finally {
        mongoose_1.default.connection.close();
    }
};
exports.startSeedingJumia = startSeedingJumia;
