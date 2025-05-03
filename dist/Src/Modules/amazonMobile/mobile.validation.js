"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecommendMobile = void 0;
const joi_1 = __importDefault(require("joi"));
const generalFields_1 = require("../../Utils/generalFields/generalFields");
//get recommend mobile
exports.getRecommendMobile = joi_1.default.object({
    mobileId: generalFields_1.generalFields.objectId.required()
}).required();
