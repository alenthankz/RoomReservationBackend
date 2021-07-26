const mongoose =require('mongoose');
const { default: validator } = require('validator');

bookingSchema=mongoose.Schema({
    bookingid:{
        type:Number,
        required:true,
        trim:true
    },
    fromDate:{
        type:String,
        required:true,
        trim:true
    },
    toDate:{
        type:String,
        required:true,
        trim:true
    },
    typeOfRoom:{
        type:String,
        required:true,
        trim:true
    },
    totalCost:{
        type:Number,
        required:true,
        trim:true
    },
    noBeds:{
        type:Number,
        default:0,
        trim:true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
},{
    timestamps:true
})

bookingSchema.methods.toJSON =function(){
    const book =this;
    const bookObject= book.toObject()
    bookObject.name=bookObject.owner.name;
    bookObject.username=bookObject.owner.username;
    bookObject.dob=bookObject.owner.dob;
    bookObject.phNum=bookObject.owner.phNum;
    bookObject.proofType=bookObject.owner.proofType;
    bookObject.proofValue=bookObject.owner.proofValue;
    delete bookObject.createdAt
    delete bookObject.updatedAt
    delete bookObject.__v
    delete bookObject.owner
    return bookObject
}

const Booking =mongoose.model('Booking',bookingSchema)
module.exports =Booking