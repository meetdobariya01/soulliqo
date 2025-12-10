
const mongoose = require("mongoose");

const boxSchema = new mongoose.Schema({
  boxName: String,
  COLLECTION: String,
  size: Number,
  price: Number,
  description: String,
  totalLimit: Number,
  typeLimits: Object,
  BoxCategories: [String],
  image: String,
  additionalInformation: String,
});

module.exports = mongoose.models.Box || mongoose.model("Box", boxSchema);
