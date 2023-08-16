const mongoose = require("mongoose");

const LikeTweetSchema = mongoose.Schema(
  {
    uid: { type: String, required: true },
    profileId:{type: mongoose.Schema.Types.ObjectId,ref:'Profile'},
    postid:{ type: String, required: true }
  },
  { timestamps: true }
);

const LikeTweet = mongoose.model("LikeTweet", LikeTweetSchema);

module.exports = LikeTweet;
