"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMobile = exports.updateMobile = exports.getMobileById = exports.getRecommendMobile = exports.getAllMobiles = exports.createMobile = void 0;
const Database_1 = require("../../../Database");
const AppError_1 = require("../../Utils/AppError/AppError");
const messages_1 = require("../../Utils/constant/messages");
// قائمة الفئات المسموح بها
const ALLOWED_CATEGORIES = ["Laptop", "Smartphone", "TV", "GPU", "Monitor", "Tablet"];
// 🟢 إنشاء منتج جديد
const createMobile = async (req, res, next) => {
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
        const existingProduct = await Database_1.Mobile.findOne({ $or: [{ title }, { asin }] });
        if (existingProduct) {
            return res.status(409).json({ message: "Product with this title or ASIN already exists" });
        }
        const product = new Database_1.Mobile(req.body);
        await product.save();
        res.status(201).json(product);
    }
    catch (error) {
        res.status(500).json({ message: "Error adding product", error });
    }
};
exports.createMobile = createMobile;
// 🟢 جلب كل المنتجات مع دعم البحث والفرز والتصفية والتقسيم إلى صفحات
const getAllMobiles = async (req, res, next) => {
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
        if (req.query.batteryPowerRating) {
            filter.push({
                attributes: {
                    $elemMatch: {
                        key: "Battery Power Rating",
                        value: req.query.batteryPowerRating,
                    },
                },
            });
        }
        if (req.query.gps) {
            filter.push({
                attributes: {
                    $elemMatch: {
                        key: "GPS",
                        value: req.query.gps,
                    },
                },
            });
        }
        if (req.query.audioJack) {
            filter.push({
                attributes: {
                    $elemMatch: {
                        key: "Audio Jack",
                        value: req.query.audioJack,
                    },
                },
            });
        }
        if (req.query.formFactor) {
            filter.push({
                attributes: {
                    $elemMatch: {
                        key: "Form Factor",
                        value: req.query.formFactor,
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
        if (req.query.shippingDimensions) {
            filter.push({
                attributes: {
                    $elemMatch: {
                        key: "Shipping Dimensions",
                        value: req.query.shippingDimensions,
                    },
                },
            });
        }
        if (req.query.connectivityTechnology) {
            filter.push({
                attributes: {
                    $elemMatch: {
                        key: "Connectivity Technology",
                        value: req.query.connectivityTechnology,
                    },
                },
            });
        }
        if (req.query.otherDisplayFeatures) {
            filter.push({
                attributes: {
                    $elemMatch: {
                        key: "Other Display Features",
                        value: req.query.otherDisplayFeatures,
                    },
                },
            });
        }
        if (req.query.scannerResolution) {
            filter.push({
                attributes: {
                    $elemMatch: {
                        key: "Scanner Resolution",
                        value: req.query.scannerResolution,
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
        if (req.query.asin) {
            filter.push({
                attributes: {
                    $elemMatch: {
                        key: "ASIN",
                        value: req.query.asin,
                    },
                },
            });
        }
        if (req.query.returnPolicy) {
            filter.push({
                attributes: {
                    $elemMatch: {
                        key: "Return Reason, Return Period, Return Policy",
                        value: req.query.returnPolicy,
                    },
                },
            });
        }
        if (req.query.firstAvailableDate) {
            filter.push({
                attributes: {
                    $elemMatch: {
                        key: "First Available Date",
                        value: req.query.firstAvailableDate,
                    },
                },
            });
        }
        if (req.query.bestSellerRank) {
            filter.push({
                attributes: {
                    $elemMatch: {
                        key: "Best Seller Rank",
                        value: req.query.bestSellerRank,
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
        if (req.query.batteries) {
            filter.push({
                attributes: {
                    $elemMatch: {
                        key: "Batteries",
                        value: req.query.batteries,
                    },
                },
            });
        }
        if (req.query.whatsInTheBox) {
            filter.push({
                attributes: {
                    $elemMatch: {
                        key: "What's in the Box",
                        value: req.query.whatsInTheBox,
                    },
                },
            });
        }
        if (req.query.specialFeatures) {
            filter.push({
                attributes: {
                    $elemMatch: {
                        key: "Special Features",
                        value: req.query.specialFeatures,
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
        if (req.query.storagecapacity) {
            filter.push({
                productOverview: {
                    $elemMatch: {
                        key: "Storage Capacity",
                        value: req.query.storagecapacity,
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
        if (req.query.wirelesscarrier) {
            filter.push({
                productOverview: {
                    $elemMatch: {
                        key: "Wireless Carrier",
                        value: req.query.wirelesscarrier,
                    },
                },
            });
        }
        if (req.query.cellulartechnology) {
            filter.push({
                productOverview: {
                    $elemMatch: {
                        key: "Cellular Technology",
                        value: req.query.cellulartechnology,
                    },
                },
            });
        }
        if (req.query.connectortype) {
            filter.push({
                productOverview: {
                    $elemMatch: {
                        key: "Connector Type",
                        value: req.query.connectortype,
                    },
                },
            });
        }
        if (req.query.formfactor) {
            filter.push({
                productOverview: {
                    $elemMatch: {
                        key: "Form Factor",
                        value: req.query.formfactor,
                    },
                },
            });
        }
        if (req.query.batterycapacity) {
            filter.push({
                productOverview: {
                    $elemMatch: {
                        key: "Battery Capacity",
                        value: req.query.batterycapacity,
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
        if (req.query.cpumodel) {
            filter.push({
                productOverview: {
                    $elemMatch: {
                        key: "CPU Model",
                        value: req.query.cpumodel,
                    },
                },
            });
        }
        if (req.query.cpuspeed) {
            filter.push({
                productOverview: {
                    $elemMatch: {
                        key: "CPU Speed",
                        value: req.query.cpuspeed,
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
        const totalProducts = await Database_1.Mobile.countDocuments({ $and: filter });
        // جلب المنتجات
        const products = await Database_1.Mobile.find({ $and: filter })
            .sort(sortOptions)
            .select(selectFields)
            .skip(skip)
            .limit(limitValue);
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
exports.getAllMobiles = getAllMobiles;
//get recommend mobile
const getRecommendMobile = async (req, res, next) => {
    //get data from params
    let { mobileId } = req.params;
    //check existence 
    const mobileExist = await Database_1.Mobile.findById(mobileId);
    if (!mobileExist) {
        return next(new AppError_1.AppError(messages_1.messages.mobile.notFound, 404));
    }
    //prepare data 
    const price = mobileExist.priceAmazon;
    const min = price * 0.9;
    const max = price * 1.1;
    // find product  
    const recommendMobile = await Database_1.Mobile.find({
        _id: { $ne: mobileExist._id },
        priceAmazon: { $gte: min, $lte: max },
        category: mobileExist.category
    }).limit(5);
    if (!recommendMobile) {
        return next(new AppError_1.AppError(messages_1.messages.mobile.failToCreate, 500));
    }
    //send response 
    return res.status(200).json({ message: messages_1.messages.mobile.Recommended, success: true, recommendMobile });
};
exports.getRecommendMobile = getRecommendMobile;
// 🟢 جلب منتج حسب ID
const getMobileById = async (req, res, next) => {
    try {
        const product = await Database_1.Mobile.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching product", error });
    }
};
exports.getMobileById = getMobileById;
// 🟢 تحديث منتج معين
const updateMobile = async (req, res, next) => {
    try {
        const { asin, sku, ...updateData } = req.body;
        // ✅ منع تعديل `asin` و `sku`
        if (asin || sku) {
            return res.status(400).json({ message: "ASIN and SKU cannot be updated" });
        }
        const updatedProduct = await Database_1.Mobile.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(updatedProduct);
    }
    catch (error) {
        res.status(500).json({ message: "Error updating product", error });
    }
};
exports.updateMobile = updateMobile;
// 🟢 حذف منتج معين
const deleteMobile = async (req, res, next) => {
    try {
        const deletedProduct = await Database_1.Mobile.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting product", error });
    }
};
exports.deleteMobile = deleteMobile;
