

import bootstrap from "./Src/app.controller";
import { AppRequest, AppResponse } from "./Src/Utils/type";
const express = require('express')

const port = process.env.PORT||3001


const app = express();


  bootstrap(app, express);

  app.get('/', (req:AppRequest, res:AppResponse) => res.send('Hello World In My Smart Choice App'))


export default app; // ✅ خلي بالك: ده أهم حاجة