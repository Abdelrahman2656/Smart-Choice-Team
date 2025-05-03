import { Contact, User } from "../../../Database";
import { AppError } from "../../Utils/AppError/AppError";
import { messages } from "../../Utils/constant/messages";
import { contactUsEmail } from "../../Utils/Email/emailEvent";
import { Encrypt } from "../../Utils/encryption";
import { AppNext, AppRequest, AppResponse } from "../../Utils/type";

export const addContact = async(req:AppRequest,res:AppResponse,next:AppNext
)=>{
//get data from req 
let {firstName , lastName , phone , message , email} = req.body
//check Exist
const userExist = await User.findOne({email})
if(!userExist){
    return next(new AppError(messages.user.notFound,404))
}
//crypto his number
let cipherText =Encrypt({key:phone , secretKey:process.env.SECRET_CRYPTO})
//prepare data 
const contact = new Contact({
    firstName, 
    lastName,
    phone:cipherText || undefined,
    email,
    message
})
//save in db
const contactCreated = await contact.save()
if(!contactCreated){
return next(new AppError(messages.contact.failToCreate,500))
}
//send email
await contactUsEmail(email,firstName,lastName,phone,message)
//send response
return res.status(200).json({message:messages.contact.createdSuccessfully , success:true , contactData:contactCreated})

}