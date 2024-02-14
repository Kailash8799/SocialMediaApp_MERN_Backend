const express = require("express");
const router = express.Router();
var REACT_APP_SECRET = process.env.REACT_APP_SECRET;
const Authuser = require("../middleware/authuser");
var JWT_SECRET = process.env.JWT_SECRET;
var jwt = require("jsonwebtoken");
const User = require("../models/User");
const Image = require("../models/Image");
const Profile = require("../models/Profile");
const Video = require("../models/Video");
const Tweet = require("../models/Tweet");
const CommentOnImage = require("../models/CommentOnImage");
const CommentOnVideo = require("../models/CommentOnVideo");
const CommentOnTweet = require("../models/CommentOnText");
const LikeImage = require("../models/LikeImage");
const { default: mongoose } = require("mongoose");
const LikeVideo = require("../models/LikeVideo");
const LikeTweet = require("../models/LikeTweet");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");

router.post("/postimage", Authuser, async (req, res) => {
  try {
    const { secret, token, imageLink, tagged, caption, hashtags } = req.body;
    if (req.method !== "POST" || REACT_APP_SECRET !== secret) {
      res.json({ success: false, message: "Some error accured!" });
      return;
    }
    const decode = jwt.verify(token, JWT_SECRET);
    const { username, email, id, profileid } = decode;
    const user = await User.find(
      { $and: [{ username: username }, { email: email }, { _id: id }] },
      { _id: 0, username: 0, email: 0, password: 0 }
    );
    if (user?.length === 0) {
      res.json({
        success: false,
        message: "Please logout then login and try again!",
      });
      return;
    }
    let newpost = new Image({
      imageLink: imageLink,
      uid: id,
      profileId: new mongoose.Types.ObjectId(profileid),
      tagged: tagged,
      caption: caption,
      hashtags: hashtags,
    });
    const post = await newpost.save();
    const uprofile = await Profile.findOne({
      $and: [{ _id: profileid }, { userid: id }],
    });
    const images = uprofile?.images;
    const newImages = [...images, post?._id];
    await Profile.updateOne(
      { $and: [{ _id: profileid }, { userid: id }] },
      { $set: { images: newImages } },
      { new: true }
    );
    res.json({ success: true, message: "Image uploaded successfully" });
    return;
  } catch (error) {
    res.json({ success: false, message: "Some error accured! catch" });
    return;
  }
});

async function deleteFile(imageurl, filedestination) {
  try {
    let public_id = imageurl.split("/").pop().split(".")[0];
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Some error accured!" });
    return;
  }
}

router.post("/deleteimage", Authuser, async (req, res) => {
  try {
    const { secret, token, imageid } = req.body;
    if (req.method !== "POST" || REACT_APP_SECRET !== secret) {
      res.json({ success: false, message: "Some error accured!" });
      return;
    }
    const decode = jwt.verify(token, JWT_SECRET);
    const { username, email, id, profileid } = decode;
    const user = await User.find(
      { $and: [{ username: username }, { email: email }, { _id: id }] },
      { _id: 0, username: 0, email: 0, password: 0 }
    );
    if (user?.length === 0) {
      res.json({
        success: false,
        message: "Please logout then login and try again!",
      });
      return;
    }
    const post = await Image.find({ _id: imageid });
    if (post?.length === 0) {
      res.json({
        success: false,
        message: "Some error accured please refresh and try again!",
      });
      return;
    }
    await deleteFile(post[0].imageLink, "SocialMediaApp");
    const uprofile = await Profile.findOne({
      $and: [{ _id: profileid }, { userid: id }],
    });
    const images = uprofile?.images;
    await LikeImage.deleteMany({ postid: post[0]?._id });
    await Image.deleteMany({ _id: post[0]?._id });
    await CommentOnImage.deleteMany({ postid: post[0]?._id });
    const newImages = images?.filter(
      (item) => item.toString() !== (post[0]?._id).toString()
    );
    await Profile.updateOne(
      { $and: [{ _id: profileid }, { userid: id }] },
      { $set: { images: newImages } },
      { new: true }
    );
    res.json({ success: true, message: "Image deleted successfully" });
    return;
  } catch (error) {
    res.json({ success: false, message: "Some error accured! catch" });
    return;
  }
});

router.post("/postvideo", Authuser, async (req, res) => {
  try {
    const { secret, token, videoLink, tagged, caption, hashtags } = req.body;
    if (req.method !== "POST" || REACT_APP_SECRET !== secret) {
      res.json({ success: false, message: "Some error accured!" });
      return;
    }
    const decode = jwt.verify(token, JWT_SECRET);
    const { username, email, id, profileid } = decode;
    const user = await User.find(
      { $and: [{ username: username }, { email: email }, { _id: id }] },
      { _id: 0, username: 0, email: 0, password: 0 }
    );
    if (user?.length === 0) {
      res.json({
        success: false,
        message: "Please logout then login and try again!",
      });
      return;
    }
    let newVideopost = new Video({
      videoLink: videoLink,
      uid: id,
      profileId: new mongoose.Types.ObjectId(profileid),
      tagged: tagged,
      caption: caption,
      hashtags: hashtags,
    });
    const post = await newVideopost.save();
    const uprofile = await Profile.findOne({
      $and: [{ _id: profileid }, { userid: id }],
    });
    const videos = uprofile?.videos;
    const newVideos = [...videos, post?._id];
    await Profile.updateOne(
      { $and: [{ _id: profileid }, { userid: id }] },
      { $set: { videos: newVideos } },
      { new: true }
    );
    res.json({ success: true, message: "Video uploaded successfully" });
    return;
  } catch (error) {
    res.json({ success: false, message: "Some error accured! catch" });
    return;
  }
});

router.post("/deletevideo", Authuser, async (req, res) => {
  try {
    const { secret, token, videoid } = req.body;
    if (req.method !== "POST" || REACT_APP_SECRET !== secret) {
      res.json({ success: false, message: "Some error accured!" });
      return;
    }
    const decode = jwt.verify(token, JWT_SECRET);
    const { username, email, id, profileid } = decode;
    const user = await User.find(
      { $and: [{ username: username }, { email: email }, { _id: id }] },
      { _id: 0, username: 0, email: 0, password: 0 }
    );
    if (user?.length === 0) {
      res.json({
        success: false,
        message: "Please logout then login and try again!",
      });
      return;
    }
    const post = await Video.find({ _id: videoid });
    if (post?.length === 0) {
      res.json({
        success: false,
        message: "Some error accured please refresh and try again!",
      });
      return;
    }
    await deleteFile(post[0].videoLink, "Socialmediaappvideo");
    const uprofile = await Profile.findOne({
      $and: [{ _id: profileid }, { userid: id }],
    });
    const videos = uprofile?.videos;
    await LikeVideo.deleteMany({ postid: post[0]?._id });
    await Video.deleteMany({ _id: post[0]?._id });
    await CommentOnVideo.deleteMany({ postid: post[0]?._id });
    const newVideos = videos?.filter(
      (item) => item.toString() !== (post[0]?._id).toString()
    );

    await Profile.updateOne(
      { $and: [{ _id: profileid }, { userid: id }] },
      { $set: { videos: newVideos } },
      { new: true }
    );
    res.json({ success: true, message: "Video deleted successfully" });
    return;
  } catch (error) {
    res.json({ success: false, message: "Some error accured! catch" });
    return;
  }
});

router.post("/posttweet", Authuser, async (req, res) => {
  try {
    const { secret, token, tweet, hashtags } = req.body;
    if (req.method !== "POST" || REACT_APP_SECRET !== secret) {
      res.json({ success: false, message: "Some error accured!" });
      return;
    }
    const decode = jwt.verify(token, JWT_SECRET);
    const { username, email, id, profileid } = decode;
    const user = await User.find(
      { $and: [{ username: username }, { email: email }, { _id: id }] },
      { _id: 0, username: 0, email: 0, password: 0 }
    );
    if (user?.length === 0) {
      res.json({
        success: false,
        message: "Please logout then login and try again!",
      });
      return;
    }
    let newTextpost = new Tweet({
      tweet: tweet,
      uid: id,
      profileId: new mongoose.Types.ObjectId(profileid),
      hashtags: hashtags,
    });
    const post = await newTextpost.save();
    const uprofile = await Profile.findOne({
      $and: [{ _id: profileid }, { userid: id }],
    });
    const tweets = uprofile?.tweets;
    const newTweets = [...tweets, post?._id];
    await Profile.updateOne(
      { $and: [{ _id: profileid }, { userid: id }] },
      { $set: { tweets: newTweets } },
      { new: true }
    );
    res.json({ success: true, message: "Tweet uploaded successfully" });
    return;
  } catch (error) {
    res.json({ success: false, message: "Some error accured! catch" });
    return;
  }
});

router.post("/deletetweet", Authuser, async (req, res) => {
  try {
    const { secret, token, tweetid } = req.body;
    if (req.method !== "POST" || REACT_APP_SECRET !== secret) {
      res.json({ success: false, message: "Some error accured!" });
      return;
    }
    const decode = jwt.verify(token, JWT_SECRET);
    const { username, email, id, profileid } = decode;
    const user = await User.find(
      { $and: [{ username: username }, { email: email }, { _id: id }] },
      { _id: 0, username: 0, email: 0, password: 0 }
    );
    if (user?.length === 0) {
      res.json({
        success: false,
        message: "Please logout then login and try again!",
      });
      return;
    }
    const post = await Tweet.find({ _id: tweetid });
    if (post?.length === 0) {
      res.json({
        success: false,
        message: "Some error accured please refresh and try again!",
      });
      return;
    }
    const uprofile = await Profile.findOne({
      $and: [{ _id: profileid }, { userid: id }],
    });
    const tweets = uprofile?.tweets;
    await LikeTweet.deleteMany({ postid: post[0]?._id });
    await Tweet.deleteMany({ _id: post[0]?._id });
    await CommentOnTweet.deleteMany({ postid: post[0]?._id });
    const newTweets = tweets?.filter(
      (item) => item.toString() !== (post[0]?._id).toString()
    );

    await Profile.updateOne(
      { $and: [{ _id: profileid }, { userid: id }] },
      { $set: { tweets: newTweets } },
      { new: true }
    );
    res.json({ success: true, message: "Tweet deleted successfully" });
    return;
  } catch (error) {
    res.json({ success: false, message: "Some error accured! catch" });
    return;
  }
});

router.post("/postimagecomment", Authuser, async (req, res) => {
  try {
    const { secret, token, comment, postid } = req.body;
    if (req.method !== "POST" || REACT_APP_SECRET !== secret) {
      res.json({ success: false, message: "Some error accured!" });
      return;
    }
    const decode = jwt.verify(token, JWT_SECRET);
    const { username, email, id, profileid } = decode;
    const user = await User.find(
      { $and: [{ username: username }, { email: email }, { _id: id }] },
      { _id: 0, username: 0, email: 0, password: 0 }
    );
    if (user?.length === 0) {
      res.json({
        success: false,
        message: "Please logout then login and try again!",
      });
      return;
    }
    const imagepost = await Image.findOne({
      $and: [{ _id: new mongoose.Types.ObjectId(postid) }],
    });
    if (imagepost === null) {
      res.json({ success: false, message: "Some error accured!" });
      return;
    }
    let newcommentimage = new CommentOnImage({
      comment: comment,
      uid: id,
      profileId: new mongoose.Types.ObjectId(profileid),
      postid: postid,
    });
    const post = await newcommentimage.save();
    const comments = imagepost?.comments;
    const newComments = [...comments, post?._id];
    await Image.updateOne(
      { $and: [{ _id: postid }] },
      { $set: { comments: newComments } },
      { new: true }
    );
    res.json({ success: true, message: "Comment uploaded successfully" });
    return;
  } catch (error) {
    res.json({ success: false, message: "Some error accured! catch" });
    return;
  }
});

router.post("/postvideocomment", Authuser, async (req, res) => {
  try {
    const { secret, token, comment, postid } = req.body;
    if (req.method !== "POST" || REACT_APP_SECRET !== secret) {
      res.json({ success: false, message: "Some error accured!" });
      return;
    }
    const decode = jwt.verify(token, JWT_SECRET);
    const { username, email, id, profileid } = decode;
    const user = await User.find(
      { $and: [{ username: username }, { email: email }, { _id: id }] },
      { _id: 0, username: 0, email: 0, password: 0 }
    );
    if (user?.length === 0) {
      res.json({
        success: false,
        message: "Please logout then login and try again!",
      });
      return;
    }

    const videopost = await Video.findOne({
      $and: [{ _id: new mongoose.Types.ObjectId(postid) }],
    });

    if (videopost === null) {
      res.json({ success: false, message: "Some error accured!" });
      return;
    }

    let newcommentvideo = new CommentOnVideo({
      comment: comment,
      uid: id,
      profileId: new mongoose.Types.ObjectId(profileid),
      postid: postid,
    });
    const post = await newcommentvideo.save();
    const comments = videopost?.comments;
    const newComments = [...comments, post?._id];
    await Video.updateOne(
      { $and: [{ _id: postid }] },
      { $set: { comments: newComments } },
      { new: true }
    );
    res.json({ success: true, message: "Comment uploaded successfully" });
    return;
  } catch (error) {
    res.json({ success: false, message: "Some error accured! catch" });
    return;
  }
});
router.post("/posttextcomment", Authuser, async (req, res) => {
  try {
    const { secret, token, comment, postid } = req.body;
    if (req.method !== "POST" || REACT_APP_SECRET !== secret) {
      res.json({ success: false, message: "Some error accured!" });
      return;
    }
    const decode = jwt.verify(token, JWT_SECRET);
    const { username, email, id, profileid } = decode;
    const user = await User.find(
      { $and: [{ username: username }, { email: email }, { _id: id }] },
      { _id: 0, username: 0, email: 0, password: 0 }
    );
    if (user?.length === 0) {
      res.json({
        success: false,
        message: "Please logout then login and try again!",
      });
      return;
    }
    const textpost = await Tweet.findOne({
      $and: [{ _id: new mongoose.Types.ObjectId(postid) }],
    });

    if (textpost === null) {
      res.json({ success: false, message: "Some error accured!" });
      return;
    }

    let newcommenttweet = new CommentOnTweet({
      comment: comment,
      uid: id,
      profileId: new mongoose.Types.ObjectId(profileid),
      postid: postid,
    });
    const post = await newcommenttweet.save();
    const comments = textpost?.comments;
    const newComments = [...comments, post?._id];
    await Tweet.updateOne(
      { $and: [{ _id: postid }] },
      { $set: { comments: newComments } },
      { new: true }
    );
    res.json({ success: true, message: "Comment uploaded successfully" });
    return;
  } catch (error) {
    res.json({ success: false, message: "Some error accured! catch" });
    return;
  }
});

router.post("/deletetextcomment", Authuser, async (req, res) => {
  try {
    const { secret, token, commentid, postid } = req.body;
    if (req.method !== "POST" || REACT_APP_SECRET !== secret) {
      res.json({ success: false, message: "Some error accured!" });
      return;
    }
    const decode = jwt.verify(token, JWT_SECRET);
    const { username, email, id } = decode;
    const user = await User.find(
      { $and: [{ username: username }, { email: email }, { _id: id }] },
      { _id: 0, username: 0, email: 0, password: 0 }
    );
    if (user?.length === 0) {
      res.json({
        success: false,
        message: "Please logout then login and try again!",
      });
      return;
    }
    const textpost = await Tweet.findOne({
      $and: [{ _id: new mongoose.Types.ObjectId(postid) }],
    });

    if (textpost === null) {
      res.json({ success: false, message: "Some error accured!" });
      return;
    }
    const com = await CommentOnTweet.findOne({ _id: commentid });
    if (com === null) {
      res.json({ success: false, message: "Some error accured!" });
      return;
    }
    await CommentOnTweet.findByIdAndDelete(commentid);
    const comments = textpost?.comments;
    const newComments = comments.remove(commentid);
    await Tweet.updateOne(
      { $and: [{ _id: postid }] },
      { $set: { comments: newComments } },
      { new: true }
    );
    res.json({ success: true, message: "Comment uploaded successfully" });
    return;
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Some error accured! catch" });
    return;
  }
});

router.post("/deleteimagecomment", Authuser, async (req, res) => {
  try {
    const { secret, token, commentid, postid } = req.body;
    if (req.method !== "POST" || REACT_APP_SECRET !== secret) {
      res.json({ success: false, message: "Some error accured!" });
      return;
    }
    const decode = jwt.verify(token, JWT_SECRET);
    const { username, email, id } = decode;
    const user = await User.find(
      { $and: [{ username: username }, { email: email }, { _id: id }] },
      { _id: 0, username: 0, email: 0, password: 0 }
    );
    if (user?.length === 0) {
      res.json({
        success: false,
        message: "Please logout then login and try again!",
      });
      return;
    }
    const textpost = await Image.findOne({
      $and: [{ _id: new mongoose.Types.ObjectId(postid) }],
    });

    if (textpost === null) {
      res.json({ success: false, message: "Some error accured!" });
      return;
    }
    const com = await CommentOnImage.findOne({ _id: commentid });
    if (com === null) {
      res.json({ success: false, message: "Some error accured!" });
      return;
    }
    await CommentOnImage.findByIdAndDelete(commentid);
    const comments = textpost?.comments;
    const newComments = comments.remove(commentid);
    await Image.updateOne(
      { $and: [{ _id: postid }] },
      { $set: { comments: newComments } },
      { new: true }
    );
    res.json({ success: true, message: "Comment uploaded successfully" });
    return;
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Some error accured! catch" });
    return;
  }
});

router.post("/deletevideocomment", Authuser, async (req, res) => {
  try {
    const { secret, token, commentid, postid } = req.body;
    if (req.method !== "POST" || REACT_APP_SECRET !== secret) {
      res.json({ success: false, message: "Some error accured!" });
      return;
    }
    const decode = jwt.verify(token, JWT_SECRET);
    const { username, email, id } = decode;
    const user = await User.find(
      { $and: [{ username: username }, { email: email }, { _id: id }] },
      { _id: 0, username: 0, email: 0, password: 0 }
    );
    if (user?.length === 0) {
      res.json({
        success: false,
        message: "Please logout then login and try again!",
      });
      return;
    }
    const textpost = await Video.findOne({
      $and: [{ _id: new mongoose.Types.ObjectId(postid) }],
    });

    if (textpost === null) {
      res.json({ success: false, message: "Some error accured!" });
      return;
    }
    const com = await CommentOnVideo.findOne({ _id: commentid });
    if (com === null) {
      res.json({ success: false, message: "Some error accured!" });
      return;
    }
    await CommentOnVideo.findByIdAndDelete(commentid);
    const comments = textpost?.comments;
    const newComments = comments.remove(commentid);
    await Video.updateOne(
      { $and: [{ _id: postid }] },
      { $set: { comments: newComments } },
      { new: true }
    );
    res.json({ success: true, message: "Comment uploaded successfully" });
    return;
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Some error accured! catch" });
    return;
  }
});

router.post("/likeimage", Authuser, async (req, res) => {
  try {
    const { secret, token, postid } = req.body;
    if (req.method !== "POST" || REACT_APP_SECRET !== secret) {
      res.json({ success: false, message: "Some error accured!" });
      return;
    }
    const decode = jwt.verify(token, JWT_SECRET);
    const { username, email, id } = decode;
    const user = await User.find(
      { $and: [{ username: username }, { email: email }, { _id: id }] },
      { _id: 0, username: 0, email: 0, password: 0 }
    );
    if (user?.length === 0) {
      res.json({
        success: false,
        message: "Please logout then login and try again!",
      });
      return;
    }
    const imagepost = await Image.findOne({
      $and: [{ _id: new mongoose.Types.ObjectId(postid) }],
    });
    if (imagepost === null) {
      res.json({ success: false, message: "Some error accured!" });
      return;
    }
    let likes = new Set(imagepost?.likes);
    likes.add(id);
    let alllikes = Array.from(likes);

    await Image.updateOne(
      { $and: [{ _id: postid }] },
      { $set: { likes: alllikes } },
      { new: true }
    );
    res.json({ success: true, message: "Liked!" });
    return;
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Some error accured!" });
    return;
  }
});

router.post("/dislikeimage", Authuser, async (req, res) => {
  try {
    const { secret, token, postid } = req.body;
    if (req.method !== "POST" || REACT_APP_SECRET !== secret) {
      res.json({ success: false, message: "Some error accured!" });
      return;
    }
    const decode = jwt.verify(token, JWT_SECRET);
    const { username, email, id } = decode;
    const user = await User.find(
      { $and: [{ username: username }, { email: email }, { _id: id }] },
      { _id: 0, username: 0, email: 0, password: 0 }
    );
    if (user?.length === 0) {
      res.json({
        success: false,
        message: "Please logout then login and try again!",
      });
      return;
    }
    const imagepost = await Image.findOne({
      $and: [{ _id: new mongoose.Types.ObjectId(postid) }],
    });
    if (imagepost === null) {
      res.json({ success: false, message: "Some error accured!" });
      return;
    }
    let likes = new Set(imagepost?.likes);
    likes.delete(id);
    let alllikes = Array.from(likes);

    await Image.updateOne(
      { $and: [{ _id: postid }] },
      { $set: { likes: alllikes } },
      { new: true }
    );
    res.json({ success: true, message: "Disliked!" });
    return;
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Some error accured!" });
    return;
  }
});

router.post("/likevideo", Authuser, async (req, res) => {
  try {
    const { secret, token, postid } = req.body;
    if (req.method !== "POST" || REACT_APP_SECRET !== secret) {
      res.json({ success: false, message: "Some error accured!" });
      return;
    }
    const decode = jwt.verify(token, JWT_SECRET);
    const { username, email, id } = decode;
    const user = await User.find(
      { $and: [{ username: username }, { email: email }, { _id: id }] },
      { _id: 0, username: 0, email: 0, password: 0 }
    );
    if (user?.length === 0) {
      res.json({
        success: false,
        message: "Please logout then login and try again!",
      });
      return;
    }
    const videopost = await Video.findOne({
      $and: [{ _id: new mongoose.Types.ObjectId(postid) }],
    });
    if (videopost === null) {
      res.json({ success: false, message: "Some error accured!" });
      return;
    }
    let likes = new Set(videopost?.likes);
    likes.add(id);
    let alllikes = Array.from(likes);

    await Video.updateOne(
      { $and: [{ _id: postid }] },
      { $set: { likes: alllikes } },
      { new: true }
    );
    res.json({ success: true, message: "Liked!" });
    return;
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Some error accured!" });
    return;
  }
});

router.post("/dislikevideo", Authuser, async (req, res) => {
  try {
    const { secret, token, postid } = req.body;
    if (req.method !== "POST" || REACT_APP_SECRET !== secret) {
      res.json({ success: false, message: "Some error accured!" });
      return;
    }
    const decode = jwt.verify(token, JWT_SECRET);
    const { username, email, id } = decode;
    const user = await User.find(
      { $and: [{ username: username }, { email: email }, { _id: id }] },
      { _id: 0, username: 0, email: 0, password: 0 }
    );
    if (user?.length === 0) {
      res.json({
        success: false,
        message: "Please logout then login and try again!",
      });
      return;
    }
    const videopost = await Video.findOne({
      $and: [{ _id: new mongoose.Types.ObjectId(postid) }],
    });
    if (videopost === null) {
      res.json({ success: false, message: "Some error accured!" });
      return;
    }
    let likes = new Set(videopost?.likes);
    likes.delete(id);
    let alllikes = Array.from(likes);

    await Video.updateOne(
      { $and: [{ _id: postid }] },
      { $set: { likes: alllikes } },
      { new: true }
    );
    res.json({ success: true, message: "Disliked!" });
    return;
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Some error accured!" });
    return;
  }
});

router.post("/liketweet", Authuser, async (req, res) => {
  try {
    const { secret, token, postid } = req.body;
    if (req.method !== "POST" || REACT_APP_SECRET !== secret) {
      res.json({ success: false, message: "Some error accured!" });
      return;
    }
    const decode = jwt.verify(token, JWT_SECRET);
    const { username, email, id } = decode;
    const user = await User.find(
      { $and: [{ username: username }, { email: email }, { _id: id }] },
      { _id: 0, username: 0, email: 0, password: 0 }
    );
    if (user?.length === 0) {
      res.json({
        success: false,
        message: "Please logout then login and try again!",
      });
      return;
    }
    const tweetpost = await Tweet.findOne({
      $and: [{ _id: new mongoose.Types.ObjectId(postid) }],
    });
    if (tweetpost === null) {
      res.json({ success: false, message: "Some error accured!" });
      return;
    }
    let likes = new Set(tweetpost?.likes);
    likes.add(id);
    let alllikes = Array.from(likes);

    await Tweet.updateOne(
      { $and: [{ _id: postid }] },
      { $set: { likes: alllikes } },
      { new: true }
    );
    res.json({ success: true, message: "Liked!" });
    return;
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Some error accured!" });
    return;
  }
});

router.post("/disliketweet", Authuser, async (req, res) => {
  try {
    const { secret, token, postid } = req.body;
    if (req.method !== "POST" || REACT_APP_SECRET !== secret) {
      res.json({ success: false, message: "Some error accured!" });
      return;
    }
    const decode = jwt.verify(token, JWT_SECRET);
    const { username, email, id } = decode;
    const user = await User.find(
      { $and: [{ username: username }, { email: email }, { _id: id }] },
      { _id: 0, username: 0, email: 0, password: 0 }
    );
    if (user?.length === 0) {
      res.json({
        success: false,
        message: "Please logout then login and try again!",
      });
      return;
    }
    const tweetpost = await Tweet.findOne({
      $and: [{ _id: new mongoose.Types.ObjectId(postid) }],
    });
    if (tweetpost === null) {
      res.json({ success: false, message: "Some error accured!" });
      return;
    }
    let likes = new Set(tweetpost?.likes);
    likes.delete(id);
    let alllikes = Array.from(likes);

    await Tweet.updateOne(
      { $and: [{ _id: postid }] },
      { $set: { likes: alllikes } },
      { new: true }
    );
    res.json({ success: true, message: "Disliked!" });
    return;
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Some error accured!" });
    return;
  }
});

router.post("/getAllPosts", async (req, res) => {
  try {
    const { secret, token } = req.body;
    if (req.method !== "POST" || REACT_APP_SECRET !== secret) {
      res.json({ success: false, message: "Some error accured!" });
      return;
    }
    const decode = jwt.verify(token, JWT_SECRET);
    const { profileid } = decode;
    const profile = await Profile.findOne({ _id: profileid });
    const posts = await Image.find().populate("profileId").sort({ createdAt: 'desc' });
    if (posts) {
      res.json({
        success: true,
        message: "Post fetched",
        posts: posts,
        profile,
      });
      return;
    } else {
      res.json({ success: false, message: "Some error accured!" });
    }
  } catch (error) {
    res.json({ success: false, message: "Some error accured!" });
    return;
  }
});

router.post("/getAllVideos", async (req, res) => {
  try {
    const { secret, token } = req.body;
    if (req.method !== "POST" || REACT_APP_SECRET !== secret) {
      res.json({ success: false, message: "Some error accured!" });
      return;
    }
    const decode = jwt.verify(token, JWT_SECRET);
    const { profileid } = decode;
    const profile = await Profile.findOne({ _id: profileid });
    const videos = await Video.find().populate("profileId");

    if (videos) {
      res.json({
        success: true,
        message: "Post fetched",
        videos: videos,
        profile,
      });
      return;
    } else {
      res.json({ success: false, message: "Some error accured!" });
    }
  } catch (error) {
    res.json({ success: false, message: "Some error accured!" });
    return;
  }
});

router.post("/getAllTweets", async (req, res) => {
  try {
    const { secret, token } = req.body;
    if (req.method !== "POST" || REACT_APP_SECRET !== secret) {
      res.json({ success: false, message: "Some error accured!" });
      return;
    }
    const decode = jwt.verify(token, JWT_SECRET);
    const { profileid } = decode;
    const profile = await Profile.findOne({ _id: profileid });
    const tweets = await Tweet.find().populate("profileId");
    if (tweets) {
      res.json({
        success: true,
        message: "Post fetched",
        posts: tweets,
        profile,
      });
      return;
    } else {
      res.json({ success: false, message: "Some error accured!" });
    }
  } catch (error) {
    res.json({ success: false, message: "Some error accured!" });
    return;
  }
});

router.post("/getParticularpost", async (req, res) => {
  try {
    const { secret, id } = req.body;
    if (req.method !== "POST" || REACT_APP_SECRET !== secret) {
      res.json({ success: false, message: "Some error accured!" });
      return;
    }
    const image = await Image.findOne({ _id: id }).populate("profileId");
    if (image) {
      res.json({ success: true, message: "Post fetched", posts: image });
      return;
    } else {
      res.json({ success: false, message: "Some error accured!" });
    }
  } catch (error) {
    res.json({ success: false, message: "Some error accured!" });
    return;
  }
});

router.post("/getParticularVideopost", async (req, res) => {
  try {
    const { secret, id } = req.body;
    if (req.method !== "POST" || REACT_APP_SECRET !== secret) {
      res.json({ success: false, message: "Some error accured!" });
      return;
    }
    const video = await Video.findOne({ _id: id }).populate("profileId");
    if (video) {
      res.json({ success: true, message: "Post fetched", posts: video });
      return;
    } else {
      res.json({ success: false, message: "Some error accured!" });
    }
  } catch (error) {
    res.json({ success: false, message: "Some error accured!" });
    return;
  }
});
router.post("/getparticulartweetpost", async (req, res) => {
  try {
    const { secret, id } = req.body;
    if (req.method !== "POST" || REACT_APP_SECRET !== secret) {
      res.json({ success: false, message: "Some error accured!" });
      return;
    }
    const tweet = await Tweet.findOne({ _id: id }).populate("profileId");
    if (tweet) {
      res.json({ success: true, message: "Post fetched", posts: tweet });
      return;
    } else {
      res.json({ success: false, message: "Some error accured!" });
    }
  } catch (error) {
    res.json({ success: false, message: "Some error accured!" });
    return;
  }
});

router.post("/fetchCommentonimage", async (req, res) => {
  try {
    const { secret, id } = req.body;
    if (req.method !== "POST" || REACT_APP_SECRET !== secret) {
      res.json({ success: false, message: "Some error accured!" });
      return;
    }
    const comment = await CommentOnImage.find({ postid: id }).populate(
      "profileId"
    );
    if (comment) {
      res.json({
        success: true,
        message: "Comment fetched",
        comments: comment,
      });
      return;
    } else {
      res.json({ success: false, message: "Some error accured!" });
    }
  } catch (error) {
    res.json({ success: false, message: "Some error accured!" });
    return;
  }
});

router.post("/fetchCommentonvideo", async (req, res) => {
  try {
    const { secret, id } = req.body;
    if (req.method !== "POST" || REACT_APP_SECRET !== secret) {
      res.json({ success: false, message: "Some error accured!" });
      return;
    }
    const comment = await CommentOnVideo.find({ postid: id }).populate(
      "profileId"
    );
    if (comment) {
      res.json({ success: true, message: "Post fetched", comments: comment });
      return;
    } else {
      res.json({ success: false, message: "Some error accured!" });
    }
  } catch (error) {
    res.json({ success: false, message: "Some error accured!" });
    return;
  }
});

router.post("/fetchCommentontweet", async (req, res) => {
  try {
    const { secret, id } = req.body;
    if (req.method !== "POST" || REACT_APP_SECRET !== secret) {
      res.json({ success: false, message: "Some error accured!" });
      return;
    }
    const comment = await CommentOnTweet.find({ postid: id }).populate(
      "profileId"
    );
    if (comment) {
      res.json({
        success: true,
        message: "Tweet comment fetched",
        comments: comment,
      });
      return;
    } else {
      res.json({ success: false, message: "Some error accured!" });
      return;
    }
  } catch (error) {
    res.json({ success: false, message: "Some error accured!" });
    return;
  }
});

router.post("/saved", Authuser, async (req, res) => {
  try {
    let { postid, secret, token } = req.body;
    if (req.method !== "POST" || secret !== REACT_APP_SECRET) {
      res.json({ success: false, message: "Unauthorised" });
      return;
    }
    const decode = jwt.verify(token, JWT_SECRET);
    const { profileid } = decode;
    const uprofile = await Profile.findOne({ _id: profileid });

    let savedpost = new Set(uprofile?.savedpost);
    savedpost.add(postid);
    let savedposts = Array.from(savedpost);

    await Profile.updateOne(
      { $and: [{ _id: profileid }] },
      { $set: { savedpost: savedposts } },
      { new: true }
    );

    res.json({ success: true, message: "Saved" });
    return;
  } catch (error) {
    res.json({ success: false, message: "Some error accured!" });
    return;
  }
});

router.post("/unsaved", Authuser, async (req, res) => {
  try {
    let { postid, secret, token } = req.body;
    if (req.method !== "POST" || secret !== REACT_APP_SECRET) {
      res.json({ success: false, message: "Unauthorised" });
      return;
    }
    const decode = jwt.verify(token, JWT_SECRET);
    const { profileid } = decode;
    const uprofile = await Profile.findOne({ _id: profileid });

    let savedpost = new Set(uprofile?.savedpost);
    savedpost.delete(postid);
    let savedposts = Array.from(savedpost);

    await Profile.updateOne(
      { $and: [{ _id: profileid }] },
      { $set: { savedpost: savedposts } },
      { new: true }
    );
    res.json({ success: true, message: "Unsaved" });
    return;
  } catch (error) {
    res.json({ success: false, message: "Some error accured!" });
    return;
  }
});

router.post(
  "/uploadImage",
  multer({ storage: multer.diskStorage({}) }).single("file"),
  async (req, res) => {
    try {
      let file = req.file.path;
      const options = {
        upload_preset: "socialmediapp",
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      };
      try {
        // Upload the image
        const result = await cloudinary.uploader.upload(file, options);
        if (result?.public_id != null && result?.url != null) {
          res.json({
            success: true,
            message: "Image uploaded",
            url: result?.secure_url,
          });
          return;
        }
      } catch (error) {
        console.error(error);
      }
      res.json({ success: false, message: "Image not uploaded" });
      return;
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Some error accured!" });
      return;
    }
  }
);

router.post(
  "/uploadvideofile",
  multer({ storage: multer.diskStorage({}) }).single("file"),
  async (req, res) => {
    try {
      let file = req.file.path;
      const options = {
        resource_type: "video",
        upload_preset: "socialmediaappvideo",
        use_filename: true,
        unique_filename: false,
        overwrite: true,
        eager_async: true,
      };
      try {
        const result = await cloudinary.uploader.upload(file, options);
        if (result?.public_id != null && result?.url != null) {
          res.json({
            success: true,
            message: "Image uploaded",
            url: result?.secure_url,
          });
          return;
        }
      } catch (error) {
        console.error(error);
      }

      res.json({ success: false, message: "Image not uploaded" });
      return;
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Some error accured!" });
      return;
    }
  }
);

module.exports = router , {deleteFile};
