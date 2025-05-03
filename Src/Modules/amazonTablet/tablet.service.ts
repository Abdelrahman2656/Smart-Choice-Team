
import { Tablet } from "../../../Database";
import { AppError } from "../../Utils/AppError/AppError";
import { messages } from "../../Utils/constant/messages";
import { AppNext, AppRequest, AppResponse } from "../../Utils/type";


// قائمة الفئات المسموح بها
const ALLOWED_CATEGORIES = ["Laptop", "Smartphone", "TV", "GPU", "Monitor", "Tablet"];

// 🟢 إنشاء منتج جديد
export const createTablet= async (req: AppRequest, res: AppResponse, next: AppNext) => {
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
    const existingProduct = await Tablet.findOne({ $or: [{ title }, { asin }] });
    if (existingProduct) {
      return res.status(409).json({ message: "Product with this title or ASIN already exists" });
    }

    const product = new Tablet(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error adding product", error });
  }
};

// 🟢 جلب كل المنتجات مع دعم البحث والفرز والتصفية والتقسيم إلى صفحات
export const getAllTablets = async (req: AppRequest, res: AppResponse, next: AppNext) => {
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
            key: "First Availability Date",
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
    const totalProducts = await Tablet.countDocuments({ $and: filter });

    // جلب المنتجات
    const products = await Tablet.find({ $and: filter })
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
export const getTabletById = async (req: AppRequest, res: AppResponse, next: AppNext) => {
  try {
    const product = await Tablet.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error });
  }
};

//get recommend tablet
export const getRecommendTablet = async (req: AppRequest, res: AppResponse, next: AppNext) =>{
  //get data from params
  let {tabletId} = req.params
  //check existence 
  const tabletExist = await Tablet.findById(tabletId)
  if(!tabletExist){
    return next(new AppError(messages.tablet.notFound,404))
  }
  //prepare data 
  const price = tabletExist.priceAmazon
  const min =  price * 0.9
  const max = price * 1.1
  // find product  
  const recommendTablet = await Tablet.find({
    _id:{$ne:tabletExist._id},
    priceAmazon:{$gte:min , $lte :max},
    category:tabletExist.category
  }).limit(5)
  if(!recommendTablet){
    return next(new AppError(messages.tablet.failToCreate,500))
  }
  //send response 
  return res.status(200).json({message:messages.mobile.Recommended,success:true , recommendTablet})
}


// 🟢 تحديث منتج معين


export const updateTablet = async (req: AppRequest, res: AppResponse, next: AppNext) => {
  try {
    const { asin, sku, ...updateData } = req.body;

    // ✅ منع تعديل `asin` و `sku`
    if (asin || sku) {
      return res.status(400).json({ message: "ASIN and SKU cannot be updated" });
    }

    const updatedProduct = await Tablet.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error });
  }
};

// 🟢 حذف منتج معين
export const deleteTablet = async (req: AppRequest, res: AppResponse, next: AppNext) => {
  try {
    const deletedProduct = await Tablet.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
};
