const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const reviewSchema=new Schema({
    rating:{
        type:Number,
        min:1,
        max:5
    },
    comments:{
        type:String
    }
})
const Review=mongoose.model("Review",reviewSchema);
module.exports=Review;