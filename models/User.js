const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    firstname:{type:String},
    lastname:{type:String},
    birthdate:{type:Date},
    emailVerified:{type:Boolean,default:false},
},{timestamps: true})

const User = mongoose.model("User",UserSchema)

module.exports = User

