const mongoose = require("mongoose");

const CommentTweetSchema = mongoose.Schema(
  {
    uid: { type: String, required: true },
    profileId: { type: String, required: true },
    postid: { type: String, required: true },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const CommentOnTweet = mongoose.model("CommentOnTweet", CommentTweetSchema);

module.exports = CommentOnTweet;
