const mongoose =require('mongoose');

idSchema=mongoose.Schema({
    last:{
        type:Number,
        required:true,
        trim:true
    }
})


const ID =mongoose.model('ID',idSchema)
module.exports =ID