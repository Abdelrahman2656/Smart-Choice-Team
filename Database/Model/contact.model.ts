import { model, Schema } from "mongoose"

//interface
interface Icontact{
    firstName:string,
    lastName:string,
    email:string,
    phone:string,
    message:string
}

//schema
const  contactSchema = new Schema<Icontact>({
firstName:{
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 15,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 15,
  },
  email: {
    type: String,
    lowercase: true,
    
    required: true,
  },
  message:{
    type:String,
    required:true,
    trim:true,
    minlength:5,
    maxlength:300
  },
  phone:{
    type:String,
    unique: true,
    trim: true,
    sparse: true,
   
  }
},{
    timestamps:true
})


//model
export const Contact = model<Icontact>('Contact',contactSchema)