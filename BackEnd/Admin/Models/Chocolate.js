const mongoose = require("mongoose");

const chocolateSchema = new mongoose.Schema({
  chocolateName: String,
  chocolateType: String,
  COLLECTION: String,
  SKU_CODE: String,
  price: Number,
  BoxCategories: Array,
  description: String,
  image: String,
});

module.exports = mongoose.model("Chocolate", chocolateSchema);
