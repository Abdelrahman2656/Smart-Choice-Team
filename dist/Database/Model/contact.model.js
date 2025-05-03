"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contact = void 0;
const mongoose_1 = require("mongoose");
//schema
const contactSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 15,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 15,
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
    },
    message: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 300
    },
    phone: {
        type: String,
        unique: true,
        trim: true,
        sparse: true,
    }
}, {
    timestamps: true
});
//model
exports.Contact = (0, mongoose_1.model)('Contact', contactSchema);
