const express = require("express");
const asyncHandler = require("../Middleware/asyncHandler");
const Product = require("../Models/Product");
const router = express.Router();
const mongoose = require("mongoose");
const { authenticate } = require("../Middleware/authenticate");
const Box = require("../Models/Box");

// GET all products (optional category filter)
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { category } = req.query;
    const query = category ? { category, isAvailable: true } : { isAvailable: true };
    const products = await Product.find(query).lean();
    res.json(products);
  })
);

// GET all unique categories with first product image
router.get(
  "/categories",
  asyncHandler(async (req, res) => {
    const products = await Product.find({ isAvailable: true }).select("category image");
    const uniqueCategories = [...new Set(products.map((p) => p.category))];

    const categories = uniqueCategories.map((cat) => {
      const productWithImage = products.find((p) => p.category === cat && p.image);
      return {
        id: cat,
        title: cat,
        link: `/collection/${encodeURIComponent(cat)}`,
        img: productWithImage ? productWithImage.image : null, // no fallback
      };
    });

    res.json(categories);
  })
);

// POST rating
router.post(
  "/:productId/rate",
  asyncHandler(async (req, res) => {
    const { rating, review } = req.body;
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.ratings.push({ user: req.user.id, rating, review });
    await product.save();

    res.json({ message: "Rating submitted" });
  })
);

// GET product reviews
router.get(
  "/:productId/reviews",
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.productId)
      .populate("ratings.user", "firstName lastName");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product.ratings);
  })
);

// ✅ GET single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Product fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/:id/review", authenticate, async (req, res) => {
  const { rating, text } = req.body;
  const productId = req.params.id;

  if (!rating || !text) 
    return res.status(400).json({ message: "Rating and text required" });

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  // Add rating & review
  product.ratings.push({
    user: req.user.id,
    rating,
    review: text,
  });

  await product.save();

  res.status(201).json({ message: "Review & rating submitted successfully", ratings: product.ratings });
});





module.exports = router;
