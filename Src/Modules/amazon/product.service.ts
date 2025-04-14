
import { Product } from "../../../Database";
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
    const existingProduct = await Product.findOne({ $or: [{ title }, { asin }] });
    if (existingProduct) {
      return res.status(409).json({ message: "Product with this title or ASIN already exists" });
    }

    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error adding product", error });
  }
};

// 🟢 جلب كل المنتجات مع دعم البحث والفرز والتصفية والتقسيم إلى صفحات
export const getAllProducts = async (req: AppRequest, res: AppResponse, next: AppNext) => {
  try {
    const { search, sortBy, order, select, category, page = 1, limit = 10 } = req.query;
    let filter: any = {};

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

    // ترتيب النتائج
    let sortOptions: any = {};
    if (typeof sortBy === "string") {
      sortOptions[sortBy] = order === "desc" ? -1 : 1;
    }

    // تحديد الحقول التي سيتم إرجاعها
    let selectFields = "";
    if (select) {
      selectFields = (select as string).split(",").join(" ");
    }

    // حساب الصفحة التي سيتم جلبها والحد الأقصى للمنتجات في الصفحة
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const limitValue = parseInt(limit as string);

    // حساب إجمالي عدد المنتجات
    const totalProducts = await Product.countDocuments(filter);

    // جلب المنتجات بناءً على الفلاتر
    const products = await Product.find(filter)
      .sort(sortOptions)
      .select(selectFields)
      .skip(skip)
      .limit(limitValue);

    // حساب عدد الصفحات
    const totalPages = Math.ceil(totalProducts / limitValue);

    // إرسال الاستجابة مع معلومات الـ pagination
    res.status(200).json({
      products,
      totalProducts,
      totalPages,
      currentPage: parseInt(page as string),
      perPage: limitValue
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};


// 🟢 جلب منتج حسب ID
export const getProductById = async (req: AppRequest, res: AppResponse, next: AppNext) => {
  try {
    const product = await Product.findById(req.params.id);
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

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
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
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
};
