
import { Tv } from "../../../Database";
import { AppError } from "../../Utils/AppError/AppError";
import { messages } from "../../Utils/constant/messages";
import { AppNext, AppRequest, AppResponse } from "../../Utils/type";


// قائمة الفئات المسموح بها
const ALLOWED_CATEGORIES = ["Laptop", "Smartphone", "TV", "GPU", "Monitor", "Tablet" ];

// 🟢 إنشاء منتج جديد
export const createTelevision= async (req: AppRequest, res: AppResponse, next: AppNext) => {
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
    const existingProduct = await Tv.findOne({ $or: [{ title }, { asin }] });
    if (existingProduct) {
      return res.status(409).json({ message: "Product with this title or ASIN already exists" });
    }

    const product = new Tv(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error adding product", error });
  }
};

// 🟢 جلب كل المنتجات مع دعم البحث والفرز والتصفية والتقسيم إلى صفحات
export const getAllTelevisions = async (req: AppRequest, res: AppResponse, next: AppNext) => {
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

    // فلترة على حسب السعر
    const minPrice = parseFloat(req.query.minPrice as string) || 0;
    const maxPrice = parseFloat(req.query.maxPrice as string) || Number.MAX_SAFE_INTEGER;
    filter.push({ priceAmazon: { $gte: minPrice, $lte: maxPrice } });

    // فلترة لكل attribute موجود
   

    // فلترة الـ productOverview
    const overviewFieldsMapping: Record<string, string> = {
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
    let sortOptions: any = {};
    if (typeof sortBy === "string") {
      sortOptions[sortBy] = order === "desc" ? -1 : 1;
    }

    // تحديد الحقول اللي هتترجع
    let selectFields = "";
    if (select) {
      selectFields = (select as string).split(",").join(" ");
    }

    // pagination
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const limitValue = parseInt(limit as string);

    // إجمالي عدد المنتجات المطابقة
    const totalProducts = await Tv.countDocuments({ $and: filter });

    // جلب المنتجات
    const products = await Tv.find({ $and: filter })
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
export const getTelevisionById = async (req: AppRequest, res: AppResponse, next: AppNext) => {
  try {
    const product = await Tv.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error });
  }
};
//get recommend television
export const getRecommendTelevision = async (req: AppRequest, res: AppResponse, next: AppNext) =>{
  //get data from params
  let {tvId} = req.params
  //check existence 
  const televisionExist = await Tv.findById(tvId)
  if(!televisionExist){
    return next(new AppError(messages.mobile.notFound,404))
  }
  //prepare data 
  const price = televisionExist.priceAmazon
  const min =  price * 0.9
  const max = price * 1.1
  // find product  
  const recommendTelevision = await Tv.find({
    _id:{$ne:televisionExist._id},
    priceAmazon:{$gte:min , $lte :max},
    category:televisionExist.category
  }).limit(5)
  if(!recommendTelevision){
    return next(new AppError(messages.mobile.failToCreate,500))
  }
  //send response 
  return res.status(200).json({message:messages.mobile.Recommended,success:true , recommendTelevision})
}


// 🟢 تحديث منتج معين
export const updateTelevision = async (req: AppRequest, res: AppResponse, next: AppNext) => {
  try {
    const { asin, sku, ...updateData } = req.body;

    // ✅ منع تعديل `asin` و `sku`
    if (asin || sku) {
      return res.status(400).json({ message: "ASIN and SKU cannot be updated" });
    }

    const updatedProduct = await Tv.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error });
  }
};

// 🟢 حذف منتج معين
export const deleteTelevision = async (req: AppRequest, res: AppResponse, next: AppNext) => {
  try {
    const deletedProduct = await Tv.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
};
