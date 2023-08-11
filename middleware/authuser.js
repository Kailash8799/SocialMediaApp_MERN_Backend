const jwt = require("jsonwebtoken");
var JWT_SECRET = process.env.JWT_SECRET;
const User = require("../models/User");

async function Authuser(req, res, next) {
  try {
    const token = req.body.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Invalid Token Format",
      });
    }
    const decode = jwt.verify(token, JWT_SECRET);
    const { username, email } = decode;
    let ur = await User.findOne(
      { username: username, email: email },
      { _id: 0, username: 0, email: 0, password: 0 }
    );
    if (ur) {
      req.userdata = ur;
      next();
    } else {
      return res.status(401).json({
        success: false,
        message: "Invalid Token",
      });
    }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: "Session Expired",
        error: error.message,
      });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: "Invalid Token",
        error: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: "Internal server Error",
      error: error.message,
      stack: error.stack,
    });
  }
}

module.exports = Authuser;
