import { model, Schema } from "mongoose";
import {  provider, roles } from "../../Src/Utils/constant/enum";

//schema
interface IUser{
firstName:string,
lastName:string,
email:string,
password?:String,
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
provider:{
    type:String,
    enum:Object.values(provider),
    default:provider.SYSTEM
},
password:{
    type:String,
    required: function(this: any) {
        return this.provider === provider.SYSTEM;
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
    default: () => new Date().toISOString() 
},
otpEmail:String,
expiredDateOtp:Date
})
//model
export const User = model<IUser>('User',userSchema)