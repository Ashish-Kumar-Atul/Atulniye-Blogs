const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required: true,
        unique:true,
        trim:true
    },
    fullName:{
        type:String,
        unique:true,
        trim:true
    },
    email:{
        type:String,
        required: true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required: true,
    },
    loggedInBefore:{
        type:Boolean,
        default:false
    },
    phone:{
        type:Number,
    },
    website:{
        type:String,
    },
    bio:{
        type:String,
    },
    twitter:{
        type:String,
    },
    github:{
        type:String,
    },
    linkedin:{
        type:String,
    },
    instagram:{
        type:String,
    },
    profilePhoto:{
        data: Buffer,
        contentType: String
    },
},{timestamps:true})

module.exports = mongoose.model('User',userSchema)