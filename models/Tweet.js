const mongoose = require('mongoose');

const TweetSchema = mongoose.Schema({
    uid:{type:String,required:true},
    profileId:{type:String,required:true},
    tweet:{type:String,required:true},
    comments:{type:Array},
    likes:{type:Array},
    hashtags:{type:Array},
},{timestamps: true})

const Tweet = mongoose.model("Tweet",TweetSchema)

module.exports = Tweet

