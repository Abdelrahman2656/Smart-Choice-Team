import { Router } from "express";
import * as tabletService from "./tablet.service";
import * as tableValidation from "./tablet.validation"
import { isAuthentication } from "../../Middleware/authentication";
import { isAuthorization } from "../../Middleware/authorization";
import { asyncHandler } from "../../Middleware/asyncHandler";
import { roles } from "../../Utils/constant/enum";
import { isValid } from "../../Middleware/validation";


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
  "/amazon-tablet",isAuthentication,isAuthorization([roles.USER]),
  asyncHandler(tabletService.getAllTablets)
);

// 🟢 جلب منتج معين حسب الـ ID (متاح للجميع)
 tabletRouter.get(
  "/amazon-tablet/:id",isAuthentication,isAuthorization([roles.USER]),
  asyncHandler(tabletService.getTabletById)
);
//get recommend tablet
tabletRouter.get(
  "/recommend-tablet/:tabletId",
  isAuthentication,
  isAuthorization([roles.USER]),
  isValid(tableValidation.getRecommendTablet),
  asyncHandler(tabletService.getRecommendTablet)
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
