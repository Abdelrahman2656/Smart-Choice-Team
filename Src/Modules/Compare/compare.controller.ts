import { Router } from "express";
import * as compareService from "./compare.service"

import { asyncHandler } from "../../Middleware/asyncHandler";

const compareRouter = Router()

//compare product 
compareRouter.post("/",asyncHandler(compareService.compareProducts))

export default compareRouter