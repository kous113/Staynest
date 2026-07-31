const { ref } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const review = require("./review.js");
const Review = require("./review.js");
const listngSchema = new Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  image: {
    url: String,
    filename: String,
  },
  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  review: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  category: {
    type: String,
    enum: [
      "Trending",
      "Beach",
      "Mountain",
      "Camping",
      "Castle",
      "Farm",
      "Pool",
      "City",
      "Arctic",
      "Boat",
      "Homestay",
      "Country Side"
    ],
    default: "Trending",
  },
});

listngSchema.post("findOneAndDelete", async (listing) => {
  await Review.deleteMany({ _id: { $in: listing.review } });
});

const Listing = mongoose.model("Listing", listngSchema);
module.exports = Listing;
