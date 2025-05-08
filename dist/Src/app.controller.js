"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const dbconnection_1 = __importDefault(require("../Database/dbconnection"));
const seed_1 = require("../Database/seed");
const seedMobile_1 = require("../Database/seedMobile");
const seedTablet_1 = require("../Database/seedTablet");
const seedTv_1 = require("../Database/seedTv");
const asyncHandler_1 = require("./Middleware/asyncHandler");
const Modules_1 = require("./Modules");
const bootstrap = async (app, express) => {
    //-----------------------------------------------parse------------------------------------------------------------
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    dotenv_1.default.config({ path: path_1.default.resolve("./config/.env") });
    app.use((0, cors_1.default)({
        origin: '*',
    }));
    //-----------------------------------------------DataBase Connection------------------------------------------------------------
    await (0, seed_1.startSeeding)();
    await (0, seedTv_1.startSeedingTv)();
    await (0, seedMobile_1.startSeedingMobile)();
    await (0, seedTablet_1.startSeedingTablet)();
    await (0, dbconnection_1.default)();
    //----------------------------------------------- Use the auth router------------------------------------------------------------
    app.use('/api/v1', Modules_1.userRouter);
    app.use("/api/v1/products", Modules_1.productRouter);
    app.use("/api/v1/mobiles", Modules_1.mobileRouter);
    app.use("/api/v1/tablets", Modules_1.tabletRouter);
    app.use("/api/v1/televisions", Modules_1.televisionRouter);
    app.use("/api/v1", Modules_1.wishlistRouter);
    app.use('/api/v1/compare', Modules_1.compareRouter);
    app.use("/api/v1/contact-us", Modules_1.contactRouter);
    //-----------------------------------------------globalErrorHandling------------------------------------------------------------
    app.use(asyncHandler_1.globalErrorHandling);
};
exports.default = bootstrap;
