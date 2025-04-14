"use strict";
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getAllProducts = exports.createProduct = void 0;
var Database_1 = require("../../../Database");
// قائمة الفئات المسموح بها
var ALLOWED_CATEGORIES = ["Laptop", "Smartphone", "TV", "GPU", "Monitor", "Tablet"];
// 🟢 إنشاء منتج جديد
var createProduct = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, title, url, price, currency, inStock, brand, rating, reviewsCount, thumbnailImage, description, category, asin, existingProduct, product, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, title = _a.title, url = _a.url, price = _a.price, currency = _a.currency, inStock = _a.inStock, brand = _a.brand, rating = _a.rating, reviewsCount = _a.reviewsCount, thumbnailImage = _a.thumbnailImage, description = _a.description, category = _a.category, asin = _a.asin;
                // ✅ تحقق من الحقول المطلوبة
                if (!title || !url || !price || !currency || !brand || !rating || !reviewsCount || !thumbnailImage || !description || !category) {
                    return [2 /*return*/, res.status(400).json({ message: "Missing required fields" })];
                }
                // ✅ تحقق من أن الفئة (category) صحيحة
                if (!ALLOWED_CATEGORIES.includes(category)) {
                    return [2 /*return*/, res.status(400).json({ message: "Invalid category. Allowed categories: ".concat(ALLOWED_CATEGORIES.join(", ")) })];
                }
                return [4 /*yield*/, Database_1.Product.findOne({ $or: [{ title: title }, { asin: asin }] })];
            case 1:
                existingProduct = _b.sent();
                if (existingProduct) {
                    return [2 /*return*/, res.status(409).json({ message: "Product with this title or ASIN already exists" })];
                }
                product = new Database_1.Product(req.body);
                return [4 /*yield*/, product.save()];
            case 2:
                _b.sent();
                res.status(201).json(product);
                return [3 /*break*/, 4];
            case 3:
                error_1 = _b.sent();
                res.status(500).json({ message: "Error adding product", error: error_1 });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.createProduct = createProduct;
// 🟢 جلب كل المنتجات مع دعم البحث والفرز والتصفية والتقسيم إلى صفحات
var getAllProducts = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, search, sortBy, order, select, category, _b, page, _c, limit, filter, sortOptions, selectFields, skip, limitValue, totalProducts, products, totalPages, error_2;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 3, , 4]);
                _a = req.query, search = _a.search, sortBy = _a.sortBy, order = _a.order, select = _a.select, category = _a.category, _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.limit, limit = _c === void 0 ? 10 : _c;
                filter = {};
                // إضافة عوامل الفلترة بناءً على البحث
                if (search) {
                    filter.$or = [
                        { title: { $regex: search, $options: "i" } },
                        { brand: { $regex: search, $options: "i" } },
                        { category: { $regex: search, $options: "i" } },
                        { manufacturer: { $regex: search, $options: "i" } }
                    ];
                }
                // إضافة عامل الفلترة بناءً على الفئة
                if (category) {
                    filter.category = category;
                }
                sortOptions = {};
                if (typeof sortBy === "string") {
                    sortOptions[sortBy] = order === "desc" ? -1 : 1;
                }
                selectFields = "";
                if (select) {
                    selectFields = select.split(",").join(" ");
                }
                skip = (parseInt(page) - 1) * parseInt(limit);
                limitValue = parseInt(limit);
                return [4 /*yield*/, Database_1.Product.countDocuments(filter)];
            case 1:
                totalProducts = _d.sent();
                return [4 /*yield*/, Database_1.Product.find(filter)
                        .sort(sortOptions)
                        .select(selectFields)
                        .skip(skip)
                        .limit(limitValue)];
            case 2:
                products = _d.sent();
                totalPages = Math.ceil(totalProducts / limitValue);
                // إرسال الاستجابة مع معلومات الـ pagination
                res.status(200).json({
                    products: products,
                    totalProducts: totalProducts,
                    totalPages: totalPages,
                    currentPage: parseInt(page),
                    perPage: limitValue
                });
                return [3 /*break*/, 4];
            case 3:
                error_2 = _d.sent();
                res.status(500).json({ message: "Error fetching products", error: error_2 });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getAllProducts = getAllProducts;
// 🟢 جلب منتج حسب ID
var getProductById = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var product, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Database_1.Product.findById(req.params.id)];
            case 1:
                product = _a.sent();
                if (!product) {
                    return [2 /*return*/, res.status(404).json({ message: "Product not found" })];
                }
                res.status(200).json(product);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                res.status(500).json({ message: "Error fetching product", error: error_3 });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getProductById = getProductById;
// 🟢 تحديث منتج معين
var updateProduct = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, asin, sku, updateData, updatedProduct, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, asin = _a.asin, sku = _a.sku, updateData = __rest(_a, ["asin", "sku"]);
                // ✅ منع تعديل `asin` و `sku`
                if (asin || sku) {
                    return [2 /*return*/, res.status(400).json({ message: "ASIN and SKU cannot be updated" })];
                }
                return [4 /*yield*/, Database_1.Product.findByIdAndUpdate(req.params.id, updateData, { new: true })];
            case 1:
                updatedProduct = _b.sent();
                if (!updatedProduct) {
                    return [2 /*return*/, res.status(404).json({ message: "Product not found" })];
                }
                res.status(200).json(updatedProduct);
                return [3 /*break*/, 3];
            case 2:
                error_4 = _b.sent();
                res.status(500).json({ message: "Error updating product", error: error_4 });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updateProduct = updateProduct;
// 🟢 حذف منتج معين
var deleteProduct = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var deletedProduct, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Database_1.Product.findByIdAndDelete(req.params.id)];
            case 1:
                deletedProduct = _a.sent();
                if (!deletedProduct) {
                    return [2 /*return*/, res.status(404).json({ message: "Product not found" })];
                }
                res.status(200).json({ message: "Product deleted successfully" });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                res.status(500).json({ message: "Error deleting product", error: error_5 });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteProduct = deleteProduct;
