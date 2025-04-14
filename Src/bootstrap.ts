import cors from 'cors';
import dotenv from "dotenv";
import { Application } from "express";
import path from "path";

import { dbconnection } from '../Database/dbconnection';
import { startSeeding } from '../Database/seed';

import { globalErrorHandling } from "./Middleware/asyncHandler";
import { productRouter, userRouter } from "./Modules";

export const bootstrap = async ( // ✅ إضافة async هنا
  app: Application,
  express: typeof import("express")
) => {
  //-----------------------------------------------parse------------------------------------------------------------
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  dotenv.config({ path: path.resolve("./.env") });

  app.use(cors({
    origin: '*', 
  }));

  //-----------------------------------------------DataBase Connection------------------------------------------------------------
 await startSeeding();
  
  await dbconnection(); // ✅ الآن يمكن استخدام await بدون مشاكل

  //----------------------------------------------- Use the auth router------------------------------------------------------------
  app.use('/api/v1', userRouter);
  app.use("/api/v1/products", productRouter);


  //-----------------------------------------------globalErrorHandling------------------------------------------------------------
  app.use(globalErrorHandling as any);
};
