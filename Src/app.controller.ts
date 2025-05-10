import cors from 'cors';
import dotenv from "dotenv";
import { Application } from "express";
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import path from "path";
import dbconnection from '../Database/dbconnection';
import { startSeeding } from '../Database/seed';
import { startSeedingMobile } from '../Database/seedMobile';
import { startSeedingTablet } from '../Database/seedTablet';
import { startSeedingTv } from '../Database/seedTv';
import { globalErrorHandling } from "./Middleware/asyncHandler";
import { compareRouter, contactRouter, mobileRouter, productRouter, tabletRouter, televisionRouter, userRouter, wishlistRouter } from "./Modules";
import { AppNext, AppRequest, AppResponse } from './Utils/type';
import { AppError } from './Utils/AppError/AppError';


 const bootstrap = async ( 
  app: Application,
  express: typeof import("express")
) => {
    //-----------------------------------------------rater limit------------------------------------------------------------
  app.use(rateLimit({
    windowMs:1 * 60 * 1000, 
    limit:50,
    message:"Too many requests from this IP, please try again later",
    statusCode:400,
    handler:(req:AppRequest,res:AppResponse,next:AppNext,options)=>{
      return next(new AppError(options.message,options.statusCode))
    }
  }))
  //-----------------------------------------------morgan------------------------------------------------------------
if (process.env.MODE === "DEV") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.MODE}`);
}
  //-----------------------------------------------parse------------------------------------------------------------
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  dotenv.config({ path: path.resolve("./config/.env") });

  app.use(cors({
    origin: '*', 
  }));

  //-----------------------------------------------DataBase Connection------------------------------------------------------------
  await startSeeding();
  await startSeedingTv()
  await startSeedingMobile()
  await startSeedingTablet()
  await dbconnection(); 
  

  //----------------------------------------------- Use the auth router------------------------------------------------------------
  app.use('/api/v1', userRouter);
  app.use("/api/v1/products", productRouter);
  app.use("/api/v1/mobiles", mobileRouter);
  app.use("/api/v1/tablets", tabletRouter);
  app.use("/api/v1/televisions", televisionRouter);
  app.use("/api/v1",wishlistRouter)
  app.use('/api/v1/compare',compareRouter)
  app.use("/api/v1/contact-us",contactRouter)
  //-----------------------------------------------globalErrorHandling------------------------------------------------------------
  app.use(globalErrorHandling as any);
};
export default bootstrap