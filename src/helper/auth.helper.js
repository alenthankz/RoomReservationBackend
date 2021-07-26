const User = require('../models/user')
const Admin = require('../models/admin')
const authConfig = require('../../config/auth.config')
const bcrypt =require('bcryptjs')
const jwt =require('jsonwebtoken');


generateAuthToken =async function(role){
    // const user =this
    const token = jwt.sign({_id:role._id.toString()},authConfig.secret ,authConfig.expiresIn)
    role.tokens=role.tokens.concat({token})
    await role.save()
    return token
}
toJSON =function(role,token,expiresIn){
    // const user =this;
    const roleObject= role.toObject()
    roleObject.expiresIn=expiresIn;
    roleObject.token=token;
    delete roleObject.password
    delete roleObject.tokens
    delete roleObject.createdAt
    delete roleObject.updatedAt
    delete roleObject.__v
    return roleObject
}

findByCredentailsUser= async(username,password)=>{
     user = await User.findOne({username:username})
    if (!user){
        throw new Error({message:'Unable to login'})
    }
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new Error({message:'Unable to login'})
    }
    return user
}

findByCredentailsAdmin= async(username,password)=>{
    admin = await Admin.findOne({username:username})
   if (!admin){
       throw new Error({message:'Unable to login'})
   }
   const isMatch = await bcrypt.compare(password,admin.password)
   
   if(!isMatch){
       throw new Error({message:'Unable to login'})
   }


   return admin
}


module.exports={
    findByCredentailsAdmin,
    findByCredentailsUser,
    toJSON,
    generateAuthToken
}