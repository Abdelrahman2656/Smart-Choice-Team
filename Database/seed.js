"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startSeeding = void 0;
var dotenv_1 = require("dotenv");
var fs_1 = require("fs");
var mongoose_1 = require("mongoose");
var path_1 = require("path");
var Database_1 = require("../Database"); // ✅ عدل المسار لو مختلف
var dbconnection_1 = require("./dbconnection");
dotenv_1.default.config({ path: path_1.default.resolve("./.env") });
var loadJsonFilesFromDir = function (dirPath) {
    var files = fs_1.default.readdirSync(dirPath).filter(function (file) { return file.endsWith(".json"); });
    var allData = [];
    files.forEach(function (file) {
        var filePath = path_1.default.join(dirPath, file);
        try {
            var jsonData = JSON.parse(fs_1.default.readFileSync(filePath, "utf-8"));
            allData = allData.concat(jsonData);
        }
        catch (error) {
            console.error("\u274C Error reading JSON file: ".concat(filePath), error);
        }
    });
    return allData;
};
var extractAttribute = function (attributes, keyIncludes) {
    var found = attributes === null || attributes === void 0 ? void 0 : attributes.find(function (attr) { var _a; return (_a = attr.key) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(keyIncludes.toLowerCase()); });
    return found === null || found === void 0 ? void 0 : found.value;
};
var startSeeding = function () { return __awaiter(void 0, void 0, void 0, function () {
    var amazonData, amazonProducts, seenAsins, validProducts, existingAsins_1, newProducts, productOps, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, dbconnection_1.dbconnection)()];
            case 1:
                _a.sent();
                amazonData = loadJsonFilesFromDir(path_1.default.join(process.cwd(), "Database/path/amazon"));
                amazonProducts = amazonData.map(function (p) { return (__assign(__assign({}, p), { source: "amazon" })); });
                console.log("\uD83D\uDCCA Total products loaded: ".concat(amazonProducts.length));
                seenAsins = new Set();
                validProducts = amazonProducts
                    .filter(function (p) { return p.asin && !seenAsins.has(p.asin); })
                    .map(function (p) {
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3;
                    var asin = p.asin;
                    seenAsins.add(asin);
                    var attributes = Array.isArray(p.attributes)
                        ? p.attributes.map(function (attr) { return ({ key: attr.key, value: attr.value }); })
                        : [];
                    return {
                        source: p.source,
                        title: (_b = (_a = p.name) !== null && _a !== void 0 ? _a : p.title) !== null && _b !== void 0 ? _b : "Unknown Product",
                        url: typeof p.urls === "object" && p.urls.amazon
                            ? p.urls.amazon
                            : typeof p.url === "string"
                                ? p.url
                                : "N/A",
                        urls: {
                            amazon: typeof p.urls === "object" && p.urls.amazon
                                ? p.urls.amazon
                                : typeof p.url === "string"
                                    ? p.url
                                    : "N/A",
                            jumia: typeof p.urls === "object" && p.urls.jumia
                                ? p.urls.jumia
                                : "N/A",
                        },
                        asin: asin,
                        sku: (_c = p.sku) !== null && _c !== void 0 ? _c : asin,
                        priceAmazon: typeof p.priceAmazon === "number" && p.priceAmazon > 0 ? p.priceAmazon : null,
                        priceJumia: typeof p.priceJumia === "number" && p.priceJumia > 0 ? p.priceJumia : "غير متوفر",
                        oldPrice: (_d = p.oldPrice) !== null && _d !== void 0 ? _d : 0,
                        discount: (_e = p.discount) !== null && _e !== void 0 ? _e : "0%",
                        currency: (_h = (_f = p.currency) !== null && _f !== void 0 ? _f : (_g = p.price) === null || _g === void 0 ? void 0 : _g.currency) !== null && _h !== void 0 ? _h : "جنيه",
                        inStock: (_k = (_j = p.isBuyable) !== null && _j !== void 0 ? _j : p.inStock) !== null && _k !== void 0 ? _k : false,
                        brand: (_l = p.brand) !== null && _l !== void 0 ? _l : "Unknown",
                        rating: (_p = (_o = (_m = p.rating) === null || _m === void 0 ? void 0 : _m.average) !== null && _o !== void 0 ? _o : p.rating) !== null && _p !== void 0 ? _p : 0,
                        reviewsCount: (_s = (_r = (_q = p.rating) === null || _q === void 0 ? void 0 : _q.totalRatings) !== null && _r !== void 0 ? _r : p.reviewsCount) !== null && _s !== void 0 ? _s : 0,
                        thumbnailImage: (_t = p.thumbnailImage) !== null && _t !== void 0 ? _t : "N/A",
                        description: (_u = p.description) !== null && _u !== void 0 ? _u : "No description available",
                        features: Array.isArray(p.features) ? p.features : [],
                        attributes: attributes,
                        category: (_v = p.category) !== null && _v !== void 0 ? _v : "Unknown",
                        manufacturer: (_w = p.manufacturer) !== null && _w !== void 0 ? _w : "Unknown",
                        galleryThumbnails: Array.isArray(p.galleryThumbnails) ? p.galleryThumbnails : ["default-thumbnail.jpg"],
                        highResolutionImages: Array.isArray(p.highResolutionImages) ? p.highResolutionImages : ["default-image.jpg"],
                        stars: (_x = p.stars) !== null && _x !== void 0 ? _x : 0,
                        starsBreakdown: (_y = p.starsBreakdown) !== null && _y !== void 0 ? _y : { "5star": 0, "4star": 0, "3star": 0, "2star": 0, "1star": 0 },
                        ram: (_z = extractAttribute(attributes, "رام")) !== null && _z !== void 0 ? _z : extractAttribute(attributes, "ram"),
                        screenSize: extractAttribute(attributes, "حجم شاشة العرض"),
                        resolution: (_0 = extractAttribute(attributes, "دقة وضوح الشاشة")) !== null && _0 !== void 0 ? _0 : extractAttribute(attributes, "دقة الوضوح"),
                        battery: (_1 = extractAttribute(attributes, "البطارية")) !== null && _1 !== void 0 ? _1 : extractAttribute(attributes, "بطاريات"),
                        storageCapacity: (_2 = extractAttribute(attributes, "حجم القرص الصلب")) !== null && _2 !== void 0 ? _2 : extractAttribute(attributes, "سعة التخزين"),
                        processor: extractAttribute(attributes, "نوع المعالج"),
                        graphicsCard: (_3 = extractAttribute(attributes, "معالج الرسوميات المساعد")) !== null && _3 !== void 0 ? _3 : extractAttribute(attributes, "وصف بطاقة الرسومات"),
                        graphicsBrand: extractAttribute(attributes, "العلامة التجارية لشريحة الرسوم الجرافيكية"),
                        graphicsType: extractAttribute(attributes, "واجهة بطاقة الرسومات"),
                    };
                });
                console.log("\uD83D\uDCCA Total valid products after filtering: ".concat(validProducts.length));
                _a.label = 2;
            case 2:
                _a.trys.push([2, 5, 6, 7]);
                if (validProducts.length === 0) {
                    console.log("⚠️ No valid products to insert.");
                    return [2 /*return*/];
                }
                return [4 /*yield*/, Database_1.Product.find({ asin: { $in: validProducts.map(function (p) { return p.asin; }) } }).select("asin")];
            case 3:
                existingAsins_1 = _a.sent();
                newProducts = validProducts.filter(function (p) { return !existingAsins_1.some(function (existing) { return existing.asin === p.asin; }); });
                if (newProducts.length === 0) {
                    console.log("⚠️ All products already exist in the database.");
                    return [2 /*return*/];
                }
                productOps = newProducts.map(function (p) { return ({
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
                }); });
                console.log("\u23F3 Inserting ".concat(productOps.length, " Amazon products..."));
                return [4 /*yield*/, Database_1.Product.bulkWrite(productOps)];
            case 4:
                _a.sent();
                console.log("✅ Products inserted successfully!");
                return [3 /*break*/, 7];
            case 5:
                error_1 = _a.sent();
                console.error("❌ Error inserting products:", error_1);
                return [3 /*break*/, 7];
            case 6:
                mongoose_1.default.connection.close();
                return [7 /*endfinally*/];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.startSeeding = startSeeding;
