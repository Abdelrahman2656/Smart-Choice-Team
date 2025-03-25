import mongoose, { connect } from "mongoose";


export async function dbconnection  (){
    await mongoose.connect(process.env.DATABASE_DB as string).then(()=>{
        console.log('db connected successfully');
        
    }).catch(()=>{
        console.log('failed to connected to db');
        
    })
}
