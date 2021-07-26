const express =require('express')
const app =express()
const bodyParser = require("body-parser");
const cors = require("cors");

require('./db/mongoose')



app.use(express.json())
var corsOptions = {
    origin: "http://localhost:4200"
};
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));

 
const userRouter =require('./router/user')
const adminRouter =require('./router/admin')
 
 app.use(userRouter)
 app.use(adminRouter)




const port =process.env.PORT || 3000;
app.listen(port,()=>{
    console.log('port '+port+ ' listening');
})