const express = require("express");
const mongoose = require("mongoose");
const asyncHandler = require("../Middleware/asyncHandler");
const Cart = require("../Models/Cart");
const Box = require("../Models/Box");
const Chocolate = require("../Models/Chocolate");
const Category = require("../Models/Category");
const { authenticate } = require("../Middleware/authenticate");

const router = express.Router();

// ✅ Get cart (protected)
router.get("/", authenticate, asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id })
    .populate("items.product")
    .populate("items.box")
    .populate("items.products.product");
  res.json(cart || { items: [] });
}));

// ✅ Add product to cart (protected)
router.post("/add", authenticate, asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  if (!productId || !quantity) {
    return res.status(400).json({ message: "ProductId and quantity required" });
  }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  const itemIndex = cart.items.findIndex(i => i.product?.toString() === productId);
  if (itemIndex > -1) cart.items[itemIndex].quantity += quantity;
  else cart.items.push({ type: "product", product: productId, quantity });

  await cart.save();
  res.json({ message: "Product added to cart", cart });
}));

// ✅ Update item (protected)
router.put("/update", authenticate, asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  cart.items = cart.items.map(item => {
    if (item.product?.toString() === productId) item.quantity = quantity;
    return item;
  });

  await cart.save();
  res.json({ message: "Cart updated", cart });
}));

// ✅ Remove item (protected)
router.delete("/remove/:itemId", authenticate, asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  cart.items = cart.items.filter(i => i._id.toString() !== req.params.itemId);
  await cart.save();
  res.json({ message: "Item removed", cart });
}));

// ✅ Add custom box to cart (already protected)
router.post("/custom-box", authenticate, async (req, res) => {
  try {
    const { boxId, categoryId, selectedChocolates } = req.body;
    const userId = req.user._id;

    const newCart = new Cart({
      user: userId,
      boxId,
      categoryId,
      selectedChocolates,
    });

    await newCart.save();
    res.json({ message: "Custom box added to cart successfully" });
  } catch (err) {
    console.error("Custom-box error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;




// // routes/order.js
// const express = require("express");
// const axios = require("axios");
// const { authenticate } = require("../Middleware/auth");

// const router = express.Router();
// const GOOGLE_API_KEY = "YOUR_GOOGLE_API_KEY"; // Replace with your key

// // Validate Indian pincode via Google Maps API
// const validatePincodeIndia = async (pincode) => {
//   try {
//     const response = await axios.get(
//       `https://maps.googleapis.com/maps/api/geocode/json?address=${pincode}&key=${GOOGLE_API_KEY}`
//     );
//     const results = response.data.results;

//     if (!results || results.length === 0) return false;

//     const countryComponent = results[0].address_components.find(comp =>
//       comp.types.includes("country")
//     );

//     return countryComponent && countryComponent.short_name === "IN";
//   } catch (err) {
//     console.error("Error validating pincode:", err);
//     return false;
//   }
// };

// // Endpoint to check pincode only
// router.post("/check-pincode", authenticate, async (req, res) => {
//   const { pincode } = req.body;

//   if (!pincode) {
//     return res.status(400).json({ message: "Pincode is required" });
//   }

//   const isValid = await validatePincodeIndia(pincode);

//   if (isValid) {
//     return res.status(200).json({ message: "✅ Delivery available to your pincode" });
//   } else {
//     return res.status(400).json({ message: "❌ Delivery only available in India" });
//   }
// });

// module.exports = router;
