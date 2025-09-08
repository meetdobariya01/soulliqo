const mongoose = require("mongoose");

const boxSizeSchema = new mongoose.Schema({
  label: String,   // e.g. "Box of 12"
  quantity: Number
});

const collectionSchema = new mongoose.Schema({
  name: String,             // e.g. "Signature Collection"
  boxSizes: [boxSizeSchema]
});

const categorySchema = new mongoose.Schema({
  name: String,             // e.g. "Pralines"
  collections: [collectionSchema]
});

const chocolateSchema = new mongoose.Schema({
  brand: { type: String, default: "Sweet Indulgence" },
  categories: [categorySchema]
});

// If model already exists, reuse it (important for hot reloads / PM2 restarts)
module.exports = mongoose.models.Chocolate || mongoose.model("Chocolate", chocolateSchema);
