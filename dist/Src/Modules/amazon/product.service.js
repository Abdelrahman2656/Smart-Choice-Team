"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getAllProducts = exports.createProduct = void 0;
const Database_1 = require("../../../Database");
// قائمة الفئات المسموح بها
const ALLOWED_CATEGORIES = ["Laptop", "Smartphone", "TV", "GPU", "Monitor", "Tablet"];
// 🟢 إنشاء منتج جديد
const createProduct = async (req, res, next) => {
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
        const existingProduct = await Database_1.Laptop.findOne({ $or: [{ title }, { asin }] });
        if (existingProduct) {
            return res.status(409).json({ message: "Product with this title or ASIN already exists" });
        }
        const product = new Database_1.Laptop(req.body);
        await product.save();
        res.status(201).json(product);
    }
    catch (error) {
        res.status(500).json({ message: "Error adding product", error });
    }
};
exports.createProduct = createProduct;
// 🟢 جلب كل المنتجات مع دعم البحث والفرز والتصفية والتقسيم إلى صفحات
const getAllProducts = async (req, res, next) => {
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
        // فلترة على حسب التوفر
        if (req.query.inStock) {
            filter.push({ inStock: req.query.inStock === "true" });
        }
        // فلترة البراند
        if (req.query.brand) {
            filter.push({ brand: req.query.brand });
        }
        // فلترة على حسب نوع المعالج Processor Type
        if (req.query.processorType) {
            filter.push({
                "attributes": {
                    $elemMatch: {
                        key: "Processor Type",
                        value: req.query.processorType,
                    },
                },
            });
        }
        // فلترة على حسب الرام RAM Size
        if (req.query.ramSize) {
            filter.push({
                "attributes": {
                    $elemMatch: {
                        key: "RAM Size",
                        value: req.query.ramSize,
                    },
                },
            });
        }
        // فلترة على حسب الشاشة Display Screen Size
        if (req.query.screenSize) {
            filter.push({
                "attributes": {
                    $elemMatch: {
                        key: "Display Screen Size",
                        value: req.query.screenSize,
                    },
                },
            });
        }
        // فلترة على حسب كارت الشاشة Graphics Coprocessor
        if (req.query.graphicsCoprocessor) {
            filter.push({
                "attributes": {
                    $elemMatch: {
                        key: "Graphics Coprocessor",
                        value: req.query.graphicsCoprocessor,
                    },
                },
            });
        }
        // فلترة على حسب نوع كارت الشاشة Graphics Card Description
        if (req.query.graphicsCardDescription) {
            filter.push({
                "attributes": {
                    $elemMatch: {
                        key: "Graphics Card Description",
                        value: req.query.graphicsCardDescription,
                    },
                },
            });
        }
        // فلترة على حسب نظام التشغيل Operating System
        if (req.query.operatingSystem) {
            filter.push({
                "attributes": {
                    $elemMatch: {
                        key: "Operating System",
                        value: req.query.operatingSystem,
                    },
                },
            });
        }
        // فلترة على حسب حجم التخزين الداخلي Internal Storage
        if (req.query.internalStorage) {
            filter.push({
                "attributes": {
                    $elemMatch: {
                        key: "Hard Drive Size",
                        value: req.query.internalStorage,
                    },
                },
            });
        }
        // فلترة على حسب عمر البطارية Battery Life
        if (req.query.batteryLife) {
            filter.push({
                "attributes": {
                    $elemMatch: {
                        key: "Average Battery Life (in hours)",
                        value: req.query.batteryLife,
                    },
                },
            });
        }
        // فلترة على حسب السلسلة Series
        if (req.query.series) {
            filter.push({
                "attributes": {
                    $elemMatch: {
                        key: "Series",
                        value: req.query.series,
                    },
                },
            });
        }
        // فلترة على حسب السعر (يستخدم priceAmazon مش price)
        const minPrice = parseFloat(req.query.minPrice) || 0;
        const maxPrice = parseFloat(req.query.maxPrice) || Number.MAX_SAFE_INTEGER;
        filter.push({ priceAmazon: { $gte: minPrice, $lte: maxPrice } });
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
        // حساب skip و limit للـ pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const limitValue = parseInt(limit);
        // إجمالي عدد المنتجات المطابقة
        const totalProducts = await Database_1.Laptop.countDocuments({ $and: filter });
        // جلب المنتجات
        const products = await Database_1.Laptop.find({ $and: filter })
            .sort(sortOptions)
            .select(selectFields)
            .skip(skip)
            .limit(limitValue);
        // حساب عدد الصفحات
        const totalPages = Math.ceil(totalProducts / limitValue);
        // إرسال الرد
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
exports.getAllProducts = getAllProducts;
// 🟢 جلب منتج حسب ID
const getProductById = async (req, res, next) => {
    try {
        const product = await Database_1.Laptop.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching product", error });
    }
};
exports.getProductById = getProductById;
// 🟢 تحديث منتج معين
const updateProduct = async (req, res, next) => {
    try {
        const { asin, sku, ...updateData } = req.body;
        // ✅ منع تعديل `asin` و `sku`
        if (asin || sku) {
            return res.status(400).json({ message: "ASIN and SKU cannot be updated" });
        }
        const updatedProduct = await Database_1.Laptop.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(updatedProduct);
    }
    catch (error) {
        res.status(500).json({ message: "Error updating product", error });
    }
};
exports.updateProduct = updateProduct;
// 🟢 حذف منتج معين
const deleteProduct = async (req, res, next) => {
    try {
        const deletedProduct = await Database_1.Laptop.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting product", error });
    }
};
exports.deleteProduct = deleteProduct;
