const express = require("express");
const asyncHandler = require("../Middleware/asyncHandler");
const Product = require("../Models/Product");
const router = express.Router();

// Get all products (optional category filter)
router.get("/", asyncHandler(async (req, res) => {
  const { category } = req.query;
  const query = category ? { category, isAvailable: true } : { isAvailable: true };
  const products = await Product.find(query).lean();
  res.json(products);
}));

// Get unique categories
router.get("/categories", asyncHandler(async (req, res) => {
  const products = await Product.find({ isAvailable: true }).select("category");
  const uniqueCategories = [...new Set(products.map(p => p.category))];
  const categories = uniqueCategories.map(cat => ({ id: cat, title: cat, link: `/products?category=${encodeURIComponent(cat)}` }));
  res.json(categories);
}));

// Submit rating
router.post("/:productId/rate", asyncHandler(async (req, res) => {
  const { rating, review } = req.body;
  const product = await Product.findById(req.params.productId);
  if (!product) return res.status(404).json({ message: "Product not found" });
  product.ratings.push({ user: req.user.id, rating, review });
  await product.save();
  res.json({ message: "Rating submitted" });
}));

// Get reviews
router.get("/:productId/reviews", asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId).populate("ratings.user", "firstName lastName");
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product.ratings);
}));

module.exports = router;
