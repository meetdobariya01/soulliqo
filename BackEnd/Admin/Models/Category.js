const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  COLLECTION: String,
  description: String,
  image: String,
});

module.exports = mongoose.model("Category", categorySchema);
