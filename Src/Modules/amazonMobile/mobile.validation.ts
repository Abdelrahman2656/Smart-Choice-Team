import joi from "joi";
import { generalFields } from "../../Utils/generalFields/generalFields";


//get recommend mobile
export const getRecommendMobile = joi.object({
    mobileId:generalFields.objectId.required()
}).required()