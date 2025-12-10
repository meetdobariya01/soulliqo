const express = require("express");
const asyncHandler = require("../Middleware/asyncHandler");
const { authenticate } = require("../Middleware/authenticate");
const Cart = require("../Models/Cart");
const Order = require("../Models/Order.Traking");
const sendEmail = require("../utils/sendEmail");

const router = express.Router();

// 🟢 Place an order
router.post(
  "/place",
  authenticate,
  asyncHandler(async (req, res) => {
    const { address } = req.body;
    const userId = req.user._id;

    if (!address?.city || !address?.pincode) {
      return res.status(400).json({ message: "City and Pincode are required." });
    }

    const cart = await Cart.findOne({ user: userId })
      .populate("items.product")
      .populate("items.box");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // ✅ Format items
    const items = cart.items.map((item) => ({
      type: item.product ? "product" : "box",
      product: item.product || undefined,
      box: item.box || undefined,
      name: item.product?.name || item.box?.name || item.name || "Custom Box",
      price: item.price || item.product?.price || 0,
      quantity: item.quantity || 1,
      products: item.products || [],
    }));

    const subtotal = items.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
      0
    );

    const sgst = subtotal * 0.025;
    const cgst = subtotal * 0.025;
    const totalAmount = subtotal + sgst + cgst;

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

    // ✅ Clear cart
    cart.items = [];
    await cart.save();

    // 📨 Email confirmation
    const itemListHTML = items
      .map(
        (i) => `
        <tr>
          <td style="padding:8px;border:1px solid #ddd;">${i.name}</td>
          <td style="padding:8px;border:1px solid #ddd;">${i.quantity}</td>
          <td style="padding:8px;border:1px solid #ddd;">₹${i.price.toFixed(2)}</td>
        </tr>`
      )
      .join("");

    const emailHTML = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #eee;padding:20px;border-radius:8px;">
        <h2 style="color:#7B4B3A;">Order Confirmation</h2>
        <p>Hi ${address.firstName || "Customer"},</p>
        <p>Thank you for your order! Here are your order details:</p>

        <table style="width:100%;border-collapse:collapse;margin-top:15px;">
          <thead>
            <tr style="background-color:#f5f5f5;">
              <th style="padding:8px;border:1px solid #ddd;">Item</th>
              <th style="padding:8px;border:1px solid #ddd;">Qty</th>
              <th style="padding:8px;border:1px solid #ddd;">Price</th>
            </tr>
          </thead>
          <tbody>${itemListHTML}</tbody>
        </table>

        <p style="margin-top:10px;"><strong>Subtotal:</strong> ₹${subtotal.toFixed(2)}</p>
        <p style="margin-top:10px;"><strong>SGST (2.5%):</strong> ₹${sgst.toFixed(2)}</p>
        <p style="margin-top:10px;"><strong>CGST (2.5%):</strong> ₹${cgst.toFixed(2)}</p>
        <p><strong>Total (incl. taxes):</strong> ₹${totalAmount.toFixed(2)}</p>

        <h4 style="margin-top:20px;">Delivery Address:</h4>
        <p>${address.street}, ${address.city}, ${address.state} - ${address.pincode}</p>

        <p style="margin-top:20px;">We’ll notify you once your order is shipped.</p>
        <p style="color:#555;">Thank you for shopping with us!<br/><strong>Your Store Team</strong></p>
      </div>
    `;

    try {
      await sendEmail(address.email, "Order Confirmation - Your Store", emailHTML);
    } catch (err) {
      console.error("❌ Email sending failed:", err.message);
    }

    res.status(201).json({ message: "✅ Order placed successfully", order });
  })
);

// 🟢 Get all orders of logged-in user
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
