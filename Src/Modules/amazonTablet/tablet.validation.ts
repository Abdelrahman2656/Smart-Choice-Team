import joi from "joi";
import { generalFields } from "../../Utils/generalFields/generalFields";


export const getRecommendTablet = joi.object({
    tabletId:generalFields.objectId.required()
}).required()