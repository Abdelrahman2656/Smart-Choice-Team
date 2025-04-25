import { connect } from "mongoose";


 async function dbconnection  (){
  return  await connect(process.env.DATABASE_DB as string).then(()=>{
        console.log('db connected successfully');
        
    }).catch(()=>{
        console.log('failed to connected to db');
        
    })
}
export default dbconnection