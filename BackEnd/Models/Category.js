const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  COLLECTION: String,
  description: String,
  image: String,
});

module.exports =
  mongoose.models.Category ||
  mongoose.model("Category", categorySchema, "categories");
