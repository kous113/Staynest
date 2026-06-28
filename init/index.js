const mongoose=require("mongoose");
const Listing=require("../models/listing.js");
const initData=require("./data.js");
const data = require("./data.js");
const mongoURL="mongodb://127.0.0.1:27017/staynest";

//connecting to database
main().then(()=>{
    console.log("connected to db");
}).catch((err) => {
    console.log(err);
})
async function main() {
  await mongoose.connect(mongoURL);
}
const initDB= async()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("initialized");
}
initDB();