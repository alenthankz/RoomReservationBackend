const jwt =require('jsonwebtoken')
const User =require('../models/user')
const authConfig = require('../../config/auth.config')

const authUser = async (req,res,next)=>{
    try{
        const token =req.header('Authorization').replace('Bearer ', '')
        const decoded=jwt.verify(token,authConfig.secret)
        const user=await User.findOne({_id:decoded._id,'tokens.token':token})
        if(!user){
            throw new Error()
        }
        req.token =token
        req.user=user
        next()
    }catch(e){
        res.status(400).send({message:'Please Authenticate'})
    }
}

module.exports=authUser