module.exports.isLoggedin=((req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be signed in to perform this action.");
        return res.redirect("/staynest/sign-in");
    }
    next();
});

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.savedUrl=req.session.redirectUrl;
        console.log("hello");
        console.log(res.locals.savedUrl);
    }
    next();
}