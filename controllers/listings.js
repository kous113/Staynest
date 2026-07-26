const Listing=require("../models/listing");
//Showing all Lists
module.exports.index=async (req, res) => {
  const allList = await Listing.find({});
  res.render("index.ejs", { allList });
}
//Rendering form for create new List
module.exports.renderNewForm=(req, res) => {
  res.render("newlist.ejs");
}
//New List Creation
module.exports.createList=async (req, res,next) => {
  const newList = new Listing(req.body.listings);
  newList.owner=req.user._id;
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
  if(!list){
    req.flash("error", "The list you searched can not be find");
    res.redirect("/listings");
  }
  else{
    res.render("edit.ejs", { list });
  }  
}
//Updating a list
module.exports.updateList=async (req, res) => {
  const { id } = req.params;
    const list = await Listing.findByIdAndUpdate(id, { ...req.body.listings });
    res.redirect(`/listings/${id}`);
}
//Deleting a List
module.exports.destroyList=async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
}