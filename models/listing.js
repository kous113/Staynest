const { ref } = require("joi");
const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const listngSchema=new Schema({
  title:{
    type: String,
  },
  description:{
    type: String,
  },  
  image:{
    type: String,
    default:"https://thumbs.dreamstime.com/b/idyllic-summer-landscape-clear-mountain-lake-alps-45054687.jpg",
    set: (v)=>v===""?"https://thumbs.dreamstime.com/b/idyllic-summer-landscape-clear-mountain-lake-alps-45054687.jpg":(v),
  },
  price:{
    type: Number,
  },
  location:{
    type: String,
  },
  country:{
    type:String,
  },
  owner:{
    type: String,
  },
  review:[
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    }
  ]
});

const Listing=mongoose.model("Listing",listngSchema);
module.exports=Listing;