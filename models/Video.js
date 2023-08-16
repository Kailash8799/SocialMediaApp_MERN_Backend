const mongoose = require('mongoose');

const VideoSchema = mongoose.Schema({
    uid:{type:String,required:true},
    profileId:{type: mongoose.Schema.Types.ObjectId,ref:'Profile'},
    videoLink:{type:String,required:true},
    comments:{type:Array},
    likes:{type:Array},
    tagged:{type:Array},
    caption:{type:String},
    hashtags:{type:Array}
},{timestamps: true})

const Video = mongoose.model("Video",VideoSchema)

module.exports = Video

