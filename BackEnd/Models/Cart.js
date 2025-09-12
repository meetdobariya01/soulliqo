const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      type: { type: String, enum: ["product", "box"], required: true },

      // For single product
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },

      // For box / custom box
      box: { type: mongoose.Schema.Types.ObjectId, ref: "Box" },
      name: String,     // e.g. "Custom Small Box"
      size: Number,     // for boxes
      price: Number,    // final calculated price
      quantity: { type: Number, default: 1 },

      // Only for custom boxes
      products: [
        {
          product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
          quantity: { type: Number }
        }
      ]
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Cart", CartSchema);
