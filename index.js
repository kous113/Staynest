const express = require("express");
const app = express();
const port = 8000;
const mongoose = require("mongoose");
const mongoURL = "mongodb://127.0.0.1:27017/staynest";
const Listing = require("./models/listing.js");
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
const { nextTick } = require("process");
const listingSchema=require("./schema.js");
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
  let list = await Listing.findById(id);
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



app.all("/{*splat}",(req,res,next)=>{
  next(new ExpressError(404, "Page not found"));
})
//unknow route calling error
app.use((err,req,res,next)=>{
  console.dir(err);
  const {statusCode=500,message="something went wrong"}=err;
  res.render("error.ejs",{err});
})