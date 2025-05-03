import { Router } from "express";
import * as compareService from "./compare.service"
import { isAuthentication } from "../../Middleware/authentication";
import { isAuthorization } from "../../Middleware/authorization";
import { roles } from "../../Utils/constant/enum";
import { asyncHandler } from "../../Middleware/asyncHandler";

const compareRouter = Router()

//compare product 
compareRouter.post("/",isAuthentication,isAuthorization([roles.USER]),asyncHandler(compareService.compareProducts))

export default compareRouter