"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrap = void 0;
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const dbconnection_1 = require("../Database/dbconnection");
const seed_1 = require("../Database/seed");
const asyncHandler_1 = require("./Middleware/asyncHandler");
const Modules_1 = require("./Modules");
const bootstrap = async (// ✅ إضافة async هنا
app, express) => {
    //-----------------------------------------------parse------------------------------------------------------------
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    dotenv_1.default.config({ path: path_1.default.resolve("./config/.env") });
    //-----------------------------------------------DataBase Connection------------------------------------------------------------
    await (0, seed_1.startSeeding)();
    await (0, dbconnection_1.dbconnection)(); // ✅ الآن يمكن استخدام await بدون مشاكل
    app.use((0, cors_1.default)({
        origin: '*',
    }));
    //----------------------------------------------- Use the auth router------------------------------------------------------------
    app.use('/api/v1', Modules_1.userRouter);
    app.use("/api/v1/products", Modules_1.productRouter);
    //-----------------------------------------------globalErrorHandling------------------------------------------------------------
    app.use(asyncHandler_1.globalErrorHandling);
};
exports.bootstrap = bootstrap;
