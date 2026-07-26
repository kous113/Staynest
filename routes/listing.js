const express=require("express");
const router=express.Router();
const Listing = require("../models/listing.js");
const asyncWrap=require("../utils/async.js");
const {isLoggedin,getOwner,validateSchema}=require("../middleware.js");
const listingController=require("../controllers/listings.js");


router.route("/")
    .get(asyncWrap(listingController.index))
    .post(validateSchema, asyncWrap(listingController.createList));


router.get("/new",isLoggedin,listingController.renderNewForm);

router.route("/:id")
.get((listingController.showList))
.put(getOwner, asyncWrap(listingController.updateList))
.delete(isLoggedin,getOwner,asyncWrap(listingController.destroyList));

router.get("/:id/edit", validateSchema,isLoggedin,getOwner,asyncWrap(listingController.updateForm));


module.exports=router;