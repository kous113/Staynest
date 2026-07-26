const express=require("express");
const router=express.Router({mergeParams: true});
const asyncWrap=require("../utils/async.js");
const {validateReview,isLoggedin,reviewAuthor}=require("../middleware.js")
const reviewController=require("../controllers/review.js");

//create review
router.post("/",isLoggedin,validateReview,asyncWrap(reviewController.createReview));

//Delete review
router.delete("/:reviewId",isLoggedin,reviewAuthor,asyncWrap(reviewController.destroyReview))
module.exports=router;