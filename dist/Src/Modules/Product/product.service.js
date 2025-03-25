"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getAllProducts = exports.createProduct = void 0;
const Database_1 = require("../../../Database");
// 🟢 إنشاء منتج جديد
const createProduct = async (req, res, next) => {
    try {
        const product = new Database_1.Product(req.body);
        await product.save();
        res.status(201).json(product);
    }
    catch (error) {
        res.status(500).json({ message: "Error adding product", error });
    }
};
exports.createProduct = createProduct;
// 🟢 جلب كل المنتجات
const getAllProducts = async (req, res, next) => {
    try {
        const { search, sortBy, order, select } = req.query;
        let filter = {};
        if (search) {
            filter = {
                $or: [
                    { title: { $regex: search, $options: "i" } },
                    { brand: { $regex: search, $options: "i" } },
                ],
            };
        }
        let sortOptions = {};
        if (typeof sortBy === "string") {
            sortOptions[sortBy] = order === "desc" ? -1 : 1;
        }
        let selectFields = "";
        if (select) {
            selectFields = select.split(",").join(" ");
        }
        const products = await Database_1.Product.find(filter).sort(sortOptions).select(selectFields);
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching products", error });
    }
};
exports.getAllProducts = getAllProducts;
// 🟢 جلب منتج حسب ID
const getProductById = async (req, res, next) => {
    try {
        const product = await Database_1.Product.findById(req.params.id);
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
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
        const updatedProduct = await Database_1.Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) {
            res.status(404).json({ message: "Product not found" });
            return;
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
            res.status(404).json({ message: "Product not found" });
            return;
        }
        res.status(200).json({ message: "Product deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting product", error });
    }
};
exports.deleteProduct = deleteProduct;
