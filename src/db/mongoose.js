const mongoose =require('mongoose');
const dbConfig =require('../../config/db.config')
mongoose.connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`,{
    useNewUrlParser:true,
    useCreateIndex:true
}).then((result)=>{
    console.log('connected to mongodb')
}).catch((e)=>{
    console.log('cannot connect to mongodb')
})
