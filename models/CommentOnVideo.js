const mongoose = require("mongoose");

const CommentVideoSchema = mongoose.Schema(
  {
    uid: { type: String, required: true },
    profileId: { type: String, required: true },
    postid: { type: String, required: true },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const CommentOnVideo = mongoose.model("CommentOnVideo", CommentVideoSchema);

module.exports = CommentOnVideo;
