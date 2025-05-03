
import { Mobile } from "../../../Database";
import { AppError } from "../../Utils/AppError/AppError";
import { messages } from "../../Utils/constant/messages";

import { AppNext, AppRequest, AppResponse } from "../../Utils/type";


// قائمة الفئات المسموح بها
const ALLOWED_CATEGORIES = ["Laptop", "Smartphone", "TV", "GPU", "Monitor", "Tablet"];

// 🟢 إنشاء منتج جديد
export const createMobile = async (req: AppRequest, res: AppResponse, next: AppNext) => {
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
    const existingProduct = await Mobile.findOne({ $or: [{ title }, { asin }] });
    if (existingProduct) {
      return res.status(409).json({ message: "Product with this title or ASIN already exists" });
    }

    const product = new Mobile(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error adding product", error });
  }
};

// 🟢 جلب كل المنتجات مع دعم البحث والفرز والتصفية والتقسيم إلى صفحات
export const getAllMobiles = async (req: AppRequest, res: AppResponse, next: AppNext) => {
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

    if (req.query.displayColors) {
      filter.push({
        attributes: {
          $elemMatch: {
            key: "Display Colors",
            value: req.query.displayColors,
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
    const totalProducts = await Mobile.countDocuments({ $and: filter });

    // جلب المنتجات
    const products = await Mobile.find({ $and: filter })
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

//get recommend mobile
export const getRecommendMobile = async (req: AppRequest, res: AppResponse, next: AppNext) =>{
  //get data from params
  let {mobileId} = req.params
  //check existence 
  const mobileExist = await Mobile.findById(mobileId)
  if(!mobileExist){
    return next(new AppError(messages.mobile.notFound,404))
  }
  //prepare data 
  const price = mobileExist.priceAmazon
  const min =  price * 0.9
  const max = price * 1.1
  // find product  
  const recommendMobile = await Mobile.find({
    _id:{$ne:mobileExist._id},
    priceAmazon:{$gte:min , $lte :max},
    category:mobileExist.category
  }).limit(5)
  if(!recommendMobile){
    return next(new AppError(messages.mobile.failToCreate,500))
  }
  //send response 
  return res.status(200).json({message:messages.mobile.Recommended,success:true , recommendMobile})
}

// 🟢 جلب منتج حسب ID
export const getMobileById = async (req: AppRequest, res: AppResponse, next: AppNext) => {
  try {
    const product = await Mobile.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error });
  }
};

// 🟢 تحديث منتج معين
export const updateMobile = async (req: AppRequest, res: AppResponse, next: AppNext) => {
  try {
    const { asin, sku, ...updateData } = req.body;

    // ✅ منع تعديل `asin` و `sku`
    if (asin || sku) {
      return res.status(400).json({ message: "ASIN and SKU cannot be updated" });
    }

    const updatedProduct = await Mobile.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error });
  }
};

// 🟢 حذف منتج معين
export const deleteMobile = async (req: AppRequest, res: AppResponse, next: AppNext) => {
  try {
    const deletedProduct = await Mobile.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
};
