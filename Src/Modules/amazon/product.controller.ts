import { Router } from "express";
import * as productService from "./product.service";
import { isAuthentication } from "../../Middleware/authentication";
import { isAuthorization } from "../../Middleware/authorization";
import { asyncHandler } from "../../Middleware/asyncHandler";
import { roles } from "../../Utils/constant/enum";


const productRouter = Router();

// 🟢 إنشاء منتج (متاح فقط للمسؤولين)
productRouter.post(
  "/",
  isAuthentication,
  isAuthorization([roles.ADMIN]),
  asyncHandler(productService.createProduct)
);

// 🟢 جلب كل المنتجات (متاح للجميع)
productRouter.get(
  "/all-amazon-product",
  asyncHandler(productService.getAllProducts)
);

// 🟢 جلب منتج معين حسب الـ ID (متاح للجميع)
productRouter.get(
  "/:id",
  asyncHandler(productService.getProductById)
);

// 🟢 تحديث منتج معين (متاح فقط لـ ADMIN)
productRouter.put(
  "/:id",
  isAuthentication,
  isAuthorization([roles.ADMIN]),
  asyncHandler(productService.updateProduct)
);

// 🟢 حذف منتج معين (متاح فقط لـ ADMIN)
productRouter.delete(
  "/:id",
  isAuthentication,
  isAuthorization([roles.ADMIN]),
  asyncHandler(productService.deleteProduct)
);

export default productRouter;
