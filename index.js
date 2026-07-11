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
const listing=require("./routes/listing.js");
const review=require("./routes/review.js")






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
app.get("/staynest/", (req, res) => {
  res.send("home page");
});



app.use("/listings",listing);
app.use("/listings/:id/review",review);



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