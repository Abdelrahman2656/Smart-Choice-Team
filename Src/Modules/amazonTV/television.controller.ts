import { Router } from "express";
import * as televisionService from "./television.service";
import * as televisionValidation from './television.validation'
import { isAuthentication } from "../../Middleware/authentication";
import { isAuthorization } from "../../Middleware/authorization";
import { asyncHandler } from "../../Middleware/asyncHandler";
import { roles } from "../../Utils/constant/enum";
import { isValid } from "../../Middleware/validation";


const televisionRouter = Router();

// 🟢 إنشاء منتج (متاح فقط للمسؤولين)
 televisionRouter.post(
  "/",
  isAuthentication,
  isAuthorization([roles.ADMIN]),
  asyncHandler(televisionService.createTelevision)
);

// 🟢 جلب كل المنتجات (متاح للجميع)
 televisionRouter.get(
  "/amazon-television",isAuthentication,isAuthorization([roles.USER]),
  asyncHandler(televisionService.getAllTelevisions)
);

// 🟢 جلب منتج معين حسب الـ ID (متاح للجميع)
 televisionRouter.get(
  "/amazon-television/:id",isAuthentication,isAuthorization([roles.USER]),
  asyncHandler(televisionService.getTelevisionById)
);
//get recommend Mobile
televisionRouter.get(
  "/recommend-television/:tvId",
  isAuthentication,
  isAuthorization([roles.USER]),
  isValid(televisionValidation.getRecommendTv),
  asyncHandler(televisionService.getRecommendTelevision)
);
// 🟢 تحديث منتج معين (متاح فقط لـ ADMIN)
 televisionRouter.put(
  "/:id",
  isAuthentication,
  isAuthorization([roles.ADMIN]),
  asyncHandler(televisionService.updateTelevision)
);

// 🟢 حذف منتج معين (متاح فقط لـ ADMIN)
 televisionRouter.delete(
  "/:id",
  isAuthentication,
  isAuthorization([roles.ADMIN]),
  asyncHandler(televisionService.deleteTelevision)
);

export default  televisionRouter;
