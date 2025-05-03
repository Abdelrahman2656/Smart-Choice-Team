import joi from "joi";
import { generalFields } from "../../Utils/generalFields/generalFields";


export const addContact = joi.object({
    firstName:generalFields.firstName.required(),
    lastName:generalFields.lastName.required(),
    phone:generalFields.phone.optional(),
    message:generalFields.message.required(),
    email:generalFields.email.required()
}).required()