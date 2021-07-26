const jwt =require('jsonwebtoken')
const Admin =require('../models/admin')
const authConfig = require('../../config/auth.config')

const authAdmin = async (req,res,next)=>{
    try{
        const token =req.header('Authorization').replace('Bearer ', '')
        // console.log('hi',token);
        const decoded=jwt.verify(token,authConfig.secret)
        const admin=await Admin.findOne({_id:decoded._id,'tokens.token':token})
        if(!admin){
            throw new Error()
        }
        req.token =token
        req.admin=admin
        next()
    }catch(e){
        res.status(400).send({message:'Please Authenticate'})
    }
}

module.exports=authAdmin