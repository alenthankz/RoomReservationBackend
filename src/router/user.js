const express = require('express')
const router = express.Router();
const User =require('../models/user')
const ID =require('../models/id')
const authHelp = require('../helper/auth.helper')
const authConfig = require('../../config/auth.config')
const isUser = require('../middlewares/isUser');
const Booking = require('../models/booking');
const { find } = require('../models/booking');

router.post('/user/signup',async (req,res)=>{

    var today = new Date();
    var birthDate = new Date(req.body.dob)
    // console.log(birthDate)
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }    
    if(age<18)
    {   res.status(400).send({message:'You Must Be Atleast 18 to Book a Room '});
        return;
    }
    // let todayDate = new Date();
    // let ageDate = req.body.dob.split("/");
    // let yr =todayDate.getFullYear()-ageDate[2];
    // if(yr<18)res.status(400).send({message:'You Must Be Atleast 18 to Book a Room '});

    user = await User.findOne({username:req.body.username})
    if(user){
        res.status(400).send({message:'Existing Email'});
    }
    user = new User(req.body)
    try{
        await user.save()
        const token =await authHelp.generateAuthToken(user)
        res.status(200).send(authHelp.toJSON(user,token,authConfig.expiresIn.expiresIn))
    }catch(e){
         res.status(400).send(e)
    }
})

router.post('/id',async (req,res)=>{

    const id = new ID(req.body)
    try{
        await id.save()
        res.status(200).send("ID Created")
    }catch(e){
         res.status(400).send(e)
    }
})

router.post('/user/login',async (req,res)=>{
    try{
         const user = await authHelp.findByCredentailsUser(req.body.username,req.body.password)
         const token =await authHelp.generateAuthToken(user)
         res.status(200).send(authHelp.toJSON(user,token,authConfig.expiresIn.expiresIn))
    }catch(e){
        res.status(400).send({message:'Incorrect Credentials'})
    }
})

router.get('/id',async(req,res)=>{
    try{
        let ids = await ID.find({});
        let lastid=ids[0];
        lastid.last=lastid.last+1;
         await lastid.save(); 
        res.send(lastid);

    }catch(e){
        res.status(400).send(e);
    }

   
})


router.post('/user/booking',isUser,async (req,res)=>{

    // const booking =new Booking({
    //     ...req.body,
    //     owner:req.user._id
    // })
    
    try{
        let ids = await ID.find({});
        let lastid=ids[0];
        lastid.last=lastid.last+1;
        let bookingId=lastid.last;
        await lastid.save(); 
        const booking =new Booking({
            bookingid:bookingId,
            ...req.body,
            owner:req.user._id
        })
        await booking.save()
        res.send(booking);
    }catch(e){
        res.status(400).send({message:'Booking Unsuccessful'})
    }
    
})

router.post('/user/logout',isUser,async (req,res)=>{
    try{
        req.user.tokens =req.user.tokens.filter((token)=>{
            return !token==req.token
        })
        await req.user.save()
        res.status(200).send()
    }catch(e){
        res.status(500).send({message:'Unable to logout'})
 
    }
})



module.exports=router