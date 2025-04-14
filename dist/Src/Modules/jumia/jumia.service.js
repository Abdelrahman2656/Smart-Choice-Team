"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getAllProducts = exports.createProduct = void 0;
const Database_1 = require("../../../Database");
const ALLOWED_CATEGORIES = ["Laptop", "smartphone", "tv", "gpu", "monitor", "tablet"];
const createProduct = async (req, res, next) => {
    try {
        const { title, url, price, currency, inStock, brand, rating, reviewsCount, thumbnailImage, description, category } = req.body;
        if (!title || !url || !price || !currency || !brand || !rating || !reviewsCount || !thumbnailImage || !description || !category) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        if (typeof category !== "string" || !ALLOWED_CATEGORIES.includes(category.toLowerCase())) {
            return res.status(400).json({ message: `Invalid category. Allowed categories: ${ALLOWED_CATEGORIES.join(", ")}` });
        }
        const existingProduct = await Database_1.Jumia.findOne({ $or: [{ title }, { url }] });
        if (existingProduct) {
            return res.status(409).json({ message: "Product with this title or URL already exists" });
        }
        const product = new Database_1.Jumia(req.body);
        await product.save();
        res.status(201).json(product);
    }
    catch (error) {
        res.status(500).json({ message: "Error adding product", error });
    }
};
exports.createProduct = createProduct;
const getAllProducts = async (req, res, next) => {
    try {
        const { search, sortBy, order, select, category, page = 1, limit = 10 } = req.query;
        let filter = {};
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { brand: { $regex: search, $options: "i" } },
                { category: { $regex: search, $options: "i" } }
            ];
        }
        if (typeof category === "string") {
            filter.category = category.toLowerCase();
        }
        let sortOptions = {};
        if (typeof sortBy === "string") {
            sortOptions[sortBy] = order === "desc" ? -1 : 1;
        }
        let selectFields = "";
        if (typeof select === "string") {
            selectFields = select.split(",").join(" ");
        }
        const products = await Database_1.Jumia.find(filter)
            .sort(sortOptions)
            .select(selectFields)
            .skip((+page - 1) * +limit)
            .limit(+limit);
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching products", error });
    }
};
exports.getAllProducts = getAllProducts;
const getProductById = async (req, res, next) => {
    try {
        const product = await Database_1.Jumia.findById(req.params.id);
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
const updateProduct = async (req, res, next) => {
    try {
        const { url, ...updateData } = req.body;
        if (url) {
            return res.status(400).json({ message: "URL cannot be updated" });
        }
        const updatedProduct = await Database_1.Jumia.findByIdAndUpdate(req.params.id, updateData, { new: true });
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
const deleteProduct = async (req, res, next) => {
    try {
        const deletedProduct = await Database_1.Jumia.findByIdAndDelete(req.params.id);
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
