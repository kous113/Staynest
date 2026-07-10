const express = require("express");
const app = express();
const port = 8000;
const mongoose = require("mongoose");
const mongoURL = "mongodb://127.0.0.1:27017/staynest";
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const path = require("path");
const methodOverriding = require("method-override");
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverriding("_method"));
app.use(express.static("public"));
const asyncWrap=require("./utils/async.js");
const ExpressError=require("./utils/Expresserror.js");
const {listingSchema, reviewSchema }=require("./schema.js");
const Joi=require("joi");

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



//connecting to database
main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(mongoURL);
}

app.listen(port, () => {
  console.log("server working");
});

//Home page
app.get("/staynest", (req, res) => {
  res.send("home page");
});
//Showing all listings
app.get("/staynest/listings", asyncWrap(async (req, res) => {
  const allList = await Listing.find({});
  //console.log(allList);
  res.render("index.ejs", { allList });
}));

//New List
app.get("/staynest/listings/new", (req, res) => {
  res.render("newlist.ejs");
});

//Showing particular list details
app.get("/staynest/listings/:id", asyncWrap(async (req, res) => {
  const { id } = req.params;
  let list = await Listing.findById(id).populate("review");
  console.log(list);
  res.render("show.ejs", { list });
}));

//New List
app.post("/staynest/listings", validateSchema, asyncWrap(async (req, res,next) => {
  const newList = new Listing(req.body.listings);
  await newList.save();
  res.redirect("/staynest/listings");
}));

//Update list
app.get("/staynest/listings/:id/edit", validateSchema, asyncWrap(async (req, res) => {
  const { id } = req.params;
  const list = await Listing.findById(id);
  res.render("edit.ejs", { list });
}));
app.put("/staynest/listings/:id", asyncWrap(async (req, res) => {
  const { id } = req.params;
  //console.log(id);
  const list = await Listing.findByIdAndUpdate(id, { ...req.body.listings });

  res.redirect(`/staynest/listings/${id}`);
}));


//Delete List
app.delete("/staynest/listings/:id", asyncWrap(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/staynest/listings");
}));


//Review
app.post("/staynest/listings/:id/review",validateReview,asyncWrap(async(req,res)=>{
  let newReview = new Review(req.body.review);
  console.log(newReview);
  let listing=await Listing.findById(req.params.id);
  await listing.review.push(newReview);

  await listing.save();
  await newReview.save();
  res.redirect(`/staynest/listings/${req.params.id}`);
}));

//Delete review
app.delete("/staynest/:id/review/:reviewId",asyncWrap(async(req,res)=>{
  let {id,reviewId}=req.params;
  await Review.findByIdAndDelete(reviewId);
  await Listing.findByIdAndUpdate(id,{$pull: {review:reviewId}});

  res.redirect(`/staynest/listings/${id}`);
}))

//Log in and sign in form
app.get("/staynest/signIn", (req, res) => {
  res.render("sign.ejs");
});
//log in post req
app.post("/staynest/login",(req,res)=>{
  console.log(req.body);
  res.redirect("/staynest");
})
//registe post req
app.post("/staynest/register",(req,res)=>{
  console.log(req.body);
  res.redirect("/staynest");
})
//favicon
app.get("/favicon.ico", (req, res) => {
  res.status(204).end();
});


app.all("/{*splat}",(req,res,next)=>{
  console.log(req.originalUrl);
  next(new ExpressError(404, "Page not found"));
})
//unknow route calling error
app.use((err,req,res,next)=>{
  console.dir(err);
  const {statusCode=500,message="something went wrong"}=err;
  res.render("error.ejs",{err});
})