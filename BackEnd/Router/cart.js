
// const express = require("express");
// const asyncHandler = require("../Middleware/asyncHandler");
// const Cart = require("../Models/Cart");
// const { authenticate } = require("../Middleware/authenticate");

// const router = express.Router();

// // ✅ GET CART
// router.get("/", asyncHandler(async (req, res) => {
//   const cart = await Cart.findOne({ user: req.user._id })
//     .populate("items.product")
//     .populate("items.box")
//     .populate("items.products.chocolate");

//   res.json(cart || { items: [] });
// }));

// // ✅ ADD PRODUCT TO CART
// router.post("/add", asyncHandler(async (req, res) => {
//   const { productId, quantity } = req.body;

//   if (!productId || !quantity) {
//     return res.status(400).json({ message: "productId and quantity required" });
//   }

//   let cart = await Cart.findOne({ user: req.user._id });

//   if (!cart) {
//     cart = new Cart({ user: req.user._id, items: [] });
//   }

//   const existingIndex = cart.items.findIndex(
//     item => item.product?.toString() === productId
//   );

//   if (existingIndex > -1) {
//     cart.items[existingIndex].quantity += Number(quantity);
//   } else {
//     cart.items.push({
//       type: "product",
//       product: productId,
//       quantity: Number(quantity),
//     });
//   }

//   await cart.save();
//   res.json({ message: "✅ Product added to cart", cart });
// }));

// // ✅ UPDATE QUANTITY
// router.put("/update", asyncHandler(async (req, res) => {
//   const { productId, quantity } = req.body;

//   const cart = await Cart.findOne({ user: req.user._id });
//   if (!cart) return res.status(404).json({ message: "Cart not found" });

//   cart.items.forEach(item => {
//     if (item.product?.toString() === productId) {
//       item.quantity = Number(quantity);
//     }
//   });

//   await cart.save();
//   res.json({ message: "✅ Cart updated", cart });
// }));

// // ✅ REMOVE ITEM
// router.delete("/remove/:itemId", asyncHandler(async (req, res) => {
//   const cart = await Cart.findOne({ user: req.user._id });
//   if (!cart) return res.status(404).json({ message: "Cart not found" });

//   cart.items = cart.items.filter(item => item._id.toString() !== req.params.itemId);

//   await cart.save();
//   res.json({ message: "✅ Item removed", cart });
// }));

// // ✅ ADD CUSTOM BOX
// router.post("/custom-box", asyncHandler(async (req, res) => {
//   const { boxId, selectedChocolates, price } = req.body;

//   if (!boxId || !selectedChocolates?.length) {
//     return res.status(400).json({
//       message: "Box ID and selected chocolates required"
//     });
//   }

//   let cart = await Cart.findOne({ user: req.user._id });

//   if (!cart) {
//     cart = new Cart({ user: req.user._id, items: [] });
//   }

//   const newBoxItem = {
//     type: "box",
//     box: boxId,
//     name: "Custom Box",
//     price: Number(price) || 0,
//     quantity: 1,
//     products: selectedChocolates.map(c => ({
//       chocolate: c.chocolateId,
//       quantity: c.quantity
//     }))
//   };

//   cart.items.push(newBoxItem);
//   await cart.save();

//   await cart.populate([
//     { path: "items.product" },
//     { path: "items.box" },
//     { path: "items.products.chocolate" },
//   ]);

//   res.json({
//     message: "✅ Custom box added successfully",
//     cart
//   });
// }));

// module.exports = router;


const express = require("express");
const asyncHandler = require("../Middleware/asyncHandler");
const Cart = require("../Models/Cart");

const router = express.Router();

/**
 * Helper: always use sessionId
 */
const getCartQuery = (req) => {
  const sessionId = req.headers["x-session-id"];

  if (!sessionId) {
    throw new Error("Session ID missing");
  }

  return { sessionId };
};

/**
 * ✅ GET CART (SESSION ONLY)
 */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const query = getCartQuery(req);

    const cart = await Cart.findOne(query)
      .populate("items.product")
      .populate("items.box")
      .populate("items.products.chocolate");

    res.json(cart || { items: [] });
  })
);

/**
 * ✅ ADD PRODUCT TO CART
 */
router.post(
  "/add",
  asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;
    if (!productId || !quantity) {
      return res.status(400).json({
        message: "productId and quantity required",
      });
    }

    const query = getCartQuery(req);
    let cart = await Cart.findOne(query);

    if (!cart) {
      cart = new Cart({ sessionId: query.sessionId, items: [] });
    }

    const index = cart.items.findIndex(
      (item) => item.product?.toString() === productId
    );

    if (index > -1) {
      cart.items[index].quantity += Number(quantity);
    } else {
      cart.items.push({
        type: "product",
        product: productId,
        quantity: Number(quantity),
      });
    }

    await cart.save();
    res.json({ message: "✅ Product added to cart", cart });
  })
);

/**
 * ✅ UPDATE ITEM QUANTITY
 */
router.put(
  "/update",
  asyncHandler(async (req, res) => {
    const { itemId, quantity } = req.body;

    if (!itemId || quantity == null) {
      return res.status(400).json({
        message: "itemId and quantity required",
      });
    }

    const query = getCartQuery(req);
    const cart = await Cart.findOne(query);

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    item.quantity = Number(quantity);
    await cart.save();

    res.json({ message: "✅ Cart updated", cart });
  })
);

/**
 * ✅ REMOVE ITEM
 */
router.delete(
  "/remove/:itemId",
  asyncHandler(async (req, res) => {
    const query = getCartQuery(req);
    const cart = await Cart.findOne(query);

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item._id.toString() !== req.params.itemId
    );

    await cart.save();
    res.json({ message: "✅ Item removed", cart });
  })
);

/**
 * ✅ ADD CUSTOM BOX
 */
router.post(
  "/custom-box",
  asyncHandler(async (req, res) => {
    const { boxId, selectedChocolates, price } = req.body;

    if (!boxId || !selectedChocolates?.length) {
      return res.status(400).json({
        message: "Box ID and selected chocolates required",
      });
    }

    const query = getCartQuery(req);
    let cart = await Cart.findOne(query);

    if (!cart) {
      cart = new Cart({ sessionId: query.sessionId, items: [] });
    }

    cart.items.push({
      type: "box",
      box: boxId,
      name: "Custom Box",
      price: Number(price) || 0,
      quantity: 1,
      products: selectedChocolates.map((c) => ({
        chocolate: c.chocolateId,
        quantity: c.quantity,
      })),
    });

    await cart.save();
    res.json({ message: "✅ Custom box added", cart });
  })
);

module.exports = router;
