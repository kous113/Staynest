const cloudinary = require('cloudinary').v2
const {CloudinaryStorage}=require("multer-storage-cloudinary");
const { param } = require('./routes/listing');

const {
  CLOUD_NAME,
  CLOUD_API_KEY,
  CLOUD_API_SECRET,
} = process.env;
// console.log({
//   CLOUD_NAME,
//   CLOUD_API_KEY,
//   CLOUD_API_SECRET,
// });
cloudinary.config({
    cloud_name:CLOUD_NAME,
    api_key:CLOUD_API_KEY,
    api_secret:CLOUD_API_SECRET,
    
})
const storage= new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:"staynest",
        allowedFormats:["png","jpeg","jpg"],
    },
})
module.exports={storage,cloudinary};