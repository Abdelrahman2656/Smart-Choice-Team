import { Router } from "express";
import * as mobileService from "./mobile.service";
import * as mobileValidation from "./mobile.validation";
import { isAuthentication } from "../../Middleware/authentication";
import { isAuthorization } from "../../Middleware/authorization";
import { asyncHandler } from "../../Middleware/asyncHandler";
import { roles } from "../../Utils/constant/enum";
import { isValid } from "../../Middleware/validation";

const mobileRouter = Router();

// 🟢 إنشاء منتج (متاح فقط للمسؤولين)
mobileRouter.post(
  "/",
  isAuthentication,
  isAuthorization([roles.ADMIN]),
  asyncHandler(mobileService.createMobile)
);

// 🟢 جلب كل المنتجات (متاح للجميع)
mobileRouter.get(
  "/amazon-mobile",
  isAuthentication,
  isAuthorization([roles.USER]),
  asyncHandler(mobileService.getAllMobiles)
);

// 🟢 جلب منتج معين حسب الـ ID (متاح للجميع)
mobileRouter.get(
  "/:id",
  isAuthentication,
  isAuthorization([roles.USER]),
  asyncHandler(mobileService.getMobileById)
);
//get recommend Mobile
mobileRouter.get(
  "/recommend-mobile/:mobileId",
  isAuthentication,
  isAuthorization([roles.USER]),
  isValid(mobileValidation.getRecommendMobile),
  asyncHandler(mobileService.getRecommendMobile)
);
// 🟢 تحديث منتج معين (متاح فقط لـ ADMIN)
mobileRouter.put(
  "/:id",
  isAuthentication,
  isAuthorization([roles.ADMIN]),
  asyncHandler(mobileService.updateMobile)
);

// 🟢 حذف منتج معين (متاح فقط لـ ADMIN)
mobileRouter.delete(
  "/:id",
  isAuthentication,
  isAuthorization([roles.ADMIN]),
  asyncHandler(mobileService.deleteMobile)
);

export default mobileRouter;
