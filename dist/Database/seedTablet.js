"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startSeedingTablet = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const Database_1 = require("../Database"); // ✅ عدل المسار لو مختلف
const dbconnection_1 = __importDefault(require("./dbconnection"));
dotenv_1.default.config({ path: path_1.default.resolve("./config/.env") });
const loadJsonFilesFromDir = (dirPath) => {
    const files = fs_1.default.readdirSync(dirPath).filter((file) => file.endsWith(".json"));
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
const extractAttribute = (attributes, keyIncludes) => {
    const found = attributes?.find((attr) => attr.key?.toLowerCase().includes(keyIncludes.toLowerCase()));
    return found?.value;
};
const startSeedingTablet = async () => {
    await (0, dbconnection_1.default)();
    const amazonData = loadJsonFilesFromDir(path_1.default.join(process.cwd(), "Database/path/amazonTablet"));
    const amazonProducts = amazonData.map((p) => ({ ...p, source: "amazon" }));
    console.log(`📊 Total products loaded: ${amazonProducts.length}`);
    const seenAsins = new Set();
    const validProducts = amazonProducts
        .filter((p) => p.asin && !seenAsins.has(p.asin))
        .map((p) => {
        const asin = p.asin;
        seenAsins.add(asin);
        const attributes = Array.isArray(p.attributes)
            ? p.attributes.map((attr) => ({ key: attr.key, value: attr.value }))
            : [];
        const productOverview = Array.isArray(p.productOverview)
            ? p.productOverview.map((attr) => ({ key: attr.key, value: attr.value }))
            : [];
        const variantAttributes = Array.isArray(p.variantAttributes)
            ? p.variantAttributes.map((attr) => ({ key: attr.key, value: attr.value }))
            : [];
        const productPageReviews = Array.isArray(p.productPageReviews)
            ? p.productPageReviews.map((review) => ({
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
                noon: p.urls?.noon ?? undefined
            },
            asin,
            sku: p.sku ?? asin,
            priceAmazon: typeof p.priceAmazon === "number" && p.priceAmazon > 0 ? p.priceAmazon : null,
            priceJumia: typeof p.priceJumia === "number" && p.priceJumia > 0 ? p.priceJumia : null,
            priceNoon: typeof p.priceNoon === "number" && p.priceNoon > 0 ? p.priceNoon : undefined,
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
            category: p.category ?? "Tablet",
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
                { key: "Brand Name", value: extractAttribute(productOverview, "Brand Name") ?? p.brand ?? "Unknown" },
                { key: "Model Name", value: extractAttribute(productOverview, "Model Name") ?? "Unknown" },
                { key: "Memory Storage Capacity", value: extractAttribute(productOverview, "Memory Storage Capacity") ?? "Unknown" },
                { key: "Maximum Display Resolution", value: extractAttribute(productOverview, "Maximum Display Resolution") ?? "Unknown" },
                { key: "Installed RAM", value: extractAttribute(productOverview, "Installed RAM") ?? "Unknown" },
                { key: "Operating System", value: extractAttribute(productOverview, "Operating System") ?? "Unknown" },
                { key: "Color", value: extractAttribute(productOverview, "Color") ?? "Unknown" },
                { key: "Generation", value: extractAttribute(productOverview, "Generation") ?? "Unknown" },
                { key: "Special Features", value: extractAttribute(productOverview, "Special Features") ?? "Unknown" },
                { key: "Display Technology", value: extractAttribute(productOverview, "Display Technology") ?? "Unknown" },
                { key: "Resolution", value: extractAttribute(productOverview, "Resolution") ?? "Unknown" },
                { key: "Refresh Rate", value: extractAttribute(productOverview, "Refresh Rate") ?? "Unknown" },
                { key: "Included Components", value: extractAttribute(productOverview, "Included Components") ?? "Unknown" },
                { key: "Connectivity Technology", value: extractAttribute(productOverview, "Connectivity Technology") ?? "Unknown" },
                { key: "Year of Manufacture", value: extractAttribute(productOverview, "Year of Manufacture") ?? "Unknown" },
                { key: "Device Interface", value: extractAttribute(productOverview, "Device Interface") ?? "Unknown" },
                { key: "Year of Release", value: extractAttribute(productOverview, "Year of Release") ?? "Unknown" },
            ]
        };
    });
    console.log(`📊 Total valid products after filtering: ${validProducts.length}`);
    try {
        if (validProducts.length === 0) {
            console.log("⚠️ No valid products to insert.");
            return;
        }
        const existingAsins = await Database_1.Tablet.find({ asin: { $in: validProducts.map((p) => p.asin) } }).select("asin");
        const newProducts = validProducts.filter((p) => !existingAsins.some((existing) => existing.asin === p.asin));
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
        await Database_1.Tablet.bulkWrite(productOps);
        console.log("✅ Products inserted successfully!");
    }
    catch (error) {
        console.error("❌ Error inserting products:", error);
    }
    finally {
        mongoose_1.default.connection.close();
    }
};
exports.startSeedingTablet = startSeedingTablet;
