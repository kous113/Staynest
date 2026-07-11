const express=require("express");
const router=express.Router({mergeParams: true});
const Listing = require("../models/listing.js");
const Review=require("../models/review.js");
const {reviewSchema}=require("../schema.js")
const asyncWrap=require("../utils/async.js");
const ExpressError=require("../utils/Expresserror.js");


const validateReview=(req,res,next)=>{
  const {error}=reviewSchema.validate(req.body);
  
  if(error){
    const errorMsg=error.details.map((el)=>`${el.context.key} is required`).join(",");
    throw new ExpressError(404,errorMsg);
  }
  else{
    next();
  }
}
router.post("/",validateReview,asyncWrap(async(req,res)=>{
  let newReview = new Review(req.body.review);
  let listing=await Listing.findById(req.params.id);
  await listing.review.push(newReview);

  await listing.save();
  await newReview.save();
  res.redirect(`/listings/${req.params.id}`);
}));

//Delete review
router.delete("/:reviewId",asyncWrap(async(req,res)=>{
  let {id,reviewId}=req.params;
  await Review.findByIdAndDelete(reviewId);
  await Listing.findByIdAndUpdate(id,{$pull: {review:reviewId}});
    
  res.redirect(`/listings/${id}`);
}))
module.exports=router;