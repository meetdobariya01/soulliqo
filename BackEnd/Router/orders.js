const express = require("express");
const asyncHandler = require("../Middleware/asyncHandler");
const { authenticate } = require("../Middleware/authenticate");
const Cart = require("../Models/Cart");
const Order = require("../Models/Order.Traking");
const sendEmail = require("../utils/sendEmail");

const router = express.Router();

const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL || "vashishthaprajapati33.starlight@gmail.com";

// 🟢 Place an order
router.post(
  "/place",
  authenticate,
  asyncHandler(async (req, res) => {
    const { address } = req.body;
    const userId = req.user._id;

    if (!address?.city || !address?.pincode || !address?.email) {
      return res
        .status(400)
        .json({ message: "City, Pincode and Email are required." });
    }

    const cart = await Cart.findOne({ user: userId })
      .populate("items.product")
      .populate("items.box");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // ✅ FORMAT ITEMS
    const items = cart.items.map((item) => {
      const isProduct = !!item.product;

      return {
        type: isProduct ? "product" : "box",
        product: isProduct ? item.product : undefined,
        box: !isProduct ? item.box : undefined,
        name: isProduct
          ? item.product.name
          : item.box?.boxName || `Custom Box (${item.box?.size || ""})`,
        price:
          item.price ||
          item.product?.price ||
          item.box?.price ||
          0,
        quantity: item.quantity || 1,
        products: item.products || [],
      };
    });

    // ✅ TOTALS
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const sgst = subtotal * 0.025;
    const cgst = subtotal * 0.025;
    const totalAmount = subtotal + sgst + cgst;

    // ✅ CREATE ORDER
    const order = new Order({
      user: userId,
      cartId: cart._id,
      items,
      subtotal,
      sgst,
      cgst,
      totalAmount,
      address,
    });

    await order.save();

    // ✅ CLEAR CART
    cart.items = [];
    await cart.save();

    // 📨 ITEMS TABLE
    const itemRows = items
      .map(
        (i) => `
        <tr>
          <td style="padding:8px;border:1px solid #ddd;">${i.name}</td>
          <td style="padding:8px;border:1px solid #ddd;">${i.quantity}</td>
          <td style="padding:8px;border:1px solid #ddd;">₹${i.price.toFixed(
            2
          )}</td>
        </tr>
      `
      )
      .join("");

    // ✅ USER EMAIL
    const userEmailHTML = `
      <div style="font-family:Arial;max-width:600px;margin:auto;padding:20px;">
        <h2 style="color:#7B4B3A;">Order Confirmation</h2>
        <p>Hi ${address.firstName || "Customer"},</p>
        <p>Thank you for your order.</p>

        <table width="100%" border="1" cellspacing="0" cellpadding="5">
          <tr><th>Item</th><th>Qty</th><th>Price</th></tr>
          ${itemRows}
        </table>

        <p><strong>Total:</strong> ₹${totalAmount.toFixed(2)}</p>
        <p>Your order will be shipped soon.</p>
      </div>
    `;

    // ✅ ADMIN EMAIL
   // ✅ ADMIN EMAIL WITH FULL CUSTOMER DETAILS
const adminEmailHTML = `
  <div style="font-family:Arial;max-width:600px;margin:auto;padding:20px;">
    <h2>🛒 New Order Received</h2>

    <p><strong>Customer Name:</strong> ${address.firstName || ""} ${address.lastName || ""}</p>
    <p><strong>Email:</strong> ${address.email}</p>
    <p><strong>Phone:</strong> ${address.phone || "N/A"}</p>
    <p><strong>Address:</strong> ${address.street || ""}, ${address.city || ""}, ${address.state || ""} - ${address.pincode || ""}</p>

    <table width="100%" border="1" cellspacing="0" cellpadding="5">
      <tr><th>Item</th><th>Qty</th><th>Price</th></tr>
      ${itemRows}
    </table>

    <p><strong>Total Order Value:</strong> ₹${totalAmount.toFixed(2)}</p>
  </div>
`;


    // ✅ SEND EMAILS
    try {
      await sendEmail(
        address.email,
        "Order Confirmation - Your Store",
        userEmailHTML
      );

      await sendEmail(
        ADMIN_EMAIL,
        "🛒 New Order Received",
        adminEmailHTML
      );
    } catch (err) {
      console.error("❌ Email error:", err.message);
    }

    res.status(201).json({
      message: "✅ Order placed successfully",
      order,
    });
  })
);

// 🟢 Get user orders
router.get(
  "/",
  authenticate,
  asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product")
      .populate("items.box");

    res.json(orders);
  })
);

module.exports = router;
