

import chalk from "chalk"
import bootstrap from "./Src/app.controller"

import { AppRequest, AppResponse } from "./Src/Utils/type"
const express = require('express')
const app = express()
const port = process.env.PORT||3001

//bootstrap
bootstrap(app, express)
export default app
app.get('/', (req:AppRequest, res:AppResponse) => res.send('Hello World In My Smart Choice App'))
app.listen(port, () => {
   console.log( chalk.blue("Example app listening on port "),chalk.redBright(port));
   
})