  const mongoose = require('mongoose');
  const Schema = mongoose.Schema;
  const boxSchema = new Schema({
    boxName: { type: String, required: true },
    size: { type: Number, required: true },
    price: { type: Number, required: true },
    categoryName: { type: String, required: true }
  }, {
    timestamps: true
  });
  // Fix index to match field
  boxSchema.index({ categoryName: 1 });
  module.exports = mongoose.model('Box', boxSchema);
  