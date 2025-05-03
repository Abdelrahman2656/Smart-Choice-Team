"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addContact = void 0;
const joi_1 = __importDefault(require("joi"));
const generalFields_1 = require("../../Utils/generalFields/generalFields");
exports.addContact = joi_1.default.object({
    firstName: generalFields_1.generalFields.firstName.required(),
    lastName: generalFields_1.generalFields.lastName.required(),
    phone: generalFields_1.generalFields.phone.optional(),
    message: generalFields_1.generalFields.message.required(),
    email: generalFields_1.generalFields.email.required()
}).required();
