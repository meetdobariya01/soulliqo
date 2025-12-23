const mongoose = require("mongoose");

const chocolateSchema = new mongoose.Schema({
  chocolateName: String,
  chocolateType: String,
  COLLECTION: String,
  description: String,
  price: Number,
  image: String,
  BoxCategories: [String],
  SKU_CODE: String,
});

module.exports =
  mongoose.models.Chocolate || mongoose.model("Chocolate", chocolateSchema);
