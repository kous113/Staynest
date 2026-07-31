if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const express = require("express");
const app = express();
const port = 8000;
const mongoose = require("mongoose");
const path = require("path");
const methodOverriding = require("method-override");
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverriding("_method"));
app.use(express.static("public"));
const ExpressError=require("./utils/Expresserror.js");
const listing=require("./routes/listing.js");
const review=require("./routes/review.js")
const user=require("./routes/user.js")
const session=require("express-session");
const {MongoStore} = require('connect-mongo');
const flash=require("connect-flash");
const User=require("./models/user.js");
const LocalStrategy = require("passport-local");
const passport = require("passport");


const store = MongoStore.create({
    mongoUrl: process.env.ATLASDB_URL,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 2 * 24 * 3600
});

store.on("error",(err)=>{
  console.log("got error in session store",err);
})
const sessionOptions={
  store,
  secret:process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    maxAge: 7*24*60*60*1000,
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

//connecting to database
main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  console.log("ATLASDB_URL exists:", !!process.env.ATLASDB_URL);
  console.log("ATLASDB_URL starts with:", process.env.ATLASDB_URL?.substring(0, 15));
  await mongoose.connect(process.env.ATLASDB_URL);
}

app.listen(port, () => {
  console.log("server working");
});


app.use("/listings",listing);
app.use("/listings/:id/review",review);
app.use("/",user);

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