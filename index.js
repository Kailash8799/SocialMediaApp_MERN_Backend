const express = require('express');
const cloudinary = require('cloudinary').v2;
const fileUpload = require('express-fileupload');
const app = express()
const ConnectDb = require("./_db")
const router = express.Router()
const cors = require("cors")
var bodyParser = require('body-parser')

const PORT = process.env.PORT || 5000
cloudinary.config({
    cloud_name:'dyyonlqge',
    api_key:'516461442442267',
    api_secret:'3vN7RTWhEOGYW-Po7LauxGOSN8g',
    secure: true
  });
  
app.use(router)
app.use(cors())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://linkagenetwork.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
// app.use(express.json());  
ConnectDb()
app.use("/api/auth",require("./routes/auth"))
app.use("/api/addpost",require("./routes/addpost"))
// app.use("/api/order",require("./routes/order"))

app.listen(PORT,()=>{
    console.log(`app is started`);
})