const mongoose = require("mongoose");

const CommentImageSchema = mongoose.Schema(
  {
    uid: { type: String, required: true },
    profileId:{type: mongoose.Schema.Types.ObjectId,ref:'Profile'},
    postid: { type: String, required: true },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const CommentOnImage = mongoose.model("CommentOnImage", CommentImageSchema);

module.exports = CommentOnImage;
