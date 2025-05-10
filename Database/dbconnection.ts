import chalk from "chalk";
import { connect } from "mongoose";


 async function dbconnection  (){
    await connect(process.env.DATABASE_DB as string).then(()=>{
        console.log(chalk.yellow('connected to db Successfully'));
        
    }).catch(()=>{
        console.log(chalk.red('failed to connected to db'));
        
    })
}
export default dbconnection