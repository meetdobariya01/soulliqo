const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: [String] },
  price: { type: Number, required: true },
  weight: { type: String },
  description: { type: String },
  isAvailable: { type: Boolean, default: true },
  ratings: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      rating: Number,
      review: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
});
module.exports = mongoose.model("Product", productSchema);