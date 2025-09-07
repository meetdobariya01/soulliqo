const mongoose = require ("mongoose");

const ContectUsSchema = new mongoose.Schema({
    YourName:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true
    },
    PhoneNumber:{
        type:Number,
        required:true,
    },

    Message:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model("ContactUs", ContectUsSchema);