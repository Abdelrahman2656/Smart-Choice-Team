import { Router } from "express";

import * as amazonService from "./product.service";
import { asyncHandler } from "../../Middleware/asyncHandler";
import { isAuthentication } from "../../Middleware/authentication";
import { isAuthorization } from "../../Middleware/authorization";
import { roles } from "../../Utils/constant/enum";
const productRouter = Router();

productRouter.post("/",isAuthentication,
    isAuthorization([roles.ADMIN]), asyncHandler(amazonService.createProduct));
productRouter.get(
  "/all-amazon-product",
  isAuthentication,
  isAuthorization([roles.USER]),
  asyncHandler(amazonService.getAllProducts)
);
productRouter.get(
  "/amazon-product/:id",
  isAuthentication,
  isAuthorization([roles.USER]),
  asyncHandler(amazonService.getProductById)
);
productRouter.put(
  "/update-amazon-product/:id",
  isAuthentication,
  isAuthorization([roles.USER, roles.ADMIN]),
  asyncHandler(amazonService.updateProduct)
);
productRouter.delete(
  "/delete-amazon-product/:id",
  isAuthentication,
  isAuthorization([roles.USER, roles.ADMIN]),
  asyncHandler(amazonService.deleteProduct)
);

export default productRouter;
