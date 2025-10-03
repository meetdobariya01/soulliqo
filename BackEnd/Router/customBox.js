const express = require("express");
const mongoose = require("mongoose");
const asyncHandler = require("../Middleware/asyncHandler");
const { authenticate } = require("../Middleware/auth");
const Category = require("../Models/Category");
const Box = require("../Models/Box");
const Chocolate = require("../Models/Chocolate");
const Cart = require("../Models/Cart");

const router = express.Router();

/* ----------------- Step 1: Get all categories ----------------- */
router.get("/categories", asyncHandler(async (req, res) => {
  const categories = await Category.find().select("categoryName description").lean();
  const formatted = categories.map(cat => ({
    _id: cat._id,
    name: cat.categoryName,
    description: cat.description
  }));
  res.json(formatted);
}));

/* ----------------- Step 2: Get boxes by category ----------------- */
router.get("/boxes/:categoryId", asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(categoryId)) return res.status(400).json({ message: "Invalid category ID" });

  const category = await Category.findById(categoryId).select("categoryName description");
  if (!category) return res.status(404).json({ message: "Category not found" });

  const boxes = await Box.find({ categoryName: category.categoryName })
    .select("boxName size price _id")
    .lean();

  const formattedBoxes = boxes.map(box => ({
    ...box,
    name: box.boxName,
    category: {
      _id: category._id,
      name: category.categoryName,
      description: category.description
    }
  }));

  res.json(formattedBoxes);
}));

/* ----------------- Step 3: Get chocolates by box ----------------- */
router.get("/chocolates/:categoryId/:boxId", asyncHandler(async (req, res) => {
  const { categoryId, boxId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(categoryId) || !mongoose.Types.ObjectId.isValid(boxId)) {
    return res.status(400).json({ message: "Invalid IDs" });
  }

  const box = await Box.findById(boxId).select("boxName size price categoryName");
  const category = await Category.findById(categoryId).select("categoryName");
  if (!box || !category) return res.status(404).json({ message: "Box or Category not found" });
  if (box.categoryName !== category.categoryName) return res.status(403).json({ message: "Box does not belong to this category" });

  const chocolates = await Chocolate.find({ boxName: box.boxName })
    .select("chocolateName chocolateType categoryName _id")
    .lean();

  const formattedChocolates = chocolates.map(choc => ({
    _id: choc._id,
    name: choc.chocolateName,
    type: choc.chocolateType,
    box: {
      _id: box._id,
      name: box.boxName,
      size: box.size,
      price: box.price
    },
    category: {
      _id: category._id,
      name: category.categoryName
    }
  }));

  res.json(formattedChocolates);
}));

/* ----------------- Add custom box to cart ----------------- */
router.post("/custom-box", authenticate, asyncHandler(async (req, res) => {
  const { categoryId, boxId, selectedChocolates } = req.body;
  if (!mongoose.Types.ObjectId.isValid(categoryId) || !mongoose.Types.ObjectId.isValid(boxId)) return res.status(400).json({ message: "Invalid IDs" });
  if (!Array.isArray(selectedChocolates) || selectedChocolates.length === 0) return res.status(400).json({ message: "At least one chocolate must be selected" });

  const category = await Category.findById(categoryId).select("categoryName description");
  const box = await Box.findById(boxId).select("boxName size price categoryName");
  const chocolates = await Chocolate.find({ _id: { $in: selectedChocolates.map(s => s.chocolateId) } })
    .select("chocolateName price boxName categoryName");

  if (!category || !box) return res.status(404).json({ message: "Category or Box not found" });
  if (box.categoryName !== category.categoryName) return res.status(403).json({ message: "Box does not belong to this category" });

  // Validate selections & calculate totals
  let totalQuantity = 0, totalChocolatePrice = 0;
  for (const sel of selectedChocolates) {
    const choc = chocolates.find(c => c._id.toString() === sel.chocolateId);
    if (!choc || choc.boxName !== box.boxName || choc.categoryName !== category.categoryName) return res.status(400).json({ message: "Invalid chocolate selection" });
    totalQuantity += sel.quantity || 1;
    totalChocolatePrice += choc.price * (sel.quantity || 1);
  }

  if (totalQuantity > box.size) return res.status(400).json({ message: `Selected chocolates exceed box size (${box.size})` });

  const totalPrice = box.price + totalChocolatePrice;

  let cart = await Cart.findOne({ user: req.user.id }) || new Cart({ user: req.user.id, items: [] });
  cart.items.push({
    type: "box",
    box: box._id,
    name: `Custom ${box.boxName} Box`,
    size: box.size,
    price: totalPrice,
    quantity: 1,
    products: selectedChocolates.map(sel => ({ product: sel.chocolateId, quantity: sel.quantity }))
  });
  await cart.save();

  res.status(201).json({ message: "Custom box added to cart", cart });
}));

module.exports = router;