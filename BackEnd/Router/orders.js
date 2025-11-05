const express = require("express");
const asyncHandler = require("../Middleware/asyncHandler");
const { authenticate } = require("../Middleware/authenticate");
const Cart = require("../Models/Cart");
const Order = require("../Models/Order.Traking");

const router = express.Router();

// 🟢 Place an order
router.post(
  "/place",
  authenticate,
  asyncHandler(async (req, res) => {
    const { address } = req.body;
    const userId = req.user._id;

    // ✅ Log address for debugging
    console.log("📦 Address received:", address);

    if (!address?.city || !address?.pincode) {
      return res
        .status(400)
        .json({ message: "City and Pincode are required in address." });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    const subtotal = cart.items.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
      0
    );

    const sgst = subtotal * 0.05;
    const cgst = subtotal * 0.05;
    const totalAmount = subtotal + sgst + cgst;

    const order = new Order({
      user: userId,
      cartId: cart._id,
      items: cart.items,
      subtotal,
      sgst,
      cgst,
      other: 0,
      totalAmount,
      address,
    });

    await order.save();

    // Clear the cart
    cart.items = [];
    await cart.save();

    res.status(201).json({ message: "✅ Order placed successfully", order });
  })
);

// 🟢 Get all user orders
router.get(
  "/",
  authenticate,
  asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user.id }).populate(
      "items.product"
    );
    res.json(orders);
  })
);

module.exports = router;
