const mongoose = require("mongoose");

const CommentTweetSchema = mongoose.Schema(
  {
    uid: { type: String, required: true },
    profileId:{type: mongoose.Schema.Types.ObjectId,ref:'Profile'},
    postid: { type: String, required: true },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const CommentOnTweet = mongoose.model("CommentOnTweet", CommentTweetSchema);

module.exports = CommentOnTweet;
