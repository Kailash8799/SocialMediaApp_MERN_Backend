const mongoose = require("mongoose");

const ProfileSchema = mongoose.Schema(
  {
    userid: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    useremail: { type: String, required: true, unique: true },
    followers: { type: Array },
    following: { type: Array },
    savedpost: { type: Array },
    videos: { type: Array },
    profileImage: { type: String },
    tweets: { type: Array },
    images: { type: Array },
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", ProfileSchema);

module.exports = Profile;
