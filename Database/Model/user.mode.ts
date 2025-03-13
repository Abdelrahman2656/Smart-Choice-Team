import { model, Schema } from "mongoose";
import { gender, provider, roles } from "../../Src/Utils/constant/enum";

//schema
interface IUser{
firstName:string,
lastName:string,
email:string,
password:String,
isConfirmed:boolean,
isDeleted:boolean;
role:string
otpEmail:String
expiredDateOtp:Date
DOB:string,
provider:string
}

const userSchema = new Schema<IUser>({
firstName:{
    type:String,
    required:true,
    trim:true,
    minlength:3,
    maxlength:15

},
lastName:{
    type:String,
    required:true,
    trim:true,
    minlength:3,
    maxlength:15
},
email:{
    type:String,
    lowercase:true,
    unique:true,
    required:true
},
password:{
    type:String,
    required:function(){
    return this.provider == provider.SYSTEM ? true : false
    },
    trim:true
},

role:{
    type:String,
    enum:Object.values(roles),
    default:roles.USER
},
isConfirmed:{
    type:Boolean,
    default:false
},

isDeleted: {
    type: Boolean,
    default: false
},
DOB: {
    type: String,
    default: () => new Date().toISOString() // ISO format string of the current date and time
},
provider:{
    type:String,
    enum:Object.values(provider),
default:provider.SYSTEM
},
otpEmail:String,
expiredDateOtp:Date
})
//model
export const User = model<IUser>('User',userSchema)