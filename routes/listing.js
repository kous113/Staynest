const express=require("express");
const router=express.Router();
const Listing = require("../models/listing.js");
const asyncWrap=require("../utils/async.js");
const ExpressError=require("../utils/Expresserror.js");
const {listingSchema }=require("../schema.js");
const session = require("express-session");
const {isLoggedin}=require("../middleware.js");
const {saveRedirectUrl}=require("../middleware.js");


//validate schemas
const validateSchema=(req,res,next)=>{
  const {error}=listingSchema.validate(req.body);
  
  if(error){
    const errorMsg=error.details.map((el)=>`${el.context.key} is required`).join(",");
    throw new ExpressError(404,errorMsg);
  }
  else{
    next();
  }
}
//Showing all listings
router.get("/", asyncWrap(async (req, res) => {
  const allList = await Listing.find({});
  //console.log(allList);
  res.render("index.ejs", { allList });
}));

//New List
router.get("/new",isLoggedin,(req, res) => {
  //.log(req.originalUrl);
  res.render("newlist.ejs");
});

//Showing particular list details
router.get("/:id", asyncWrap(async (req, res) => {
  const { id } = req.params;
  let list = await Listing.findById(id).populate("review");
  if(!list){
    req.flash("error", "The list you searched can not be find");
    res.redirect("/listings");
  }
  else{
    res.render("show.ejs", { list });
  }
}));

//New List
router.post("/", validateSchema, asyncWrap(async (req, res,next) => {
  const newList = new Listing(req.body.listings);
  await newList.save();
  req.flash("success", "New list created suceesfully");
  res.redirect("/listings");
}));

//Update list
router.get("/:id/edit", validateSchema,isLoggedin,asyncWrap(async (req, res) => {
  const { id } = req.params;
  const list = await Listing.findById(id);
  if(!list){
    req.flash("error", "The list you searched can not be find");
    res.redirect("/listings");
  }
  else{
    res.render("edit.ejs", { list });
  }
  
}));
router.put("/:id", asyncWrap(async (req, res) => {
  const { id } = req.params;
  //console.log(id);
  const list = await Listing.findByIdAndUpdate(id, { ...req.body.listings });

  res.redirect(`/listings/${id}`);
}));


//Delete List
router.delete("/:id", isLoggedin,asyncWrap(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
}));

module.exports=router;