const mongoose = require('mongoose');
const foodSchema = new mongoose.Schema({
  FoodName: String,
  FoodPrice: Number,
  Description: String,
  Category: String,
  Type: String,
  Photos: String,
  Unit: String,
  
  ratings: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      stars: { type: Number, min: 1, max: 5 }, // ⭐ star rating
      comment: { type: String },
      createdAt: { type: Date, default: Date.now }
    }
  ],

  averageRating: { type: Number, default: 0 },
});
module.exports = mongoose.model('Foods', foodSchema);