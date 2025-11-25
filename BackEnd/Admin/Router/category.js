const express = require("express");
const router = express.Router();
const Category = require("../Models/Category");
const { authenticateAdmin } = require("../Middleware/authAdmin");

// Get all categories
router.get("/", authenticateAdmin, async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
});

// Add new category
router.post("/", authenticateAdmin, async (req, res) => {
  const { COLLECTION, description, image } = req.body;
  const cat = new Category({ COLLECTION, description, image });
  await cat.save();
  res.json({ message: "Category added", category: cat });
});

// Delete category
router.delete("/:id", authenticateAdmin, async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: "Category deleted" });
});

module.exports = router;
