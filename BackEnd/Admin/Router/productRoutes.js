// // Router/product.js
// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");
// const Product = require("../Models/Product");
// const { authenticateAdmin } = require("../Middleware/authAdmin.js");

// // 🔧 Multer setup for image storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadPath = path.join(__dirname, "../uploads");
//     if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
//     cb(null, uniqueName);
//   },
// });

// const upload = multer({ storage });

// // 👀 Get all products
// router.get("/", async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // 🔍 Get single product
// router.get("/:id", authenticateAdmin, async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) return res.status(404).json({ message: "Product not found" });
//     res.json(product);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // ➕ Add product
// router.post("/", authenticateAdmin, upload.array("images", 5), async (req, res) => {
//   try {
//     const imagePaths = req.files?.map(
//       (file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
//     ) || [];

//     const product = new Product({ ...req.body, image: imagePaths });
//     await product.save();
//     res.status(201).json(product);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// // ✏️ Update product
// router.put("/:id", authenticateAdmin, async (req, res) => {
//   try {
//     const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!updated) return res.status(404).json({ error: "Product not found" });
//     res.json(updated);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // ❌ Delete product
// router.delete("/:id", authenticateAdmin, async (req, res) => {
//   try {
//     const deleted = await Product.findByIdAndDelete(req.params.id);
//     if (!deleted) return res.status(404).json({ error: "Product not found" });
//     res.json({ message: "Product deleted" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Product = require("../Models/Product");
const { authenticateAdmin } = require("../Middleware/authAdmin.js");

// ========== MULTER ==========
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// ✅ Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get single product
router.get("/:id", authenticateAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ ADD product with image upload
router.post("/", authenticateAdmin, upload.array("images", 5), async (req, res) => {
  try {
    const imagePaths =
      req.files?.map((file) => `/uploads/${file.filename}`) || [];

    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: imagePaths,
    });

    await product.save();

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ✅ UPDATE product + change image
router.put("/:id", authenticateAdmin, upload.array("images", 5), async (req, res) => {
  try {
    const imagePaths =
      req.files?.length > 0
        ? req.files.map((file) => `/uploads/${file.filename}`)
        : undefined;

    const data = {
      ...req.body,
    };

    if (imagePaths) {
      data.image = imagePaths;
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });

    if (!updated)
      return res.status(404).json({ error: "Product not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete
router.delete("/:id", authenticateAdmin, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted)
      return res.status(404).json({ error: "Product not found" });

    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
