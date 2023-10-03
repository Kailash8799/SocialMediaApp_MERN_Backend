// import Authuser from '../middleware/authuser';
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const Authuser = require("../middleware/authuser");
var JWT_SECRET = process.env.JWT_SECRET;
var AES_SECRET = process.env.AES_SECRET;
var REACT_APP_SECRET = process.env.REACT_APP_SECRET;
const nodemailer = require("nodemailer");
const Profile = require("../models/Profile");
const Video = require("../models/Video");
const Tweet = require("../models/Tweet");
const Image = require("../models/Image");
const REACT_APP_URL = process.env.REACT_APP_LOCALHOST;
const {deleteFile} = require("./addpost")

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password, secret } = req.body;
    if (req.method !== "POST" || secret !== REACT_APP_SECRET) {
      res.json({
        success: false,
        message: "Some error accured!",
      });
      return;
    }
    const user = await User.find(
      { $or: [{ username: username }, { email: email }] },
      { _id: 0, username: 0, email: 0, password: 0 }
    );
    if (user?.length !== 0) {
      res.json({
        success: false,
        message: "This email or username is already in use",
      });
      return;
    }
    const hashPassword = await bcrypt.hash(password, 12);
    const ne = new User({
      username: username,
      email: email,
      password: hashPassword,
    });
    await ne.save();
    var token = jwt.sign(
      {
        username: ne?.username,
        email: ne?.email,
        id: ne?._id,
      },
      JWT_SECRET,
      { expiresIn: "1h", algorithm: "HS384" }
    );
    let htmlemail = `<!DOCTYPE html>
      <html>
      <head>
      
        <meta charset="utf-8">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <title>Email Confirmation</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style type="text/css">
        /**
         * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
         */
        @media screen {
          @font-face {
            font-family: 'Source Sans Pro';
            font-style: normal;
            font-weight: 400;
            src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
          }
          @font-face {
            font-family: 'Source Sans Pro';
            font-style: normal;
            font-weight: 700;
            src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
          }
        }
        /**
         * Avoid browser level font resizing.
         * 1. Windows Mobile
         * 2. iOS / OSX
         */
        body,
        table,
        td,
        a {
          -ms-text-size-adjust: 100%; /* 1 */
          -webkit-text-size-adjust: 100%; /* 2 */
        }
        /**
         * Remove extra space added to tables and cells in Outlook.
         */
        table,
        td {
          mso-table-rspace: 0pt;
          mso-table-lspace: 0pt;
        }
        /**
         * Better fluid images in Internet Explorer.
         */
        img {
          -ms-interpolation-mode: bicubic;
        }
        /**
         * Remove blue links for iOS devices.
         */
        a[x-apple-data-detectors] {
          font-family: inherit !important;
          font-size: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
          color: inherit !important;
          text-decoration: none !important;
        }
        /**
         * Fix centering issues in Android 4.4.
         */
        div[style*="margin: 16px 0;"] {
          margin: 0 !important;
        }
        body {
          width: 100% !important;
          height: 100% !important;
          padding: 0 !important;
          margin: 0 !important;
        }
        /**
         * Collapse table borders to avoid space between cells.
         */
        table {
          border-collapse: collapse !important;
        }
        a {
          color: #1a82e2;
        }
        img {
          height: auto;
          line-height: 100%;
          text-decoration: none;
          border: 0;
          outline: none;
        }
        </style>
      
      </head>
      <body style="background-color: #e9ecef;">
      
        <!-- start preheader -->
        <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
          A preheader is the short summary text that follows the subject line when an email is viewed in the inbox.
        </div>
        <!-- end preheader -->
      
        <!-- start body -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
      
          <!-- start logo -->
          <tr>
            <td align="center" bgcolor="#e9ecef">
              <!--[if (gte mso 9)|(IE)]>
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
              <tr>
              <td align="center" valign="top" width="600">
              <![endif]-->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                <tr>
                  <td align="center" valign="top" style="padding: 36px 24px;">
                    <a href="${REACT_APP_URL}" target="_blank" style="display: inline-block;">
                      <img src="${REACT_APP_URL}/logo.png" alt="Logo" border="0" width="48" style="display: block; width: 48px; max-width: 48px; min-width: 48px;">
                    </a>
                  </td>
                </tr>
              </table>
              <!--[if (gte mso 9)|(IE)]>
              </td>
              </tr>
              </table>
              <![endif]-->
            </td>
          </tr>
          <!-- end logo -->
      
          <!-- start hero -->
          <tr>
            <td align="center" bgcolor="#e9ecef">
              <!--[if (gte mso 9)|(IE)]>
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
              <tr>
              <td align="center" valign="top" width="600">
              <![endif]-->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                <tr>
                  <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
                    <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Confirm Your Email Address</h1>
                  </td>
                </tr>
              </table>
              <!--[if (gte mso 9)|(IE)]>
              </td>
              </tr>
              </table>
              <![endif]-->
            </td>
          </tr>
          <!-- end hero -->
      
          <!-- start copy block -->
          <tr>
            <td align="center" bgcolor="#e9ecef">
              <!--[if (gte mso 9)|(IE)]>
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
              <tr>
              <td align="center" valign="top" width="600">
              <![endif]-->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
      
                <!-- start copy -->
                <tr>
                  <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                    <p style="margin: 0;">Tap the button below to confirm your email address. If you didn't create an account with <a href="${REACT_APP_URL}">${REACT_APP_URL}</a>, you can safely delete this email.</p>
                  </td>
                </tr>
                <!-- end copy -->
      
                <!-- start button -->
                <tr>
                  <td align="left" bgcolor="#ffffff">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td align="center" bgcolor="#ffffff" style="padding: 12px;">
                          <table border="0" cellpadding="0" cellspacing="0">
                            <tr>
                              <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;">
                                <a href="${REACT_APP_URL}/verifyemail?token=${token}" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">Verify email</a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <!-- end button -->
      
                <!-- start copy -->
                <tr>
                  <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                    <p style="margin: 0;">If that doesn't work, copy and paste the following link in your browser:</p>
                    <p style="margin: 0;"><a href="${REACT_APP_URL}/verifyemail?token=${token}" target="_blank">${REACT_APP_URL}/verifyemail?token=${token}</a></p>
                  </td>
                </tr>
                <!-- end copy -->
      
                <!-- start copy -->
                <tr>
                  <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf">
                    <p style="margin: 0;">Cheers,<br> Team linkage </p>
                  </td>
                </tr>
                <!-- end copy -->
      
              </table>
              <!--[if (gte mso 9)|(IE)]>
              </td>
              </tr>
              </table>
              <![endif]-->
            </td>
          </tr>
          <!-- end copy block -->
      
          <!-- start footer -->
          <tr>
            <td align="center" bgcolor="#e9ecef" style="padding: 24px;">
              <!--[if (gte mso 9)|(IE)]>
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
              <tr>
              <td align="center" valign="top" width="600">
              <![endif]-->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
      
                <!-- start permission -->
                <tr>
                  <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
                    <p style="margin: 0;">You received this email because we received a request for email verification for your account. If you didn't request to create account on our site  you can safely delete this email.</p>
                  </td>
                </tr>
                <!-- end permission -->
              </table>
              <!--[if (gte mso 9)|(IE)]>
              </td>
              </tr>
              </table>
              <![endif]-->
            </td>
          </tr>
          <!-- end footer -->
      
        </table>
        <!-- end body -->
      
      </body>
      </html>`;
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD_EMAIL,
      },
      secure: true,
      host: "smtp.titan.email",
      port: 465,
    });
    var mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Verify User",
      html: htmlemail,
    };

    const server = await new Promise((resolve, reject) => {
      // verify connection configuration
      transporter.verify(function (error, success) {
        if (success) {
          resolve(success);
        }
        reject(error);
      });
    });
    if (!server) {
      res.json({ success: false, message: "Error failed" }, { status: 500 });
    }

    const success = await new Promise((resolve, reject) => {
      // send mail
      transporter.sendMail(mailOptions).then((info, err) => {
        if (info.response.includes("250")) {
          resolve(true);
        }
        reject(err);
      });
    });

    if (!success) {
      res.json(
        {
          success: false,
          message: "Error sending email",
        },
        { status: 500 }
      );
    }

    res.json({
      success: true,
      message: "Your account has been created successfully",
    });
    return;
  } catch (error) {
    res.json({
      success: false,
      message: "Some error accured!",
    });
    return;
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { usernameemail, password, secret } = req.body;
    if (req.method !== "POST" || secret !== REACT_APP_SECRET) {
      res.json({
        success: false,
        message: "Some error accured!",
      });
      return;
    }
    const user = await User.find({
      $or: [{ username: usernameemail }, { email: usernameemail }],
    });
    if (user?.length === 0) {
      res.json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }
    let comparePassword = await bcrypt.compare(password, user[0]?.password);
    let usernameemailverify = !(
      user[0]?.email === usernameemail || user[0]?.username === usernameemail
    );
    if (usernameemailverify || !comparePassword) {
      res.json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }
    if (!user[0].emailVerified) {
      res.json({
        success: false,
        message: "Email not verified!",
      });
      return;
    }
    const userProfile = await Profile.findOne(
      { userid: user[0]?._id },
      { userid: 0, followers: 0, following: 0, videos: 0, tweets: 0, images: 0 }
    );
    var token = jwt.sign(
      {
        username: user[0]?.username,
        email: user[0]?.email,
        id: user[0]?._id,
        profileid: userProfile?._id,
      },
      JWT_SECRET,
      { expiresIn: "10d", algorithm: "HS384" }
    );
    res.json({
      success: true,
      message: "Logged in",
      token: token,
    });
    return;
  } catch (error) {
    res.json({
      success: false,
      message: "Some error accured!",
    });
    return;
  }
});

router.post("/verifyuser", async (req, res) => {
  try {
    let { token, secret } = req.body;
    if (req.method !== "POST" || secret !== REACT_APP_SECRET) {
      res.json({
        success: false,
        message: "Some error accured!",
      });
      return;
    }
    const decode = jwt.verify(token, JWT_SECRET);
    const { username, email, id } = decode;
    const user = await User.find(
      { $and: [{ username: username }, { email: email }] },
      { password: 0 }
    );
    if (user?.length === 0) {
      res.json({
        success: false,
        message: "Invalid token",
      });
      return;
    }
    if (user[0]?.emailVerified) {
      res.json({
        success: true,
        message: "Email is allready verified",
      });
      return;
    }
    await User.updateOne(
      { _id: id, email: email },
      { $set: { emailVerified: true } },
      { new: true }
    );
    const prof = new Profile({
      userid: user[0]?._id,
      username: user[0]?.username,
      useremail: user[0]?.email,
    });
    await prof.save();
    res.json({
      success: true,
      message: "Email verified and profile has been created!",
    });
    return;
  } catch (error) {
    res.json({ success: false, message: "Some error accured!" });
    return;
  }
});

router.post("/forgotpassword", async (req, res) => {
  res.json({ success: true, message: "Forgot Password successfully" });
});

router.post("/getUser", Authuser, async (req, res) => {
  try {
    let { secret, token } = req.body;
    if (req.method !== "POST" || secret !== REACT_APP_SECRET) {
      res.json({ success: false, message: "Unauthorised" });
      return;
    }
    const decode = jwt.verify(token, JWT_SECRET);
    const { profileid } = decode;
    let profile = await Profile.findOne({ _id: profileid });
    res.json({ success: true, message: "You are logged in", profile });
  } catch (error) {
    res.json({ success: false, message: "Some error accured!" });
  }
});
router.post("/getuserwithdata", Authuser, async (req, res) => {
  try {
    let { secret, token, username } = req.body;
    if (req.method !== "POST" || secret !== REACT_APP_SECRET) {
      res.json({ success: false, message: "Unauthorised" });
      return;
    }
    let profilevideo = [];
    let profileimage = [];
    let profiletweet = [];

    const decode = jwt.verify(token, JWT_SECRET);
    const { profileid } = decode;
    let myprofile = await Profile.findOne({ _id: profileid });

    let profile = await Profile.findOne({ username });
    for (let index = 0; index < profile?.videos?.length; index++) {
      let vidoed = await Video.findOne({
        _id: profile?.videos[index],
      }).populate("profileId");
      if (vidoed != null) {
        profilevideo.push(vidoed);
      }
    }
    for (let index = 0; index < profile?.images?.length; index++) {
      let vidoed = await Image.findOne({
        _id: profile?.images[index],
      }).populate("profileId");
      if (vidoed != null) {
        profileimage.push(vidoed);
      }
    }
    for (let index = 0; index < profile?.tweets?.length; index++) {
      let vidoed = await Tweet.findOne({
        _id: profile?.tweets[index],
      }).populate("profileId");
      if (vidoed != null) {
        profiletweet.push(vidoed);
      }
    }
    if (profile) {
      console.log(profiletweet);
      res.json({
        success: true,
        message: "Profile fetched",
        profile,
        profileimage,
        profilevideo,
        profiletweet,
        myprofile,
      });
      return;
    }
    res.json({ success: false, message: "User not found" });
    return;
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Some error accured!" });
    return;
  }
});

router.post("/followuser", Authuser, async (req, res) => {
  try {
    let { userid, secret, token } = req.body;
    if (req.method !== "POST" || secret !== REACT_APP_SECRET) {
      res.json({ success: false, message: "Unauthorised" });
      return;
    }
    const decode = jwt.verify(token, JWT_SECRET);
    const { profileid } = decode;
    const uprofile = await Profile.findOne({ _id: profileid });
    const followingprofile = await Profile.findOne({ _id: userid });

    let follower = new Set(followingprofile?.followers);
    follower.add(profileid);
    let followers = Array.from(follower);

    let following = new Set(uprofile?.following);
    following.add(userid);
    let followings = Array.from(following);

    await Profile.updateOne(
      { $and: [{ _id: profileid }] },
      { $set: { following: followings } },
      { new: true }
    );

    await Profile.updateOne(
      { $and: [{ _id: userid }] },
      { $set: { followers: followers } },
      { new: true }
    );
    res.json({ success: true, message: "Followed" });
    return;
  } catch (error) {
    res.json({ success: false, message: "Some error accured!" });
    return;
  }
});

router.post("/unfollowuser", Authuser, async (req, res) => {
  try {
    let { userid, secret, token } = req.body;
    if (req.method !== "POST" || secret !== REACT_APP_SECRET) {
      res.json({ success: false, message: "Unauthorised" });
      return;
    }
    const decode = jwt.verify(token, JWT_SECRET);
    const { profileid } = decode;
    const uprofile = await Profile.findOne({ _id: profileid });
    const followingprofile = await Profile.findOne({ _id: userid });

    let follower = new Set(followingprofile?.followers);
    follower.delete(profileid);
    let followers = Array.from(follower);

    let following = new Set(uprofile?.following);
    following.delete(userid);
    let followings = Array.from(following);

    await Profile.updateOne(
      { $and: [{ _id: profileid }] },
      { $set: { following: followings } },
      { new: true }
    );

    await Profile.updateOne(
      { $and: [{ _id: userid }] },
      { $set: { followers: followers } },
      { new: true }
    );
    res.json({ success: true, message: "UnFollowed" });
    return;
  } catch (error) {
    res.json({ success: false, message: "Some error accured!" });
    return;
  }
});

router.post("/getalluser", Authuser, async (req, res) => {
  try {
    let { secret, token } = req.body;
    if (req.method !== "POST" || secret !== REACT_APP_SECRET) {
      res.json({ success: false, message: "Unauthorised" });
      return;
    }
    const decode = jwt.verify(token, JWT_SECRET);
    const { profileid } = decode;
    let users = await Profile.find();
    let profile = await Profile.findOne({ _id: profileid });
    res.json({ success: true, message: "Users", users, profile });
    return;
  } catch (error) {
    res.json({ success: false, message: "Some error accured!" });
    return;
  }
});

router.post("/updateUser", Authuser, async (req, res) => {
  try {
    const { usernameemail, profileImage, secret,oldImage,token } = req.body;
    if (req.method !== "POST" || secret !== REACT_APP_SECRET) {
      res.json({
        success: false,
        message: "Some error accured!",
      });
      return;
    }
    const user = await User.find({
      $or: [{ username: usernameemail }, { email: usernameemail }],
    });
    if (user?.length === 0) {
      res.json({
        success: false,
        message: "Unauthorised",
      });
      return;
    }
    // await deleteFile(oldImage,"SocialMediaApp")
    await Profile.findOneAndUpdate({useremail:usernameemail},{profileImage:profileImage})
    res.json({
      success: true,
      message: "Profile updated successfully",
    });
    return;
  } catch (error) {
    res.json({
      success: false,
      message: "Some error accured!",
    });
    return;
  }
});

router.post("/getFollowers", Authuser, async (req, res) => {
  try {
    let { secret, token } = req.body;
    if (req.method !== "POST" || secret !== REACT_APP_SECRET) {
      res.json({ success: false, message: "Unauthorised" });
      return;
    }

    const decode = jwt.verify(token, JWT_SECRET);
    const { profileid } = decode;
    const uprofile = await Profile.findOne({ _id: profileid });

    let followersfollowingprof = [];
    for (let index = 0; index < uprofile?.following?.length; index++) {
      if (uprofile?.followers?.includes(uprofile?.following[index])) {
        const uprofilefind = await Profile.findOne({
          _id: uprofile?.following[index],
        });
        if (uprofilefind != null) {
          followersfollowingprof.push(uprofilefind);
        }
      }
    }
    res.json({
      success: true,
      message: "Profiles!",
      profiles: followersfollowingprof,
    });
    return;
  } catch (error) {
    res.json({ success: false, message: "Some error accured!" });
    return;
  }
});

module.exports = router;
