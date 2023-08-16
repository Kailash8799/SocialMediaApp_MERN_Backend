const mongoose = require('mongoose');

const TweetSchema = mongoose.Schema({
    uid:{type:String,required:true},
    profileId:{type: mongoose.Schema.Types.ObjectId,ref:'Profile'},
    tweet:{type:String,required:true},
    comments:{type:Array},
    likes:{type:Array},
    hashtags:{type:Array},
},{timestamps: true})

const Tweet = mongoose.model("Tweet",TweetSchema)

module.exports = Tweet

