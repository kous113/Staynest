const express = require("express");
const app = express();
const port = 8000;
const mongoose = require("mongoose");
const mongoURL = "mongodb://127.0.0.1:27017/staynest";
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
const listing=require("./routes/listing.js");
const review=require("./routes/review.js")
const user=require("./routes/user.js")
const session=require("express-session");
const flash=require("connect-flash");
const User=require("./models/user.js");
const LocalStrategy = require("passport-local");
const passport = require("passport");


const sessionOptions={
  secret: "mysecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    maxage: 7*24*60*60*1000,
    httpOnly: true,
  }
};
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
})


// app.get("/demouser",async(req,res)=>{
//   let fakeuser=new User({
//     email:"hello@gmail.com",
//     username:"wow"
//   })
//   let newuser=await User.register(fakeuser,"helloworld");
//   res.send(newuser);
// })




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
app.use("/staynest",user);




//Log in and sign in form
app.get("/staynest/sign-up", (req, res) => {
  res.render("signIn.ejs");
});
//log in post req
app.post("/staynest/sign-in",(req,res)=>{
  let detail=req.body;
  console.log(detail);
  res.send("/staynest");
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

// app.use((req, res, next) => {
//     console.log("Incoming request:", req.method, req.originalUrl);
//     next();
// });

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