const { ref } = require("joi");
const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const review=require("./review.js");
const Review = require("./review.js");
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
  review:[
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    }
  ],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User"
  }
});

listngSchema.post("findOneAndDelete",async (listing) => {
  await Review.deleteMany({_id:{$in: listing.review}});
})

const Listing=mongoose.model("Listing",listngSchema);
module.exports=Listing;