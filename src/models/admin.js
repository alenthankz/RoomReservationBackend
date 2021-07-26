const mongoose =require('mongoose');
const { default: validator } = require('validator');
const bcrypt =require('bcryptjs')

adminSchema=mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true
    },
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        validate(value){
            if (!validator.isEmail(value)){
                throw new Error({message:'Invalid Email'});
            }
        }
    },
    password:{
        type:String,
        trim:true,
        minlength:8,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error ({message:"Password cannot contain 'password'"})
            }
        }
    },
    tokens:[{
        token:String,
        //required:true
    }],
   
},{
    timestamps:true
})

adminSchema.pre('save',async function(next){
    const admin =this
    if(admin.isModified('password')){
        admin.password =await bcrypt.hash(admin.password,8)
    }
    next()
})

const Admin =mongoose.model('Admin',adminSchema)
module.exports =Admin