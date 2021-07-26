const mongoose =require('mongoose');
const { default: validator } = require('validator');
const Booking = require('../models/booking')
const bcrypt =require('bcryptjs')

userSchema=mongoose.Schema({
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
    dob:{
        type:String,
        trim:true
    },
    phNum:{
        type:Number,
        trim:true
    },
    proofType:{
        type:String,
        trim:true
    },
    proofValue:{
        type:String,
        trim:true
    },
    tokens:[{
        token:String,
    }],
   
},{
    timestamps:true
})


userSchema.virtual('bookings', {
    ref: 'Booking',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.pre('save',async function(next){
    const user =this
    if(user.isModified('password')){
        user.password =await bcrypt.hash(user.password,8)
    }
    next()
})

userSchema.pre('delete',async function(next){
    const user =this
    await Booking.deleteMany({owner:user._id})
    next()
})


const User =mongoose.model('User',userSchema)
module.exports =User

