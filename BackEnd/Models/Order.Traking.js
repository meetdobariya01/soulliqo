const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    cartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
      required: true,
    },

    // 🔹 Support both product and box items
    items: [
      {
        type: {
          type: String,
          enum: ["product", "box"],
          required: true,
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        box: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Box",
        },
        name: String,
        size: Number,
        price: Number,
        quantity: {
          type: Number,
          default: 1,
        },
        products: [
          {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            quantity: Number,
          },
        ],
      },
    ],

    // 🔹 Pricing
    subtotal: { type: Number, required: true },
    sgst: { type: Number, default: 0 },
    cgst: { type: Number, default: 0 },
    other: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },

    // 🔹 Address
    address: {
      firstName: String,
      lastName: String,
      street: String,
      state: String,
      city: { type: String, required: true },
      pincode: { type: String, required: true },
      email: String,
      mobile: String,
    },

    // 🔹 Order Tracking
    status: {
      type: String,
      enum: ["Pending", "Preparing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },

    trackingHistory: [
      {
        status: {
          type: String,
          enum: ["Pending", "Preparing", "Shipped", "Delivered", "Cancelled"],
        },
        date: { type: Date, default: Date.now },
        message: String,
      },
    ],
  },
  { timestamps: true }
);

// 🟢 Automatically add tracking history when status changes
orderSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    this.trackingHistory.push({
      status: this.status,
      message: `Order marked as ${this.status}`,
    });
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);
