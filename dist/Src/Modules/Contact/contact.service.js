"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addContact = void 0;
const Database_1 = require("../../../Database");
const AppError_1 = require("../../Utils/AppError/AppError");
const messages_1 = require("../../Utils/constant/messages");
const emailEvent_1 = require("../../Utils/Email/emailEvent");
const encryption_1 = require("../../Utils/encryption");
const addContact = async (req, res, next) => {
    //get data from req 
    let { firstName, lastName, phone, message, email } = req.body;
    //check Exist
    const userExist = await Database_1.User.findOne({ email });
    if (!userExist) {
        return next(new AppError_1.AppError(messages_1.messages.user.notFound, 404));
    }
    //crypto his number
    let cipherText = (0, encryption_1.Encrypt)({ key: phone, secretKey: process.env.SECRET_CRYPTO });
    //prepare data 
    const contact = new Database_1.Contact({
        firstName,
        lastName,
        phone: cipherText || undefined,
        email,
        message
    });
    //save in db
    const contactCreated = await contact.save();
    if (!contactCreated) {
        return next(new AppError_1.AppError(messages_1.messages.contact.failToCreate, 500));
    }
    //send email
    await (0, emailEvent_1.contactUsEmail)(email, firstName, lastName, phone, message);
    //send response
    return res.status(200).json({ message: messages_1.messages.contact.createdSuccessfully, success: true, contactData: contactCreated });
};
exports.addContact = addContact;
