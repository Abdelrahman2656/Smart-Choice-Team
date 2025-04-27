"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTelevision = exports.updateTelevision = exports.getTelevisionById = exports.getAllTelevisions = exports.createTelevision = void 0;
const Database_1 = require("../../../Database");
// قائمة الفئات المسموح بها
const ALLOWED_CATEGORIES = ["Laptop", "Smartphone", "TV", "GPU", "Monitor", "Tablet"];
// 🟢 إنشاء منتج جديد
const createTelevision = async (req, res, next) => {
    try {
        const { title, url, price, currency, inStock, brand, rating, reviewsCount, thumbnailImage, description, category, asin } = req.body;
        // ✅ تحقق من الحقول المطلوبة
        if (!title || !url || !price || !currency || !brand || !rating || !reviewsCount || !thumbnailImage || !description || !category) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        // ✅ تحقق من أن الفئة (category) صحيحة
        if (!ALLOWED_CATEGORIES.includes(category)) {
            return res.status(400).json({ message: `Invalid category. Allowed categories: ${ALLOWED_CATEGORIES.join(", ")}` });
        }
        // ✅ منع تكرار المنتجات بنفس الـ ASIN أو العنوان
        const existingProduct = await Database_1.Tv.findOne({ $or: [{ title }, { asin }] });
        if (existingProduct) {
            return res.status(409).json({ message: "Product with this title or ASIN already exists" });
        }
        const product = new Database_1.Tv(req.body);
        await product.save();
        res.status(201).json(product);
    }
    catch (error) {
        res.status(500).json({ message: "Error adding product", error });
    }
};
exports.createTelevision = createTelevision;
// 🟢 جلب كل المنتجات مع دعم البحث والفرز والتصفية والتقسيم إلى صفحات
const getAllTelevisions = async (req, res, next) => {
    try {
        const { search, sortBy, order, select, category, page = 1, limit = 10, } = req.query;
        let filter = [];
        // فلترة على حسب البحث
        if (search) {
            filter.push({
                $or: [
                    { title: { $regex: search, $options: "i" } },
                    { brand: { $regex: search, $options: "i" } },
                    { category: { $regex: search, $options: "i" } },
                    { manufacturer: { $regex: search, $options: "i" } },
                ],
            });
        }
        // فلترة على حسب الفئة
        if (category) {
            filter.push({ category: category });
        }
        // فلترة على حسب السعر
        const minPrice = parseFloat(req.query.minPrice) || 0;
        const maxPrice = parseFloat(req.query.maxPrice) || Number.MAX_SAFE_INTEGER;
        filter.push({ priceAmazon: { $gte: minPrice, $lte: maxPrice } });
        // فلترة لكل attribute موجود
        // فلترة الـ productOverview
        const overviewFieldsMapping = {
            screenSize: "Screen Size",
            brandName: "Brand Name",
            displayTechnology: "Display Technology",
            resolution: "Resolution",
            refreshRate: "Refresh Rate",
            specialFeatures: "Special Features",
            includedComponents: "Included Components",
            connectivityTechnology: "Connectivity Technology",
            aspectRatio: "Aspect Ratio",
            productDimensionsOverview: "Product Dimensions (Depth x Width x Height)",
        };
        Object.keys(overviewFieldsMapping).forEach((param) => {
            const overviewKey = overviewFieldsMapping[param];
            const overviewValue = req.query[param];
            if (overviewValue) {
                filter.push({
                    productOverview: {
                        $elemMatch: {
                            key: overviewKey,
                            value: overviewValue, // تطابق حرفي case-sensitive
                        },
                    },
                });
            }
        });
        // ترتيب النتائج
        let sortOptions = {};
        if (typeof sortBy === "string") {
            sortOptions[sortBy] = order === "desc" ? -1 : 1;
        }
        // تحديد الحقول اللي هتترجع
        let selectFields = "";
        if (select) {
            selectFields = select.split(",").join(" ");
        }
        // pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const limitValue = parseInt(limit);
        // إجمالي عدد المنتجات المطابقة
        const totalProducts = await Database_1.Tv.countDocuments({ $and: filter });
        // جلب المنتجات
        const products = await Database_1.Tv.find({ $and: filter })
            .sort(sortOptions)
            .select(selectFields)
            .skip(skip)
            .limit(limitValue);
        console.log('Fetched Products:', products);
        // حساب عدد الصفحات
        const totalPages = Math.ceil(totalProducts / limitValue);
        res.status(200).json({
            products,
            totalProducts,
            totalPages,
            currentPage: parseInt(page),
            perPage: limitValue,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error fetching products",
            error: error instanceof Error ? error.message : error,
        });
    }
};
exports.getAllTelevisions = getAllTelevisions;
// 🟢 جلب منتج حسب ID
const getTelevisionById = async (req, res, next) => {
    try {
        const product = await Database_1.Tv.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching product", error });
    }
};
exports.getTelevisionById = getTelevisionById;
// 🟢 تحديث منتج معين
const updateTelevision = async (req, res, next) => {
    try {
        const { asin, sku, ...updateData } = req.body;
        // ✅ منع تعديل `asin` و `sku`
        if (asin || sku) {
            return res.status(400).json({ message: "ASIN and SKU cannot be updated" });
        }
        const updatedProduct = await Database_1.Tv.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(updatedProduct);
    }
    catch (error) {
        res.status(500).json({ message: "Error updating product", error });
    }
};
exports.updateTelevision = updateTelevision;
// 🟢 حذف منتج معين
const deleteTelevision = async (req, res, next) => {
    try {
        const deletedProduct = await Database_1.Tv.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting product", error });
    }
};
exports.deleteTelevision = deleteTelevision;
