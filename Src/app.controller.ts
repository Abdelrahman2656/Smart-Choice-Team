import cors from 'cors';
import dotenv from "dotenv";
import { Application, Request, Response } from "express";
import path from "path";
import dbconnection from '../Database/dbconnection';
import { startSeeding } from '../Database/seed';
import { startSeedingMobile } from '../Database/seedMobile';
import { startSeedingTablet } from '../Database/seedTablet';
import { startSeedingTv } from '../Database/seedTv';
import { globalErrorHandling } from "./Middleware/asyncHandler";
import { mobileRouter, productRouter, tabletRouter, televisionRouter, userRouter, wishlistRouter } from "./Modules";

export interface AppRequest extends Request {
  // إذا كنت محتاج تضيف حاجات مخصصة هنا
}

export interface AppResponse extends Response {
  // إذا كنت محتاج تضيف حاجات مخصصة هنا
}
 const bootstrap = async ( // ✅ إضافة async هنا
  app: Application,
  express: typeof import("express")
) => {
  //-----------------------------------------------parse------------------------------------------------------------
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  dotenv.config({ path: path.resolve("./config/.env") });

  app.use(cors({
    origin: '*', 
  }));

  app.get('/', (req: AppRequest, res: AppResponse) => {
    res.send('Hello World In My Smart Choice App');
  });
  //----------------------------------------------- Use the auth router------------------------------------------------------------
  app.use('/api/v1', userRouter);
  app.use("/api/v1/products", productRouter);
  app.use("/api/v1/mobiles", mobileRouter);
  app.use("/api/v1/tablets", tabletRouter);
  app.use("/api/v1/televisions", televisionRouter);
  app.use("/api/v1",wishlistRouter)
  
  //-----------------------------------------------DataBase Connection------------------------------------------------------------
  await startSeeding();
  await startSeedingTv()
  await startSeedingMobile()
  await startSeedingTablet()
   dbconnection(); 
  

  //-----------------------------------------------globalErrorHandling------------------------------------------------------------
  app.use(globalErrorHandling as any);
};
export default bootstrap