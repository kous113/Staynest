const express=require("express");
const router=express.Router();
const Listing = require("../models/listing.js");
const asyncWrap=require("../utils/async.js");
const ExpressError=require("../utils/Expresserror.js");
const {listingSchema }=require("../schema.js");


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
router.get("/new", (req, res) => {
  res.render("newlist.ejs");
});

//Showing particular list details
router.get("/:id", asyncWrap(async (req, res) => {
  const { id } = req.params;
  let list = await Listing.findById(id).populate("review");
  res.render("show.ejs", { list });
}));

//New List
router.post("/", validateSchema, asyncWrap(async (req, res,next) => {
  const newList = new Listing(req.body.listings);
  await newList.save();
  res.redirect("/listings");
}));

//Update list
router.get("/:id/edit", validateSchema, asyncWrap(async (req, res) => {
  const { id } = req.params;
  const list = await Listing.findById(id);
  res.render("edit.ejs", { list });
}));
router.put("/:id", asyncWrap(async (req, res) => {
  const { id } = req.params;
  //console.log(id);
  const list = await Listing.findByIdAndUpdate(id, { ...req.body.listings });

  res.redirect(`/listings/${id}`);
}));


//Delete List
router.delete("/:id", asyncWrap(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
}));

module.exports=router;