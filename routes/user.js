const express=require("express");
const router=express.Router();
const User = require("../models/user.js");


//Log in and sign in form
router.get("/sign-up", (req, res) => {
    const activeForm = req.session.activeForm || "signin";
    req.session.activeForm = null;

    res.render("signIn.ejs", {
        activeForm,
        showGlobalFlash: false
    });
});
//log in post req
// router.post("/sign-in",(req,res)=>{
//   let detail=req.body;
//   console.log(detail);
//   res.send("/staynest");
// })
//registe post req
router.post("/sign-up",async(req,res)=>{
  try{
      let {username,email,password}=req.body;
      let newUser=new User({username,email});
      let detail= await User.register(newUser,password);
      res.redirect("/listings");
  }catch(e){
    req.flash("error",e.message);
    req.session.activeForm = "signup";
    res.redirect("/staynest/sign-up");
  }
})
module.exports=router;