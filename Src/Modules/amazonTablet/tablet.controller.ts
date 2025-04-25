import { Router } from "express";
import * as tabletService from "./tablet.service";
import { isAuthentication } from "../../Middleware/authentication";
import { isAuthorization } from "../../Middleware/authorization";
import { asyncHandler } from "../../Middleware/asyncHandler";
import { roles } from "../../Utils/constant/enum";


const tabletRouter = Router();

// 🟢 إنشاء منتج (متاح فقط للمسؤولين)
 tabletRouter.post(
  "/",
  isAuthentication,
  isAuthorization([roles.ADMIN]),
  asyncHandler(tabletService.createTablet)
);

// 🟢 جلب كل المنتجات (متاح للجميع)
 tabletRouter.get(
  "/amazon-tablet",
  asyncHandler(tabletService.getAllTablets)
);

// 🟢 جلب منتج معين حسب الـ ID (متاح للجميع)
 tabletRouter.get(
  "/amazon-tablet/:id",
  asyncHandler(tabletService.getTabletById)
);

// 🟢 تحديث منتج معين (متاح فقط لـ ADMIN)
 tabletRouter.put(
  "/:id",
  isAuthentication,
  isAuthorization([roles.ADMIN]),
  asyncHandler(tabletService.updateTablet)
);

// 🟢 حذف منتج معين (متاح فقط لـ ADMIN)
 tabletRouter.delete(
  "/:id",
  isAuthentication,
  isAuthorization([roles.ADMIN]),
  asyncHandler(tabletService.deleteTablet)
);

export default  tabletRouter;
