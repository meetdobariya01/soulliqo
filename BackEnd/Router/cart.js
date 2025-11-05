const express = require("express");
const asyncHandler = require("../Middleware/asyncHandler");
const Cart = require("../Models/Cart");
const { authenticate } = require("../Middleware/authenticate");

const router = express.Router();

// ✅ Get cart (protected)
router.get("/", authenticate, asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id })
    .populate("items.product")
    .populate("items.box")
    .populate("items.products.chocolate");
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

// ✅ Update item quantity (protected)
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

// ✅ Add custom box (protected)
// ✅ Add custom box (protected)
router.post(
  "/custom-box",
  authenticate,
  asyncHandler(async (req, res) => {
    const { boxId, selectedChocolates, price } = req.body;
    const userId = req.user._id;

    if (!boxId || !Array.isArray(selectedChocolates) || selectedChocolates.length === 0) {
      return res
        .status(400)
        .json({ message: "Box ID and selected chocolates are required." });
    }

    // find or create cart
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // calculate price safely
    const totalPrice = Number(price) || 0;

    // create a new custom box item
    const newBoxItem = {
      type: "box",
      box: boxId,
      name: "Custom Box",
      price: totalPrice,
      quantity: 1,
      products: selectedChocolates.map((c) => ({
        chocolate: c.chocolateId,
        quantity: c.quantity,
      })),
    };

    // push new custom box
    cart.items.push(newBoxItem);

    await cart.save();

    await cart.populate([
      { path: "items.product" },
      { path: "items.box" },
      { path: "items.products.chocolate" },
    ]);

    res.json({
      message: "✅ Custom box added to cart successfully",
      cart,
    });
  })
);



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
