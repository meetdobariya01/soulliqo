// routes/customer.js
const express = require("express");
const router = express.Router();
const Order = require("../Models/Order");
const User = require("../Models/User"); // ✅ use User model here
const { authenticateAdmin } = require("../Middleware/authAdmin");

// ✅ Get all customers (even those without orders)
router.get("/", authenticateAdmin, async (req, res) => {
  try {
    // Fetch all users who are not admins (assuming customers don't have role: "admin")
    const customers = await User.find({ role: { $ne: "admin" } });

    // Fetch all orders to calculate totals
    const orders = await Order.find();

    // Create a quick lookup summary
    const summary = {};
    orders.forEach((order) => {
      if (!order.email) return;
      if (!summary[order.email]) {
        summary[order.email] = { totalOrders: 0, totalSpent: 0 };
      }
      summary[order.email].totalOrders++;
      summary[order.email].totalSpent += order.totalAmount;
    });

    // Combine user info + order summary
    const result = customers.map((cust) => ({
      name: `${cust.firstName} ${cust.lastName}`,
      email: cust.email,
      phone: cust.mobile || "N/A",
      address: cust.address || "N/A",
      totalOrders: summary[cust.email]?.totalOrders || 0,
      totalSpent: summary[cust.email]?.totalSpent || 0,
    }));

    res.json(result);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
