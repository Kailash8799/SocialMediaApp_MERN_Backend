const express = require('express');
const app = express()
const ConnectDb = require("./_db")
const router = express.Router()
const cors = require("cors")
const PORT = process.env.PORT || 5000
app.use(router)
app.use(cors())
app.use(express.json())
ConnectDb()
app.use("/api/auth",require("./routes/auth"))
app.use("/api/addpost",require("./routes/addpost"))
// app.use("/api/order",require("./routes/order"))

app.listen(PORT,()=>{
    console.log(`app is started`);
})