const express = require("express");
const asyncHandler = require("../Middleware/asyncHandler");
const User = require("../Models/User");
const Product = require("../Models/Product");
const router = express.Router();

// Add product
router.post("/:userId/add/:productId", asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);
  const product = await Product.findById(req.params.productId);
  if (!user || !product) return res.status(404).json({ message: "User or Product not found" });

  user.wishlist = user.wishlist || [];
  if (!user.wishlist.includes(product._id)) {
    user.wishlist.push(product._id);
    await user.save();
  }

  res.json({ message: "Product added to wishlist", wishlist: user.wishlist });
}));

// Remove product
router.delete("/:userId/remove/:productId", asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.wishlist = (user.wishlist || []).filter(id => id.toString() !== req.params.productId);
  await user.save();
  res.json({ message: "Product removed from wishlist", wishlist: user.wishlist });
}));

// Get wishlist
router.get("/:userId", asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId).populate("wishlist");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ wishlist: user.wishlist });
}));

module.exports = router;
