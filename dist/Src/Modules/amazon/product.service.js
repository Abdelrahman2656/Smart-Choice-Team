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
        const existingProduct = await Database_1.Product.findOne({ $or: [{ title }, { asin }] });
        if (existingProduct) {
            return res.status(409).json({ message: "Product with this title or ASIN already exists" });
        }
        const product = new Database_1.Product(req.body);
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
        const { search, sortBy, order, select, category, page = 1, limit = 10 } = req.query;
        let filter = {};
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { brand: { $regex: search, $options: "i" } },
                { category: { $regex: search, $options: "i" } },
                { manufacturer: { $regex: search, $options: "i" } }
            ];
        }
        if (category) {
            filter.category = category;
        }
        let sortOptions = {};
        if (typeof sortBy === "string") {
            sortOptions[sortBy] = order === "desc" ? -1 : 1;
        }
        let selectFields = "";
        if (select) {
            const allowedFields = ["title", "brand", "priceAmazon", "category", "asin", "rating"];
            selectFields = select
                .split(",")
                .filter((field) => allowedFields.includes(field))
                .join(" ");
        }
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const limitValue = parseInt(limit);
        const totalProducts = await Database_1.Product.countDocuments(filter);
        const products = await Database_1.Product.find(filter)
            .sort(sortOptions)
            .select(selectFields)
            .skip(skip)
            .limit(limitValue);
        const totalPages = Math.ceil(totalProducts / limitValue);
        res.status(200).json({
            products,
            totalProducts,
            totalPages,
            currentPage: parseInt(page),
            perPage: limitValue
        });
    }
    catch (error) {
        console.error("❌ Error fetching products:", error);
        res.status(500).json({
            message: "Error fetching products",
            error: error.message,
            stack: error.stack,
        });
    }
};
exports.getAllProducts = getAllProducts;
// 🟢 جلب منتج حسب ID
const getProductById = async (req, res, next) => {
    try {
        const product = await Database_1.Product.findById(req.params.id);
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
        const updatedProduct = await Database_1.Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
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
        const deletedProduct = await Database_1.Product.findByIdAndDelete(req.params.id);
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
