const mongoose = require("mongoose");

const LikeVideoSchema = mongoose.Schema(
  {
    uid: { type: String, required: true },
    profileId:{type: mongoose.Schema.Types.ObjectId,ref:'Profile'},
    postid:{ type: String, required: true }
  },
  { timestamps: true }
);

const LikeVideo = mongoose.model("LikeVideo", LikeVideoSchema);

module.exports = LikeVideo;
