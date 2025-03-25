import cors from 'cors';
import dotenv from "dotenv";
import { Application } from "express";
import path from "path";
import { globalErrorHandling } from "./Middleware/asyncHandler";
import { productRouter, userRouter } from "./Modules";
import { dbconnection } from '../Database/dbconnection';
import { startSeeding } from '../Database/seed';
export const bootstrap = async(
  app: Application,
  express: typeof import("express")
) => {
  //-----------------------------------------------DataBase Connection------------------------------------------------------------
  console.log("⏳LOADING");
 await dbconnection()
 console.log("✅✌️ تم الاتصال بقاعدة البيانات بنجاح!");
  //-----------------------------------------------parse------------------------------------------------------------
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  dotenv.config({ path: path.resolve("./.env") });
  app.use(cors({
   origin: '*', 
 }));
  startSeeding()
 //----------------------------------------------- Use the auth router------------------------------------------------------------

 app.use('/api/v1',userRouter);
 app.use("/api/v1/products", productRouter);
  //-----------------------------------------------globalErrorHandling------------------------------------------------------------
  app.use(globalErrorHandling as any);
};
