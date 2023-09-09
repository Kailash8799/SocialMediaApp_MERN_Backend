const express = require("express");
const router = express.Router();
var AES_SECRET = process.env.AES_SECRET;
const nodemailer = require("nodemailer");
const REACT_APP_URL = process.env.REACT_APP_LOCALHOST;
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
      $and: [{ _id: new mongoose.Types.ObjectId(postid) }, { uid: id }],
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
      { $and: [{ _id: postid }, { uid: id }] },
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
      $and: [{ _id: new mongoose.Types.ObjectId(postid) }, { uid: id }],
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
      { $and: [{ _id: postid }, { uid: id }] },
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
      $and: [{ _id: new mongoose.Types.ObjectId(postid) }, { uid: id }],
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
      { $and: [{ _id: postid }, { uid: id }] },
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
router.post("/likeimage", Authuser, async (req, res) => {
  try {
    const { secret, token, postid } = req.body;
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
      $and: [{ _id: new mongoose.Types.ObjectId(postid) }, { uid: id }],
    });
    if (imagepost === null) {
      res.json({ success: false, message: "Some error accured!" });
      return;
    }
    const isLiked = await LikeImage.findOne({
      $and: [{ postid: postid }, { uid: id }],
    });
    if (isLiked != null) {
      res.json({ success: false, message: "Allready liked" });
      return;
    }
    let likeimage = new LikeImage({
      uid: id,
      profileId: new mongoose.Types.ObjectId(profileid),
      postid: postid,
    });
    const post = await likeimage.save();
    const likes = imagepost?.likes;
    const newlikes = [...likes, id];
    await Image.updateOne(
      { $and: [{ _id: postid }, { uid: id }] },
      { $set: { likes: newlikes } },
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
      $and: [{ _id: new mongoose.Types.ObjectId(postid) }, { uid: id }],
    });
    if (imagepost === null) {
      res.json({ success: false, message: "Some error accured!" });
      return;
    }
    const isLiked = await LikeImage.findOne({
      $and: [{ postid: postid }, { uid: id }],
    });
    if (isLiked == null) {
      res.json({ success: false, message: "Image is not liked" });
      return;
    }
    await LikeImage.deleteMany({ _id: isLiked?._id });
    const likes = imagepost?.likes;
    const newlikes = likes.remove(id);
    await Image.updateOne(
      { $and: [{ _id: postid }, { uid: id }] },
      { $set: { likes: newlikes } },
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
      $and: [{ _id: new mongoose.Types.ObjectId(postid) }, { uid: id }],
    });
    if (videopost === null) {
      res.json({ success: false, message: "Some error accured!" });
      return;
    }
    const isLiked = await LikeVideo.findOne({
      $and: [{ postid: postid }, { uid: id }],
    });
    if (isLiked != null) {
      res.json({ success: false, message: "Allready liked" });
      return;
    }
    let likevideo = new LikeVideo({
      uid: id,
      profileId: new mongoose.Types.ObjectId(profileid),
      postid: postid,
    });
    const post = await likevideo.save();
    const likes = videopost?.likes;
    const newlikes = [...likes, id];
    await Video.updateOne(
      { $and: [{ _id: postid }, { uid: id }] },
      { $set: { likes: newlikes } },
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
    const imagepost = await Video.findOne({
      $and: [{ _id: new mongoose.Types.ObjectId(postid) }, { uid: id }],
    });
    if (imagepost === null) {
      res.json({ success: false, message: "Some error accured!" });
      return;
    }
    const isLiked = await LikeVideo.findOne({
      $and: [{ postid: postid }, { uid: id }],
    });
    if (isLiked == null) {
      res.json({ success: false, message: "Image is not liked" });
      return;
    }
    await LikeVideo.deleteMany({ _id: isLiked?._id });
    const likes = imagepost?.likes;
    const newlikes = likes.remove(id);
    await Video.updateOne(
      { $and: [{ _id: postid }, { uid: id }] },
      { $set: { likes: newlikes } },
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
    const tweetpost = await Tweet.findOne({
      $and: [{ _id: new mongoose.Types.ObjectId(postid) }, { uid: id }],
    });
    if (tweetpost === null) {
      res.json({ success: false, message: "Some error accured!" });
      return;
    }
    const isLiked = await LikeTweet.findOne({
      $and: [{ postid: postid }, { uid: id }],
    });
    if (isLiked != null) {
      res.json({ success: false, message: "Allready liked" });
      return;
    }
    let liketweet = new LikeTweet({
      uid: id,
      profileId: new mongoose.Types.ObjectId(profileid),
      postid: postid,
    });
    const post = await liketweet.save();
    const likes = tweetpost?.likes;
    const newlikes = [...likes, id];
    await Tweet.updateOne(
      { $and: [{ _id: postid }, { uid: id }] },
      { $set: { likes: newlikes } },
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
    const imagepost = await Tweet.findOne({
      $and: [{ _id: new mongoose.Types.ObjectId(postid) }, { uid: id }],
    });
    if (imagepost === null) {
      res.json({ success: false, message: "Some error accured!" });
      return;
    }
    const isLiked = await LikeTweet.findOne({
      $and: [{ postid: postid }, { uid: id }],
    });
    if (isLiked == null) {
      res.json({ success: false, message: "Image is not liked" });
      return;
    }
    await LikeTweet.deleteMany({ _id: isLiked?._id });
    const likes = imagepost?.likes;
    const newlikes = likes.remove(id);
    await Tweet.updateOne(
      { $and: [{ _id: postid }, { uid: id }] },
      { $set: { likes: newlikes } },
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
    const { secret } = req.body;
    if (req.method !== "POST" || REACT_APP_SECRET !== secret) {
      res.json({ success: false, message: "Some error accured!" });
      return;
    }
    const posts = await Image.find().populate("profileId");
    if (posts) {
      res.json({ success: true, message: "Post fetched",posts:posts});
      return;
    }else{
      res.json({ success: false, message: "Some error accured!"})
    }
  } catch (error) {
    res.json({ success: false, message: "Some error accured!" });
    return;
  }
});
router.post("/getAllVideos", async (req, res) => {
  try {
    const { secret } = req.body;
    if (req.method !== "POST" || REACT_APP_SECRET !== secret) {
      res.json({ success: false, message: "Some error accured!" });
      return;
    }
    const videos = await Video.find().populate("profileId");
    if (videos) {
      res.json({ success: true, message: "Post fetched",videos:videos});
      return;
    }else{
      res.json({ success: false, message: "Some error accured!"})
    }
  } catch (error) {
    res.json({ success: false, message: "Some error accured!" });
    return;
  }
});
router.post("/getAllTweets", async (req, res) => {
  try {
    const { secret } = req.body;
    if (req.method !== "POST" || REACT_APP_SECRET !== secret) {
      res.json({ success: false, message: "Some error accured!" });
      return;
    }
    const tweets = await Tweet.find().populate("profileId");
    if (tweets) {
      res.json({ success: true, message: "Post fetched",posts:tweets});
      return;
    }else{
      res.json({ success: false, message: "Some error accured!"})
    }
  } catch (error) {
    res.json({ success: false, message: "Some error accured!" });
    return;
  }
});

router.post("/getParticularpost", async (req, res) => {
  try {
    const { secret,id } = req.body;
    if (req.method !== "POST" || REACT_APP_SECRET !== secret) {
      res.json({ success: false, message: "Some error accured!" });
      return;
    }
    const image = await Image.findOne({_id:id}).populate("profileId");
    if (image) {
      res.json({ success: true, message: "Post fetched",posts:image});
      return;
    }else{
      res.json({ success: false, message: "Some error accured!"})
    }
  } catch (error) {
    res.json({ success: false, message: "Some error accured!" });
    return;
  }
});


router.post("/fetchCommentonimage", async (req, res) => {
  try {
    const { secret,id } = req.body;
    if (req.method !== "POST" || REACT_APP_SECRET !== secret) {
      res.json({ success: false, message: "Some error accured!" });
      return;
    }
    const comment = await CommentOnImage.find({postid:id}).populate("profileId");
    if (comment) {
      res.json({ success: true, message: "Comment fetched",comments:comment});
      return;
    }else{
      res.json({ success: false, message: "Some error accured!"})
    }
  } catch (error) {
    res.json({ success: false, message: "Some error accured!" });
    return;
  }
});

router.post("/fetchCommentonvideo", async (req, res) => {
  try {
    const { secret,id } = req.body;
    if (req.method !== "POST" || REACT_APP_SECRET !== secret) {
      res.json({ success: false, message: "Some error accured!" });
      return;
    }
    const comment = await CommentOnVideo.find({postid:id}).populate("profileId");
    if (comment) {
      res.json({ success: true, message: "Post fetched",comments:comment});
      return;
    }else{
      res.json({ success: false, message: "Some error accured!"})
    }
  } catch (error) {
    res.json({ success: false, message: "Some error accured!" });
    return;
  }
});

router.post("/fetchCommentontweet", async (req, res) => {
  try {
    const { secret,id } = req.body;
    if (req.method !== "POST" || REACT_APP_SECRET !== secret) {
      res.json({ success: false, message: "Some error accured!" });
      return;
    }
    const comment = await CommentOnTweet.find({postid:id}).populate("profileId");
    if (comment) {
      res.json({ success: true, message: "Post fetched",comments:comment});
      return;
    }else{
      res.json({ success: false, message: "Some error accured!"})
    }
  } catch (error) {
    res.json({ success: false, message: "Some error accured!" });
    return;
  }
});

module.exports = router;
