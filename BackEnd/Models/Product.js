const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  price: { type: Number, required: true }, // price per single chocolate
  image: { type: String },
  isAvailable: { type: Boolean, default: true },
  ratings: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User " },
      rating: Number,
      review: String,
    },
  ],
}, { timestamps: true });
module.exports = mongoose.model("Product", ProductSchema);