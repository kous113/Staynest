const User = require("../models/user.js");

//sign-up form
module.exports.renderSignUpForm=(req, res) => {
    res.render("signUp.ejs", {
      error: req.flash("error"),
      showGlobalFlash: false
    });
}

//sign up
module.exports.signUp=async(req,res,next)=>{
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
    res.redirect("/sign-up");
  }
}

//Log in form
module.exports.renderSignInForm=(req, res) => {
  console.log(req.originalUrl);
    res.render("signIn.ejs", {
        showGlobalFlash: false
    });
}

//Log in
module.exports.signIn=async(req,res)=>{
  res.redirect(res.locals.savedUrl || "/listings");
}

//Log out
module.exports.logOut=(req,res,next)=>{
  req.logout((err)=>{
    if(err){
      next(err);
    }
    req.flash("success","You Logged Out Successfully!");
    res.redirect("/listings");
  })
}