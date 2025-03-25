


import { Product } from "../../../Database";
import { AppNext, AppRequest, AppResponse } from "../../Utils/type";



// 🟢 إنشاء منتج جديد
export const createProduct= async (req: AppRequest, res: AppResponse ,next:AppNext) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error adding product", error });
  }
};

// 🟢 جلب كل المنتجات
export const getAllProducts = async (req: AppRequest, res: AppResponse ,next:AppNext) => {
  try {
    const { search, sortBy, order, select } = req.query;
    let filter: any = {};

    if (search) {
      filter = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { brand: { $regex: search, $options: "i" } },
        ],
      };
    }

    let sortOptions: any = {};
    if (typeof sortBy === "string") {
      sortOptions[sortBy] = order === "desc" ? -1 : 1;
    }

    let selectFields = "";
    if (select) {
      selectFields = (select as string).split(",").join(" ");
    }

    const products = await Product.find(filter).sort(sortOptions).select(selectFields);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};

// 🟢 جلب منتج حسب ID
export const getProductById = async (req: AppRequest, res: AppResponse ,next:AppNext) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error });
  }
};

// 🟢 تحديث منتج معين
export const updateProduct = async (req: AppRequest, res: AppResponse ,next:AppNext) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error });
  }
};

// 🟢 حذف منتج معين
export const deleteProduct = async (req: AppRequest, res: AppResponse ,next:AppNext) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
};

