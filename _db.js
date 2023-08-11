require("dotenv")?.config();
const mongoose = require("mongoose");
const databasename = process.env.DB_NAME 

const ConnectDb = async () => {
  mongoose.set("strictQuery", true);
  mongoose
    .connect(databasename)
    .then(() => {
      console.log("connection created successfully");
    })
    .catch((err) => {
      console.log(err);
    });
};
module.exports = ConnectDb;
