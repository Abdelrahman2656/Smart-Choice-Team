import joi from "joi";
import { generalFields } from "../../Utils/generalFields/generalFields";



//get recommend mobile
export const getRecommendTv = joi.object({
    tvId:generalFields.objectId.required()
}).required()