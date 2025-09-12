const mongoose = require('mongoose');
  const Schema = mongoose.Schema;
  const categorySchema = new Schema({
    categoryName: { type: String, required: true, unique: true },
    description: { type: String, default: '' }
  }, {
    timestamps: true
  });
  // Fix index to match field
  categorySchema.index({ categoryName: 1 });
  module.exports = mongoose.model('Category', categorySchema);