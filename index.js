const express = require("express");
const cloudinary = require("cloudinary").v2;
const app = express();
const ConnectDb = require("./_db");
const router = express.Router();
const cors = require("cors");
var bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// io.on("connection", (socket) => {
//   console.log("a user connected");

//   socket.on("join_room",(data)=>{
//     socket.join(data);
//   })
//   socket.on("chat message", (msg) => {
//       console.log("message: " + msg);
//       io.emit("chat message", msg);
//   });
//   socket.on("disconnect", () => {
//       console.log("user disconnected");
//   });
// });

let activeUsers = [];

io.on("connection", (socket) => {
  // add new User
  socket.on("new-user-add", (newUserId) => {
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({ userId: newUserId, socketId: socket.id });
      console.log("New User Connected", activeUsers);
    }
    // send all active users to new user
    io.emit("get-users", activeUsers);
  });

  socket.on("disconnect", () => {
    // remove user from active users
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    console.log("User Disconnected", activeUsers);
    // send all active users to all users
    io.emit("get-users", activeUsers);
  });

  // send message to a specific user
  socket.on("send-message", (data) => {
    const { receiverId } = data;
    const user = activeUsers.find((user) => user.userId === receiverId);
    console.log("Sending from socket to :", receiverId);
    console.log("Data: ", data);
    if (user) {
      io.to(user.socketId).emit("recieve-message", data);
    }
  });
});

const PORT = process.env.PORT || 5000;
cloudinary.config({
  cloud_name: "dyyonlqge",
  api_key: "516461442442267",
  api_secret: "3vN7RTWhEOGYW-Po7LauxGOSN8g",
  secure: true,
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.REACT_APP_LOCALHOST);
  // You can also specify other CORS headers as needed
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(router);
app.use(
  cors({
    origin: process.env.REACT_APP_LOCALHOST,
    methods: ["GET", "POST"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.get("/", (req, res) => {
  res.json({ docker: "Welcome to my container" });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(express.json());
ConnectDb();
app.use("/api/auth", require("./routes/auth"));
app.use("/api/addpost", require("./routes/addpost"));
app.use("/api/story", require("./routes/story"));
// app.use("/api/order",require("./routes/order"))

server.listen(PORT, () => {
  console.log(`app is started in ${PORT}`);
});
// app.listen(PORT,()=>{
//     console.log(`app is started`);
// })
