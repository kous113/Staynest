const express=require("express");
const router=express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const {saveRedirectUrl}=require("../middleware.js")
//sign-up
router.get("/sign-up", (req, res) => {
    res.render("signUp.ejs", {
      error: req.flash("error"),
      showGlobalFlash: false
    });
});
router.post("/sign-up",async(req,res,next)=>{
  try{
      let {username,email,password}=req.body;
      let newUser=new User({username,email});
      await User.register(newUser,password);
      req.login(newUser,(err)=>{
        if(err){
          next(err);
        }

        res.redirect("/listings");
      })
  }catch(e){
    req.flash("error",e.message);
    res.redirect("/staynest/sign-up");
  }
})


//Log in form
router.get("/sign-in", (req, res) => {
  console.log(req.originalUrl);
    res.render("signIn.ejs", {
        showGlobalFlash: false
    });
});
router.post("/sign-in",saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/staynest/sign-in", failureFlash:true,}), async(req,res)=>{
  
  console.log("Login successful");
  console.log(res.locals.savedUrl);
  res.redirect(res.locals.savedUrl || "/listings");
})

router.get("/logout",(req,res,next)=>{
  req.logout((err)=>{
    if(err){
      next(err);
    }
    req.flash("success","You Logged Out Successfully!");
    res.redirect("/listings");
  })
})


module.exports=router;