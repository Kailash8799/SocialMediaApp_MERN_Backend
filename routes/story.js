const express = require("express");
const Authuser = require("../middleware/authuser");
const Story = require("../models/Story");
const router = express.Router();
var REACT_APP_SECRET = process.env.REACT_APP_SECRET;
var JWT_SECRET = process.env.JWT_SECRET;
var jwt = require("jsonwebtoken");

router.post("/getallstory", async (req, res) => {
  try {
    const { secret } = req.body;
    console.log(secret);
    if (
      REACT_APP_SECRET !== secret
    ) {
      res.status(500).json({ success: false, message: "Some error accured!" });
      return;
    }
    var story = await Story.find().populate("userid");
    console.log(story);
    res.status(200).json({ success: true, message: "",story });
    return;
  } catch (error) {
    console.log(error);
    res.status(501).json({ success: false, message: "Some error accured!" });
    return;
  }
});

router.post("/addstory", Authuser, async (req, res) => {
    try {
      const { secret, imageLink, userId } = req.body;
      if (
        REACT_APP_SECRET !== secret ||
        imageLink == undefined ||
        userId == undefined
      ) {
        res.status(500).json({ success: false, message: "Some error accured!" });
        return;
      }
      let story = new Story({
        userid: userId,
        imageLink: imageLink,
      });
      await story.save();
      res.status(200).json({ success: true, message: "Story added" });
      return;
    } catch (error) {
      console.log(error);
      res.status(501).json({ success: false, message: "Some error accured!" });
      return;
    }
  });

router.post("/delete-story", Authuser, async (req, res) => {
  try {
    const { secret, userId,token, storyId,link} = req.body;
    if (
      REACT_APP_SECRET !== secret ||
      storyId == undefined ||
      userId == undefined ||  link == undefined
    ) {
      res.status(500).json({ success: false, message: "Some error accured!" });
      return;
    }
    const decode = jwt.verify(token, JWT_SECRET);
    const { profileid } = decode;
    if(profileid != userId){
        res.status(200).json({ success: false, message: "Unauthorised" });
        return;
    }
    await Story.deleteMany({ _id: storyId });
    res.status(200).json({ success: true, message: "Story deleted" });
    return;
  } catch (error) {
    res.status(501).json({ success: false, message: "Some error accured!" });
    return;
  }
});

module.exports = router;
