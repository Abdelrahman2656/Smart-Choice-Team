import joi from "joi";
import { generalFields } from "../../Utils/generalFields/generalFields";


export const getRecommendLaptop = joi.object({
    productId :generalFields.objectId.required()
}).required()