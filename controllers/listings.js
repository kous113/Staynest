const Listing=require("../models/listing");
const {getNames}=require("country-list");
const countries=getNames();
//Showing all Lists
module.exports.index = async (req, res) => {
    const { category, search } = req.query;

    let allList;

    if (search) {
        allList = await Listing.find({ location: search });

        if (allList.length === 0) {
            req.flash("error", `No listings found in ${search}.`);
            return res.redirect("/listings");
        }
    }
    else if (category) {
        allList = await Listing.find({ category });

        if (allList.length === 0) {
            req.flash("error", `No ${category} listings found.`);
            return res.redirect("/listings");
        }
    }
    else {
        allList = await Listing.find({});
    }

    res.render("index.ejs", {
        allList,
        selectedCategory: category
    });
};
//Rendering form for create new List
module.exports.renderNewForm=(req, res) => {
  res.render("newlist.ejs",{countries});
}
//New List Creation
module.exports.createList=async (req, res,next) => {
  let url=req.file.path;
  let filename=req.file.filename;
  const newList = new Listing(req.body.listings);
  newList.owner=req.user._id;
  newList.image={url,filename};
  await newList.save();
  req.flash("success", "New list created suceesfully");
  res.redirect("/listings");
}
//Showing a particular list
module.exports.showList=async (req, res) => {
  const { id } = req.params;
  let list = await Listing.findById(id).populate({path:"review",populate:{path:"author"},})
  .populate("owner");
  if(!list){
    req.flash("error", "The list you searched can not be find");
    res.redirect("/listings");
  }
  else{
    res.render("show.ejs", { list });
  }
}
//Rendering updation form
module.exports.updateForm=async (req, res) => {
  const { id } = req.params;
  const list = await Listing.findById(id);
  let originalUrl=list.image.url;
  originalUrl=originalUrl.replace("/upload","/upload/h_250");
  if(!list){
    req.flash("error", "The list you searched can not be find");
    res.redirect("/listings");
  }
  else{
    res.render("edit.ejs", { list,originalUrl });
  }  
}
//Updating a list
module.exports.updateList=async (req, res) => {
    const { id } = req.params;
    const list = await Listing.findByIdAndUpdate(id, { ...req.body.listings });
    if(typeof req.file != "undefined"){
      let url=req.file.path;
      let filename=req.file.filename;
      list.image={url,filename};
      list.save();
    }
    res.redirect(`/listings/${id}`);
}
//Deleting a List
module.exports.destroyList=async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
}