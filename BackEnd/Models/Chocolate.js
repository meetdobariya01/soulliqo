import mongoose from "mongoose";

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

export default mongoose.model("Chocolate", chocolateSchema);