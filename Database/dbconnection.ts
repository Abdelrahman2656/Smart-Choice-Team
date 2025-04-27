import { connect } from "mongoose";


 async function dbconnection  (){
    await connect(process.env.DATABASE_DB as string).then(()=>{
        console.log('db connected successfully');
        
    }).catch((error)=>{
        console.log('Failed to connect to DB', error);
        
    })
}
export default dbconnection