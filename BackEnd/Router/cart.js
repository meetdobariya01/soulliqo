const express = require("express");
const mongoose = require("mongoose");
const asyncHandler = require("../Middleware/asyncHandler");
const { authenticate } = require("../Middleware/auth");
const Cart = require("../Models/Cart");
const Box = require("../Models/Box");
const Chocolate = require("../Models/Chocolate");
const Category = require("../Models/Category");

const router = express.Router();

// Get cart
router.get("/", authenticate, asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id })
    .populate("items.product")
    .populate("items.box")
    .populate("items.products.product");
  res.json(cart || { items: [] });
}));

// Add product to cart
router.post("/add", authenticate, asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  if (!productId || !quantity) return res.status(400).json({ message: "ProductId and quantity required" });

  let cart = await Cart.findOne({ user: req.user.id }) || new Cart({ user: req.user.id, items: [] });
  const itemIndex = cart.items.findIndex(i => i.product?.toString() === productId);
  if (itemIndex > -1) cart.items[itemIndex].quantity += quantity;
  else cart.items.push({ type: "product", product: productId, quantity });

  await cart.save();
  res.json({ message: "Product added to cart", cart });
}));

// Update item
router.put("/update", authenticate, asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  cart.items = cart.items.map(item => {
    if (item.product?.toString() === productId) item.quantity = quantity;
    return item;
  });

  await cart.save();
  res.json({ message: "Cart updated", cart });
}));

// Remove item
router.delete("/remove/:itemId", authenticate, asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  cart.items = cart.items.filter(i => i._id.toString() !== req.params.itemId);
  await cart.save();
  res.json({ message: "Item removed", cart });
}));

// Add custom box to cart
router.post("/custom-box", authenticate, asyncHandler(async (req, res) => {
  const { categoryId, boxId, selectedChocolates } = req.body;
  if (!mongoose.Types.ObjectId.isValid(categoryId) || !mongoose.Types.ObjectId.isValid(boxId)) return res.status(400).json({ message: "Invalid IDs" });
  if (!Array.isArray(selectedChocolates) || selectedChocolates.length === 0) return res.status(400).json({ message: "At least one chocolate must be selected" });

  const category = await Category.findById(categoryId).select("categoryName");
  const box = await Box.findById(boxId).select("boxName size price categoryName");
  const chocolates = await Chocolate.find({ _id: { $in: selectedChocolates.map(s => s.chocolateId) } })
    .select("chocolateName price boxName categoryName");

  if (!category || !box) return res.status(404).json({ message: "Category or Box not found" });
  if (box.categoryName !== category.categoryName) return res.status(403).json({ message: "Box does not belong to this category" });

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
