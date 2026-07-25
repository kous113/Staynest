const express=require("express");
const router=express.Router({mergeParams: true});
const Listing = require("../models/listing.js");
const Review=require("../models/review.js");
const asyncWrap=require("../utils/async.js");
const {validateReview,isLoggedin,reviewAuthor}=require("../middleware.js")


router.post("/",isLoggedin,validateReview,asyncWrap(async(req,res)=>{
  let newReview = new Review(req.body.review);
  newReview.author=req.user._id;
  let listing=await Listing.findById(req.params.id);
  await listing.review.push(newReview);

  await listing.save();
  await newReview.save();
  res.redirect(`/listings/${req.params.id}`);
}));

//Delete review
router.delete("/:reviewId",isLoggedin,reviewAuthor,asyncWrap(async(req,res)=>{
  let {id,reviewId}=req.params;
  await Review.findByIdAndDelete(reviewId);
  await Listing.findByIdAndUpdate(id,{$pull: {review:reviewId}});
    
  res.redirect(`/listings/${id}`);
}))
module.exports=router;