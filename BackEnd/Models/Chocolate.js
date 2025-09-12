const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const chocolateSchema = new Schema({
  categoryName: { type: String, required: true },  // Denormalized string (e.g., 'Classic')
  chocolateType: { type: String, required: true },  // e.g., 'Nuts'
  chocolateName: { type: String, required: true },  // e.g., 'Almond Delight'
  boxName: { type: String, required: true }  // Denormalized string (e.g., 'Small Box') – Changed from ObjectId
}, {
  timestamps: true
});
// Index for queries by boxName (string) and categoryName
chocolateSchema.index({ boxName: 1 });
chocolateSchema.index({ categoryName: 1 });
module.exports = mongoose.model('Chocolate', chocolateSchema);