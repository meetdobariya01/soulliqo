const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  cartId: { type: mongoose.Schema.Types.ObjectId, ref: "Cart", required: true },

  items: [
    {
      type: { type: String, enum: ["product", "box"], required: true },
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      box: { type: mongoose.Schema.Types.ObjectId, ref: "Box" },
      name: String,
      size: Number,
      price: Number,
      quantity: Number,
      products: [
        {
          product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
          quantity: Number
        }
      ]
    }
  ],

  subtotal: Number,
  sgst: Number,
  cgst: Number,
  other: Number,
  totalAmount: { type: Number, required: true },

  address: {
    houseNumber: String,
    buildingName: String,
    societyName: String,
    road: String,
    landmark: String,
    city: { type: String, required: true },
    pincode: { type: String, required: true }
  },

  status: {
    type: String,
    default: "Pending" // Pending, Preparing, Shipped, Delivered
  }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
