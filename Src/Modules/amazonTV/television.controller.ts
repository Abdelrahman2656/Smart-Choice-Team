import { Router } from "express";
import * as televisionService from "./television.service";
import { isAuthentication } from "../../Middleware/authentication";
import { isAuthorization } from "../../Middleware/authorization";
import { asyncHandler } from "../../Middleware/asyncHandler";
import { roles } from "../../Utils/constant/enum";


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
  "/amazon-television",
  asyncHandler(televisionService.getAllTelevisions)
);

// 🟢 جلب منتج معين حسب الـ ID (متاح للجميع)
 televisionRouter.get(
  "/amazon-television/:id",
  asyncHandler(televisionService.getTelevisionById)
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
