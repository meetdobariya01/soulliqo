const express = require("express");
const asyncHandler = require("../Middleware/asyncHandler");
const { authenticate } = require("../Middleware/authenticate");
const Cart = require("../Models/Cart");
const Order = require("../Models/Order.Traking");

const router = express.Router();

// Place an order
router.post("/place", authenticate, asyncHandler(async (req, res) => {
  const { address } = req.body;
  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart || cart.items.length === 0) return res.status(400).json({ message: "Cart is empty" });

  let subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const sgst = subtotal * 0.05;
  const cgst = subtotal * 0.05;
  const totalAmount = subtotal + sgst + cgst;

  const order = new Order({ userId: req.user.id, cartId: cart._id, items: cart.items, subtotal, sgst, cgst, other: 0, totalAmount, address });
  await order.save();

  cart.items = [];
  await cart.save();

  res.status(201).json({ message: "Order placed successfully", order });
}));

// Get all user orders
router.get("/", authenticate, asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).populate("items.product");
  res.json(orders);
}));

module.exports = router;
