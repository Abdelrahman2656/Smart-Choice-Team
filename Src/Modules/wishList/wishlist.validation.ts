import joi from "joi";
import { generalFields } from "../../Utils/generalFields/generalFields";
//add wishlist
export const addWishlist = joi.object({
    productId:generalFields.objectId.required(),
    modelType:joi.string()
})
