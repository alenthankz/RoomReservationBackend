const express = require('express')
const router = express.Router();
const Admin =require('../models/admin')
const authHelp = require('../helper/auth.helper')
const authConfig = require('../../config/auth.config')
const isAdmin = require('../middlewares/isAdmin');
const Booking = require('../models/booking');
const User = require('../models/user');


router.post('/admin/signup',async (req,res)=>{
    admin = await Admin.findOne({username:req.body.username})
    if(admin){
        res.status(400).send({message:'Existing Email'})
    }
    admin = new Admin(req.body)
    try{
        await admin.save()
        // const token =await authHelp.generateAuthToken(admin)
        res.status(200).send(authHelp.toJSON(admin,null,authConfig.expiresIn.expiresIn))
    }catch(e){
         res.status(400).send(e)
    }
})

router.post('/admin/login',async (req,res)=>{
    try{
         const admin = await authHelp.findByCredentailsAdmin(req.body.username,req.body.password)
         const token =await authHelp.generateAuthToken(admin)
         res.status(200).send(authHelp.toJSON(admin,token,authConfig.expiresIn.expiresIn))
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/admin/allbookings',isAdmin,async (req,res)=>{
    try{
        var searchBy=req.body;
        // console.log(searchBy)
        if(req.body.username ){
            user = await User.findOne(searchBy)
            searchBy={};
            searchBy['owner']=user._id;
        }
        
        bookings=await Booking.find(searchBy).populate({
            path:'owner',
             options:{
            //     limit:parseInt(req.query.limit),
            //     skip:parseInt(req.query.skip),
                   sort:{_createdAt:-1}
            }
        }).exec();
        res.send(bookings)
    }catch(e){
        res.status(400).send({message:"Oops Some error occured !"})
    }
})

router.post('/admin/booking',isAdmin,async(req,res)=>{
    try{
        book =await Booking.findOne({_id:req.body.id}).populate({path:'owner',}).exec();
        res.send(book);
    }catch(e){
        res.status(400).send({message:"Oops Some error occured !"})
    }
})

router.post('/admin/logout',isAdmin,async (req,res)=>{
    try{
        req.admin.tokens =req.admin.tokens.filter((token)=>{
            return !token==req.token
        })
        await req.admin.save()
        res.status(200).send()
    }catch(e){
        res.status(500).send({message:'Unable to logout'})
 
    }
})




module.exports=router