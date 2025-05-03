import { Router } from "express";
import * as contactService from "./contact.service"
import * as contactValidation from "./contact.validation"
import { isAuthentication } from "../../Middleware/authentication";
import { isAuthorization } from "../../Middleware/authorization";
import { roles } from "../../Utils/constant/enum";
import { isValid } from "../../Middleware/validation";
import { asyncHandler } from "../../Middleware/asyncHandler";
const contactRouter = Router()


//add contact 
contactRouter.post("/",isAuthentication,isAuthorization([roles.USER]),isValid(contactValidation.addContact),asyncHandler(contactService.addContact))
export default contactRouter