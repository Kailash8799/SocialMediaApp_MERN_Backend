const mongoose = require('mongoose');

const ImageSchema = mongoose.Schema({
    uid:{type:String,required:true},
    profileId:{type:String,required:true},
    imageLink:{type:String,required:true},
    comments:{type:Array},
    likes:{type:Array},
    tagged:{type:Array},
    caption:{type:String},
    hashtags:{type:Array}
},{timestamps: true})

const Image = mongoose.model("Image",ImageSchema)

module.exports = Image

