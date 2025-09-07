import mongoose from "mongoose";

const boxSizeSchema = new mongoose.Schema({
  label: String,   // e.g. "Box of 12"
  quantity: Number
});

const collectionSchema = new mongoose.Schema({
  name: String,             // e.g. "Signature Collection"
  boxSizes: [boxSizeSchema]
});

const categorySchema = new mongoose.Schema({
  name: String,             // e.g. "Pralines"
  collections: [collectionSchema]
});

const chocolateSchema = new mongoose.Schema({
  brand: { type: String, default: "Sweet Indulgence" },
  categories: [categorySchema]
});

export default mongoose.model("Chocolate", chocolateSchema);



// import express from "express";
// import Chocolate from "../models/Chocolate.js";

// const router = express.Router();

// // ---------- SEED ----------
router.post("/seed", async (req, res) => {
  try {
    const exists = await Chocolate.findOne({ brand: "Sweet Indulgence" });
    if (exists) return res.status(400).json({ message: "Seed already exists" });

    await Chocolate.create({
      brand: "Sweet Indulgence",
      categories: [
        {
          name: "Make Your Own Assortment",
          collections: [
            {
              name: "Personal Selection",
              boxSizes: [
                { label: "Box of 16", quantity: 16 },
                { label: "Box of 21", quantity: 21 },
                { label: "Box of 24", quantity: 24 }
              ]
            }
          ]
        },
        {
          name: "Pralines",
          collections: [
            { name: "Make Your Own Assortment", boxSizes: [{ label: "Box of 12", quantity: 12 }] },
            { name: "Signature Collection", boxSizes: [{ label: "Box of 9", quantity: 9 }, { label: "Box of 16", quantity: 16 }] },
            { name: "Classic Collection", boxSizes: [{ label: "Box of 12", quantity: 12 }] }
          ]
        },
        {
          name: "Truffles",
          collections: [
            { name: "Make Your Own Assortment", boxSizes: [{ label: "Box of 12", quantity: 12 }] },
            { name: "Signature Collection", boxSizes: [{ label: "Box of 7", quantity: 7 }] },
            { name: "Classic Collection", boxSizes: [{ label: "Box of 16", quantity: 16 }] }
          ]
        },
        {
          name: "Bon Bon",
          collections: [
            {
              name: "Make Your Own Assortment",
              boxSizes: [
                { label: "Box of 9", quantity: 9 },
                { label: "Box of 12", quantity: 12 },
                { label: "Box of 16", quantity: 16 },
                { label: "Box of 21", quantity: 21 },
                { label: "Box of 24", quantity: 24 }
              ]
            },
            { name: "Signature Collection", boxSizes: [{ label: "Box of 16", quantity: 16 }] },
            { name: "Classic Collection", boxSizes: [{ label: "Box of 16", quantity: 16 }] }
          ]
        }
      ]
    });

    res.json({ message: "Seeded chocolate categories successfully." });
  } catch (err) {
    console.error("Seed error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ---------- API ENDPOINTS ----------

// 1) Get all categories
router.get("/categories", async (req, res) => {
  try {
    const chocolate = await Chocolate.findOne({ brand: "Sweet Indulgence" });
    if (!chocolate) return res.status(404).json({ message: "No categories found" });

    const categories = chocolate.categories.map(cat => ({
      id: cat._id,
      name: cat.name
    }));

    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2) Get collections for a category
router.get("/categories/:categoryId/collections", async (req, res) => {
  try {
    const { categoryId } = req.params;
    const chocolate = await Chocolate.findOne({ brand: "Sweet Indulgence" });

    const category = chocolate?.categories.id(categoryId);
    if (!category) return res.status(404).json({ message: "Category not found" });

    const collections = category.collections.map(col => ({
      id: col._id,
      name: col.name
    }));

    res.json({ category: { id: category._id, name: category.name }, collections });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3) Get box sizes for a collection
router.get("/categories/:categoryId/collections/:collectionId/box-sizes", async (req, res) => {
  try {
    const { categoryId, collectionId } = req.params;
    const chocolate = await Chocolate.findOne({ brand: "Sweet Indulgence" });

    const category = chocolate?.categories.id(categoryId);
    const collection = category?.collections.id(collectionId);

    if (!collection) return res.status(404).json({ message: "Collection not found" });

    const boxSizes = collection.boxSizes.map(bs => ({
      id: bs._id,
      label: bs.label,
      quantity: bs.quantity
    }));

    res.json({ category: { id: category._id, name: category.name }, collection: { id: collection._id, name: collection.name }, boxSizes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4) Get full hierarchy
router.get("/full", async (req, res) => {
  try {
    const data = await Chocolate.findOne({ brand: "Sweet Indulgence" });
    if (!data) return res.status(404).json({ message: "No data" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// export default router;
