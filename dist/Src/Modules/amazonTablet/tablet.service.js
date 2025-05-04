"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTablet = exports.updateTablet = exports.getRecommendTablet = exports.getTabletById = exports.getAllTablets = exports.createTablet = void 0;
const Database_1 = require("../../../Database");
const AppError_1 = require("../../Utils/AppError/AppError");
const messages_1 = require("../../Utils/constant/messages");
// قائمة الفئات المسموح بها
const ALLOWED_CATEGORIES = ["Laptop", "Smartphone", "TV", "GPU", "Monitor", "Tablet"];
// 🟢 إنشاء منتج جديد
const createTablet = async (req, res, next) => {
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
        const existingProduct = await Database_1.Tablet.findOne({ $or: [{ title }, { asin }] });
        if (existingProduct) {
            return res.status(409).json({ message: "Product with this title or ASIN already exists" });
        }
        const product = new Database_1.Tablet(req.body);
        await product.save();
        res.status(201).json(product);
    }
    catch (error) {
        res.status(500).json({ message: "Error adding product", error });
    }
};
exports.createTablet = createTablet;
// 🟢 جلب كل المنتجات مع دعم البحث والفرز والتصفية والتقسيم إلى صفحات
const getAllTablets = async (req, res, next) => {
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
        if (req.query.returnPolicy) {
            filter.push({
                attributes: {
                    $elemMatch: {
                        key: "Return Reason / Return Period / Return Policy",
                        value: req.query.returnPolicy,
                    },
                },
            });
        }
        if (req.query.brand) {
            filter.push({
                attributes: {
                    $elemMatch: {
                        key: "Brand",
                        value: req.query.brand,
                    },
                },
            });
        }
        if (req.query.packageDimensions) {
            filter.push({
                attributes: {
                    $elemMatch: {
                        key: "Package Dimensions",
                        value: req.query.packageDimensions,
                    },
                },
            });
        }
        if (req.query.itemModelNumber) {
            filter.push({
                attributes: {
                    $elemMatch: {
                        key: "Item Model Number",
                        value: req.query.itemModelNumber,
                    },
                },
            });
        }
        if (req.query.manufacturer) {
            filter.push({
                attributes: {
                    $elemMatch: {
                        key: "Manufacturer",
                        value: req.query.manufacturer,
                    },
                },
            });
        }
        if (req.query.series) {
            filter.push({
                attributes: {
                    $elemMatch: {
                        key: "Series",
                        value: req.query.series,
                    },
                },
            });
        }
        if (req.query.color) {
            filter.push({
                attributes: {
                    $elemMatch: {
                        key: "Color",
                        value: req.query.color,
                    },
                },
            });
        }
        if (req.query.displaySize) {
            filter.push({
                attributes: {
                    $elemMatch: {
                        key: "Display Size",
                        value: req.query.displaySize,
                    },
                },
            });
        }
        if (req.query.screenResolution) {
            filter.push({
                attributes: {
                    $elemMatch: {
                        key: "Screen Resolution",
                        value: req.query.screenResolution,
                    },
                },
            });
        }
        if (req.query.displayResolution) {
            filter.push({
                attributes: {
                    $elemMatch: {
                        key: "Display Resolution",
                        value: req.query.displayResolution,
                    },
                },
            });
        }
        if (req.query.processorBrand) {
            filter.push({
                attributes: {
                    $elemMatch: {
                        key: "Processor Brand",
                        value: req.query.processorBrand,
                    },
                },
            });
        }
        if (req.query.maximumSupportedMemory) {
            filter.push({
                attributes: {
                    $elemMatch: {
                        key: "Maximum Supported Memory",
                        value: req.query.maximumSupportedMemory,
                    },
                },
            });
        }
        if (req.query.speakerDescription) {
            filter.push({
                attributes: {
                    $elemMatch: {
                        key: "Speaker Description",
                        value: req.query.speakerDescription,
                    },
                },
            });
        }
        if (req.query.graphicsCoprocessor) {
            filter.push({
                attributes: {
                    $elemMatch: {
                        key: "Graphics Coprocessor",
                        value: req.query.graphicsCoprocessor,
                    },
                },
            });
        }
        if (req.query.graphicsChipsetBrand) {
            filter.push({
                attributes: {
                    $elemMatch: {
                        key: "Graphics Chipset Brand",
                        value: req.query.graphicsChipsetBrand,
                    },
                },
            });
        }
        if (req.query.graphicsCardDescription) {
            filter.push({
                attributes: {
                    $elemMatch: {
                        key: "Graphics Card Description",
                        value: req.query.graphicsCardDescription,
                    },
                },
            });
        }
        if (req.query.connectivityType) {
            filter.push({
                attributes: {
                    $elemMatch: {
                        key: "Connectivity Type",
                        value: req.query.connectivityType,
                    },
                },
            });
        }
        if (req.query.wirelessType) {
            filter.push({
                attributes: {
                    $elemMatch: {
                        key: "Wireless Type",
                        value: req.query.wirelessType,
                    },
                },
            });
        }
        if (req.query.frontWebcamResolution) {
            filter.push({
                attributes: {
                    $elemMatch: {
                        key: "Front Webcam Resolution",
                        value: req.query.frontWebcamResolution,
                    },
                },
            });
        }
        if (req.query.operatingSystem) {
            filter.push({
                attributes: {
                    $elemMatch: {
                        key: "Operating System",
                        value: req.query.operatingSystem,
                    },
                },
            });
        }
        if (req.query.batteryChargingTime) {
            filter.push({
                attributes: {
                    $elemMatch: {
                        key: "Battery Charging Time (hours)",
                        value: req.query.batteryChargingTime,
                    },
                },
            });
        }
        if (req.query.itemWeight) {
            filter.push({
                attributes: {
                    $elemMatch: {
                        key: "Item Weight",
                        value: req.query.itemWeight,
                    },
                },
            });
        }
        if (req.query.userReviews) {
            filter.push({
                attributes: {
                    $elemMatch: {
                        key: "User Reviews",
                        value: req.query.userReviews,
                    },
                },
            });
        }
        if (req.query.bestSellersRank) {
            filter.push({
                attributes: {
                    $elemMatch: {
                        key: "Best Sellers Rank",
                        value: req.query.bestSellersRank,
                    },
                },
            });
        }
        if (req.query.firstAvailabilityDate) {
            filter.push({
                attributes: {
                    $elemMatch: {
                        key: "First Available Date",
                        value: req.query.firstAvailabilityDate,
                    },
                },
            });
        }
        if (req.query.bestSellersRank) {
            filter.push({
                attributes: {
                    $elemMatch: {
                        key: "Best Sellers Rank",
                        value: req.query.bestSellersRank,
                    },
                },
            });
        }
        if (req.query.screensize) {
            filter.push({
                productOverview: {
                    $elemMatch: {
                        key: "Screen Size",
                        value: req.query.screensize,
                    },
                },
            });
        }
        if (req.query.brand) {
            filter.push({
                productOverview: {
                    $elemMatch: {
                        key: "Brand Name",
                        value: req.query.brand,
                    },
                },
            });
        }
        if (req.query.modelname) {
            filter.push({
                productOverview: {
                    $elemMatch: {
                        key: "Model Name",
                        value: req.query.modelname,
                    },
                },
            });
        }
        if (req.query.memorystoragecapacity) {
            filter.push({
                productOverview: {
                    $elemMatch: {
                        key: "Memory Storage Capacity",
                        value: req.query.memorystoragecapacity,
                    },
                },
            });
        }
        if (req.query.maximumdisplayresolution) {
            filter.push({
                productOverview: {
                    $elemMatch: {
                        key: "Maximum Display Resolution",
                        value: req.query.maximumdisplayresolution,
                    },
                },
            });
        }
        if (req.query.installedram) {
            filter.push({
                productOverview: {
                    $elemMatch: {
                        key: "Installed RAM",
                        value: req.query.installedram,
                    },
                },
            });
        }
        if (req.query.operatingsystem) {
            filter.push({
                productOverview: {
                    $elemMatch: {
                        key: "Operating System",
                        value: req.query.operatingsystem,
                    },
                },
            });
        }
        if (req.query.color) {
            filter.push({
                productOverview: {
                    $elemMatch: {
                        key: "Color",
                        value: req.query.color,
                    },
                },
            });
        }
        if (req.query.generation) {
            filter.push({
                productOverview: {
                    $elemMatch: {
                        key: "Generation",
                        value: req.query.generation,
                    },
                },
            });
        }
        if (req.query.specialfeatures) {
            filter.push({
                productOverview: {
                    $elemMatch: {
                        key: "Special Features",
                        value: req.query.specialfeatures,
                    },
                },
            });
        }
        if (req.query.displaytechnology) {
            filter.push({
                productOverview: {
                    $elemMatch: {
                        key: "Display Technology",
                        value: req.query.displaytechnology,
                    },
                },
            });
        }
        if (req.query.resolution) {
            filter.push({
                productOverview: {
                    $elemMatch: {
                        key: "Resolution",
                        value: req.query.resolution,
                    },
                },
            });
        }
        if (req.query.refreshrate) {
            filter.push({
                productOverview: {
                    $elemMatch: {
                        key: "Refresh Rate",
                        value: req.query.refreshrate,
                    },
                },
            });
        }
        if (req.query.includedcomponents) {
            filter.push({
                productOverview: {
                    $elemMatch: {
                        key: "Included Components",
                        value: req.query.includedcomponents,
                    },
                },
            });
        }
        if (req.query.connectivitytechnology) {
            filter.push({
                productOverview: {
                    $elemMatch: {
                        key: "Connectivity Technology",
                        value: req.query.connectivitytechnology,
                    },
                },
            });
        }
        if (req.query.yearofmanufacture) {
            filter.push({
                productOverview: {
                    $elemMatch: {
                        key: "Year of Manufacture",
                        value: req.query.yearofmanufacture,
                    },
                },
            });
        }
        if (req.query.deviceinterface) {
            filter.push({
                productOverview: {
                    $elemMatch: {
                        key: "Device Interface",
                        value: req.query.deviceinterface,
                    },
                },
            });
        }
        if (req.query.yearofrelease) {
            filter.push({
                productOverview: {
                    $elemMatch: {
                        key: "Year of Release",
                        value: req.query.yearofrelease,
                    },
                },
            });
        }
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
        const totalProducts = await Database_1.Tablet.countDocuments({ $and: filter });
        // جلب المنتجات
        const products = await Database_1.Tablet.find({ $and: filter })
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
exports.getAllTablets = getAllTablets;
// 🟢 جلب منتج حسب ID
const getTabletById = async (req, res, next) => {
    try {
        const product = await Database_1.Tablet.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching product", error });
    }
};
exports.getTabletById = getTabletById;
//get recommend tablet
const getRecommendTablet = async (req, res, next) => {
    //get data from params
    let { tabletId } = req.params;
    //check existence 
    const tabletExist = await Database_1.Tablet.findById(tabletId);
    if (!tabletExist) {
        return next(new AppError_1.AppError(messages_1.messages.tablet.notFound, 404));
    }
    //prepare data 
    const price = tabletExist.priceAmazon;
    const min = price * 0.9;
    const max = price * 1.1;
    // find product  
    const recommendTablet = await Database_1.Tablet.find({
        _id: { $ne: tabletExist._id },
        priceAmazon: { $gte: min, $lte: max },
        category: tabletExist.category
    }).limit(5);
    if (!recommendTablet) {
        return next(new AppError_1.AppError(messages_1.messages.tablet.failToCreate, 500));
    }
    //send response 
    return res.status(200).json({ message: messages_1.messages.mobile.Recommended, success: true, recommendTablet });
};
exports.getRecommendTablet = getRecommendTablet;
// 🟢 تحديث منتج معين
const updateTablet = async (req, res, next) => {
    try {
        const { asin, sku, ...updateData } = req.body;
        // ✅ منع تعديل `asin` و `sku`
        if (asin || sku) {
            return res.status(400).json({ message: "ASIN and SKU cannot be updated" });
        }
        const updatedProduct = await Database_1.Tablet.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(updatedProduct);
    }
    catch (error) {
        res.status(500).json({ message: "Error updating product", error });
    }
};
exports.updateTablet = updateTablet;
// 🟢 حذف منتج معين
const deleteTablet = async (req, res, next) => {
    try {
        const deletedProduct = await Database_1.Tablet.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting product", error });
    }
};
exports.deleteTablet = deleteTablet;
