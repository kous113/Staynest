const express=require("express");
const router=express.Router();
const passport = require("passport");
const {saveRedirectUrl}=require("../middleware.js")
const asyncWrap=require("../utils/async.js");
const userController=require("../controllers/user.js")

//sign-up
router.route("/sign-up")
.get(userController.renderSignUpForm)
.post(asyncWrap(userController.signUp));

router.route("/sign-in")
.get(userController.renderSignInForm)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/sign-in", failureFlash:true,}), userController.signIn);

//Log out
router.get("/logout",userController.logOut);

module.exports=router;