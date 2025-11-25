

const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const Order = require("../Models/Order");
const User = require("../Models/User");

require("events").EventEmitter.defaultMaxListeners = 25;

// ✅ Setup email transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Get all orders (Admin)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "firstName lastName email")
      .populate("items.product", "name price image")
      .populate("items.box", "name size price")
      .lean();

    const formattedOrders = orders.map((order) => {
      const user = order.user || {};
      const fullName =
        user.firstName || user.lastName
          ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
          : "Unknown User";

      return {
        _id: order._id,
        customerName: fullName,
        customerEmail: user.email || "N/A",
        totalAmount: order.totalAmount,
        status: order.status,
        items: order.items,
        createdAt: order.createdAt,
      };
    });

    res.json({ orders: formattedOrders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get single order
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "firstName lastName email")
      .populate("items.product", "name price image")
      .populate("items.box", "name size price");

    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Update order delivery status + send email
router.put("/:id/status", async (req, res) => {
  const { status, message } = req.body;
  try {
    const order = await Order.findById(req.params.id).populate("user", "firstName lastName email");
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    order.trackingHistory.push({
      status,
      message: message || `Order marked as ${status}`,
    });
    await order.save();

    const fullName = `${order.user.firstName || ""} ${order.user.lastName || ""}`.trim();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: order.user.email,
      subject: `Your order status: ${status}`,
      html: `
        <h3>Hello ${fullName || "Customer"},</h3>
        <p>Your order status has been updated to: <b>${status}</b>.</p>
        <p>${message || "We'll keep you updated as it progresses."}</p>
        <hr/>
        <p>Thank you for shopping with us!</p>
      `,
    };

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail(mailOptions);
      console.log(`📧 Email sent to ${order.user.email}`);
    }

    res.json({ message: `Order status updated to ${status}`, order });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Dashboard summary
router.get("/stats/summary", async (req, res) => {
  try {
    const delivered = await Order.find({ status: "Delivered" });
    const totalIncome = delivered.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalProfit = totalIncome * 0.2;
    res.json({ totalOrders: delivered.length, totalIncome, totalProfit });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
