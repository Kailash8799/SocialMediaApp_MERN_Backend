const express = require("express");
const app = express();
const router = express.Router();
const http = require("http");
const User = require("../models/User");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const Authuser = require("../middleware/authuser");
var JWT_SECRET = process.env.JWT_SECRET;
var AES_SECRET = process.env.AES_SECRET;
var REACT_APP_SECRET = process.env.REACT_APP_SECRET;
const nodemailer = require("nodemailer");
const Profile = require("../models/Profile");
const REACT_APP_URL = process.env.REACT_APP_LOCALHOST;
const {Server} = require("socket.io");

const server = http.createServer(app);
server.listen(3001, () => {});

const io = new Server(server, {
  cors: {
    origin: "*",
    methods:["GET","POST"]
  },
});

io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("chat message", (msg) => {
        console.log("message: " + msg);
        io.emit("chat message", msg);
    });
    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});

router.post("/", async(req,res)=>{
    res.status(200).json({message:"chat route"})
})

module.exports = router;