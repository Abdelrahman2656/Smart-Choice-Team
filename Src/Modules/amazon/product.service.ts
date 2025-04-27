
import { Laptop } from "../../../Database";
import { AppNext, AppRequest, AppResponse } from "../../Utils/type";


// قائمة الفئات المسموح بها
const ALLOWED_CATEGORIES = ["Laptop", "Smartphone", "TV", "GPU", "Monitor", "Tablet"];

// 🟢 إنشاء منتج جديد
export const createProduct = async (req: AppRequest, res: AppResponse, next: AppNext) => {
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
    const existingProduct = await Laptop.findOne({ $or: [{ title }, { asin }] });
    if (existingProduct) {
      return res.status(409).json({ message: "Product with this title or ASIN already exists" });
    }

    const product = new Laptop(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error adding product", error });
  }
};

// 🟢 جلب كل المنتجات مع دعم البحث والفرز والتصفية والتقسيم إلى صفحات
export const getAllProducts = async (req: AppRequest, res: AppResponse, next: AppNext) => {
  try {
    const {
      search,
      sortBy,
      order,
      select,
      category,
      page = 1,
      limit = 10,
    } = req.query;

    let filter: any = [];

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
    const minPrice = parseFloat(req.query.minPrice as string) || 0;
    const maxPrice =
      parseFloat(req.query.maxPrice as string) || Number.MAX_SAFE_INTEGER;
    filter.push({ priceAmazon: { $gte: minPrice, $lte: maxPrice } });

    // ترتيب النتائج
    let sortOptions: any = {};
    if (typeof sortBy === "string") {
      sortOptions[sortBy] = order === "desc" ? -1 : 1;
    }

    // تحديد الحقول اللي هتترجع
    let selectFields = "";
    if (select) {
      selectFields = (select as string).split(",").join(" ");
    }

    // حساب skip و limit للـ pagination
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const limitValue = parseInt(limit as string);

    // إجمالي عدد المنتجات المطابقة
    const totalProducts = await Laptop.countDocuments({ $and: filter });

    // جلب المنتجات
    const products = await Laptop.find({ $and: filter })
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
      currentPage: parseInt(page as string),
      perPage: limitValue,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching products",
      error: error instanceof Error ? error.message : error,
    });
  }
};



// 🟢 جلب منتج حسب ID
export const getProductById = async (req: AppRequest, res: AppResponse, next: AppNext) => {
  try {
    const product = await Laptop.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error });
  }
};

// 🟢 تحديث منتج معين
export const updateProduct = async (req: AppRequest, res: AppResponse, next: AppNext) => {
  try {
    const { asin, sku, ...updateData } = req.body;

    // ✅ منع تعديل `asin` و `sku`
    if (asin || sku) {
      return res.status(400).json({ message: "ASIN and SKU cannot be updated" });
    }

    const updatedProduct = await Laptop.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error });
  }
};

// 🟢 حذف منتج معين
export const deleteProduct = async (req: AppRequest, res: AppResponse, next: AppNext) => {
  try {
    const deletedProduct = await Laptop.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
};
