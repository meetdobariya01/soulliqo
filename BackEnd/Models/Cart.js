const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      type: { type: String, enum: ["product", "box"], required: true },
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, // for single product
      box: { type: mongoose.Schema.Types.ObjectId, ref: "Box" },         // for box
      name: String,   // optional, mostly for boxes
      size: Number,   // optional, only for box
      price: Number,  // final price of the item
      quantity: { type: Number, default: 1 },
      products: [     // only for custom box
        {
          product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
          quantity: { type: Number }
        }
      ]
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Cart", CartSchema);
