const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String ,required: true},
  weight: { type: String },
  slug: { type: String, unique: true }, // Ensure slugs are unique for product URLs
  additionalInfo: { type: String },
  ingredients: { type: [String] },

  isAvailable: { type: Boolean, default: true },

  ratings: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      rating: { type: Number, min: 1, max: 5 },
      review: String,
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model("Product", ProductSchema);