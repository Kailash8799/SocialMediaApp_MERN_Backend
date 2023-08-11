const mongoose = require("mongoose");

const LikeImageSchema = mongoose.Schema(
  {
    uid: { type: String, required: true },
    profileId: { type: String, required: true },
    postid:{ type: String, required: true }
  },
  { timestamps: true }
);

const LikeImage = mongoose.model("LikeImage", LikeImageSchema);

module.exports = LikeImage;
