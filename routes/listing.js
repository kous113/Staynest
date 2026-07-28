const express=require("express");
const router=express.Router();
const Listing = require("../models/listing.js");
const asyncWrap=require("../utils/async.js");
const {isLoggedin,getOwner,validateSchema}=require("../middleware.js");
const listingController=require("../controllers/listings.js");
const {storage}=require("../cloudConfig.js");
const multer = require("multer");
const upload = multer({storage});

router.route("/")
    .get(asyncWrap(listingController.index))
    .post(isLoggedin,upload.single("listings[image]"),validateSchema,asyncWrap(listingController.createList));

router.get("/new",isLoggedin,listingController.renderNewForm);

router.route("/:id")
.get((listingController.showList))
.put(isLoggedin,getOwner,upload.single("listings[image]"),validateSchema,asyncWrap(listingController.updateList))
.delete(isLoggedin,getOwner,asyncWrap(listingController.destroyList));

router.get("/:id/edit", validateSchema,isLoggedin,getOwner,asyncWrap(listingController.updateForm));


module.exports=router;