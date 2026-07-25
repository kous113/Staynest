const Listing = require("./models/listing.js");
const {listingSchema }=require("./schema.js");
const ExpressError=require("./utils/Expresserror.js");
const {reviewSchema}=require("./schema.js");
const Review = require("./models/review.js");
module.exports.isLoggedin=((req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be signed in to perform this action.");
        return res.redirect("/staynest/sign-in");
    }
    next();
});

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.savedUrl=req.session.redirectUrl;
    }
    next();
}
module.exports.getOwner=async(req,res,next)=>{
    const { id } = req.params;
    let getList=await Listing.findById(id);
    if(!getList.owner.equals(req.user._id)){
        req.flash("error","You don't have permission for this action");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
//validate schemas
module.exports.validateSchema=(req,res,next)=>{
  const {error}=listingSchema.validate(req.body);
  
  if(error){
    const errorMsg=error.details.map((el)=>`${el.context.key} is required`).join(",");
    throw new ExpressError(404,errorMsg);
  }
  else{
    next();
  }
}
//validate review
module.exports.validateReview=(req,res,next)=>{
  const {error}=reviewSchema.validate(req.body);
  
  if(error){
    const errorMsg=error.details.map((el)=>`${el.context.key} is required`).join(",");
    throw new ExpressError(404,errorMsg);
  }
  else{
    next();
  }
}

//review authorization
module.exports.reviewAuthor=async(req,res,next)=>{
    const { reviewId,id } = req.params;
    let review=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You don't have permission for this action");
        return res.redirect(`/listings/${id}`);
    }
    next();
}