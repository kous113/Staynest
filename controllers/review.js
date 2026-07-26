const Listing=require("../models/listing");
const Review=require("../models/review");


//create review
module.exports.createReview=async(req,res)=>{
  let newReview = new Review(req.body.review);
  newReview.author=req.user._id;
  let listing=await Listing.findById(req.params.id);
  await listing.review.push(newReview);

  await listing.save();
  await newReview.save();
  res.redirect(`/listings/${req.params.id}`);
}
//Delete review
module.exports.destroyReview=async(req,res)=>{
  let {id,reviewId}=req.params;
  await Review.findByIdAndDelete(reviewId);
  await Listing.findByIdAndUpdate(id,{$pull: {review:reviewId}});
    
  res.redirect(`/listings/${id}`);
}