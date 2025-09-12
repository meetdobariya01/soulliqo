const express = require("express");
const http = require("http");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const connectDB = require("./Config/db");
const session = require("express-session");
// const passport = require("./Config/passport");
const MongoStore = require("connect-mongo");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const app = express();
connectDB();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
/* ----------------- Models ----------------- */
const User = require("./Models/User");
const Contact = require("./Models/Contact");
const Product = require("./Models/Product");
const Order = require("./Models/Order.Traking");
const Cart = require("./Models/Cart");
const Category = require('./Models/Category');  // Adjust paths
const Box = require('./Models/Box');
const Chocolate = require('./Models/Chocolate');
/* ----------------- Helper ----------------- */
const isObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
/* ----------------- Security & Parsing ----------------- */
app.set("trust proxy", 1);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(cors({
  origin: [process.env.CLIENT_URL || "http://localhost:3000"],
  credentials: true,
}));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
/* ----------------- Session ----------------- */
app.use(session({
  secret: process.env.SESSION_SECRET || "change_this_secret",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    dbName: process.env.DB_NAME || "soliquo",
  }),
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
}));
// app.use(passport.initialize());
// app.use(passport.session());
/* ----------------- Rate Limiting ----------------- */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Too many requests, try again later." },
});
const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: { message: "Too many OTP requests, try again later." },
});
app.use("/user/login", authLimiter);
app.use("/user/signup", authLimiter);
app.use("/user/forgot-password", otpLimiter);
/* ----------------- Mailer ----------------- */
const mailer = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});
/* ----------------- JWT Middleware ----------------- */
const authenticate = (req, res, next) => {
  try {
    const header = req.header("Authorization");
    if (!header) return res.status(401).json({ message: "Missing Authorization header" });
    const token = header.startsWith("Bearer ") ? header.slice(7) : header;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT verify error:", err.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
/* ----------------- Admin Middleware ----------------- */
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access forbidden: Admin role required." });
  }
};
/* ----------------- Auth Routes ----------------- */
// Signup
app.post("/user/signup", async (req, res) => {
  const { firstName, lastName, email, password, mobile, role } = req.body;
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }
  try {
    if (await User.findOne({ email })) return res.status(400).json({ message: "Email already exists." });
    if (mobile && await User.findOne({ mobile })) return res.status(400).json({ message: "Mobile already registered." });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ firstName, lastName, email, password: hashedPassword, mobile, role: (role || "user").toLowerCase() });
    await user.save();
    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error during signup." });
  }
});
// Login
app.post("/user/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password are required." });
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ message: "User not found." });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials." });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "24h" });
    res.json({ message: "Login successful.", token, role: user.role, userId: user._id });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login." });
  }
});
// Forgot Password
app.post("/user/forgot-password", otpLimiter, async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();
    await mailer.sendMail({
      from: `"No-Reply" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
    });
    res.json({ message: "OTP sent to email" });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// Reset Password
app.post("/user/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) return res.status(400).json({ message: "All fields are required" });
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.otp || user.otp !== otp || !user.otpExpires || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// Step 1: Get all categories (replaces BoxCollection.find())
// Step 1: Get all categories
app.get("/create-your-own/categories", async (req, res) => {
  try {
    const categories = await Category.find().select('categoryName description _id');  // Fix: Select 'categoryName'
    console.log("Fetched categories:", categories); // Debug
    // Map to consistent response (use categoryName as 'name' for frontend if needed)
    const formattedCategories = categories.map(cat => ({
      _id: cat._id,
      name: cat.categoryName,  // Alias for frontend compatibility
      description: cat.description
    }));
    res.json(formattedCategories);
  } catch (err) {
    console.error("Get categories error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// Step 2: Get box sizes by category (find boxes by categoryName string)
app.get("/create-your-own/boxes/:categoryId", async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {  // Keep for category lookup
      return res.status(400).json({ message: "Invalid category ID" });
    }
    // Verify category exists and get its categoryName
    const category = await Category.findById(categoryId).select('categoryName description _id');
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    // Find boxes by string match on categoryName (no ref needed)
    const boxes = await Box.find({ categoryName: category.categoryName })
      .select('boxName size price _id')  // Select needed fields
      .lean();
    if (!boxes || boxes.length === 0) {
      return res.json([]);  // Empty if no boxes
    }
    // Manually add category info to each box (since no populate)
    const formattedBoxes = boxes.map(box => ({
      ...box,
      name: box.boxName,  // Alias for frontend
      category: {
        _id: category._id,
        name: category.categoryName,
        description: category.description
      }
    }));
    res.json(formattedBoxes);
  } catch (err) {
    console.error("Get boxes error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// Step 3: Get chocolates by box (assuming DB uses ObjectId for 'box'; adjust if string)
app.get("/create-your-own/chocolates/:categoryId/:boxId", async (req, res) => {
  try {
    const { categoryId, boxId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(categoryId) || !mongoose.Types.ObjectId.isValid(boxId)) {
      return res.status(400).json({ message: "Invalid IDs" });
    }
    // Verify box exists and get its details
    const box = await Box.findById(boxId).select('boxName size price categoryName _id');
    if (!box) return res.status(404).json({ message: "Box not found" });
    // Verify box belongs to category (string match on categoryName)
    const category = await Category.findById(categoryId).select('categoryName');
    if (!category || box.categoryName !== category.categoryName) {
      return res.status(403).json({ message: "Box does not belong to this category" });
    }
    // Query by string boxName (denormalized, matches schema)
    let chocolates = await Chocolate.find({ boxName: box.boxName })  // String match
      .select('chocolateName chocolateType categoryName _id')  // Select real fields
      .lean();

    if (!chocolates || chocolates.length === 0) {
      return res.json([]);  // Empty if no chocolates
    }
    // Format with aliases for frontend (name/type) and add box/category info
    const formattedChocolates = chocolates.map(choc => ({
      _id: choc._id,
      name: choc.chocolateName,  // Alias
      type: choc.chocolateType,  // Alias
      categoryName: choc.categoryName,  // Keep if needed
      box: {
        _id: box._id,
        name: box.boxName,
        size: box.size,
        price: box.price
      },
      category: {
        _id: category._id,
        name: category.categoryName
      }
    }));
    res.json(formattedChocolates);
  } catch (err) {
    console.error("Get chocolates error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// Ping
app.get("/ping", (req, res) => res.json({ message: "Pong" }));
/* ----------------- Wishlist Routes ----------------- */
app.post("/user/:userId/wishlist/add/:productId", async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const user = await User.findById(userId);
    const product = await Product.findById(productId);
    if (!user || !product) return res.status(404).json({ message: "User or Product not found" });
    if (!Array.isArray(user.wishlist)) user.wishlist = [];
    if (!user.wishlist.includes(product._id)) {
      user.wishlist.push(product._id);
      await user.save();
    }
    res.json({ message: "Product added to wishlist", wishlist: user.wishlist });
  } catch (err) {
    console.error("Wishlist add error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
app.delete("/user/:userId/wishlist/remove/:productId", async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.wishlist = (user.wishlist || []).filter(id => id.toString() !== productId);
    await user.save();
    res.json({ message: "Product removed from wishlist", wishlist: user.wishlist });
  } catch (err) {
    console.error("Wishlist remove error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
app.get("/user/:userId/wishlist", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("wishlist");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ wishlist: user.wishlist });
  } catch (err) {
    console.error("Wishlist fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
/* ----------------- Cart & Box Selection Routes ----------------- */
// Add product to cart
app.post("/cart/add", authenticate, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId || !quantity) return res.status(400).json({ message: "ProductId and quantity required" });
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) cart = new Cart({ user: req.user.id, items: [] });
    const itemIndex = cart.items.findIndex(i => i.product.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }
    await cart.save();
    res.json({ message: "Product added to cart", cart });
  } catch (err) {
    console.error("Cart add error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// Update cart item
app.put("/cart/update", authenticate, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    cart.items = cart.items.map(item => {
      if (item.product.toString() === productId) item.quantity = quantity;
      return item;
    });
    await cart.save();
    res.json({ message: "Cart updated", cart });
  } catch (err) {
    console.error("Cart update error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// Remove item from cart
app.delete("/cart/remove/:productId", authenticate, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    cart.items = cart.items.filter(i => i.product.toString() !== req.params.productId);
    await cart.save();
    res.json({ message: "Item removed", cart });
  } catch (err) {
    console.error("Cart remove error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// Get user cart
app.get("/cart", authenticate, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
    res.json(cart || { items: [] });
  } catch (err) {
    console.error("Get cart error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
/* ----------------- Orders Routes ----------------- */
// Place an order
app.post("/order/place", authenticate, async (req, res) => {
  try {
    const { items, shippingAddress, total } = req.body;
    if (!items || !total) return res.status(400).json({ message: "Items and total are required" });
    const order = new Order({ user: req.user.id, items, shippingAddress, total });
    await order.save();
    // Clear user's cart
    await Cart.findOneAndDelete({ user: req.user.id });
    res.json({ message: "Order placed successfully", order });
  } catch (err) {
    console.error("Place order error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// Get all user orders
app.get("/orders", authenticate, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate("items.product");
    res.json(orders);
  } catch (err) {
    console.error("Get orders error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
app.post("/product/:productId/rate", authenticate, async (req, res) => {
  try {
    const { rating, review } = req.body;
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    product.ratings.push({ user: req.user.id, rating, review });
    await product.save();
    res.json({ message: "Rating submitted" });
  } catch (err) {
    console.error("Submit rating error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
app.get("/product/:productId/reviews", async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).populate("ratings.user", "firstName lastName");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product.ratings);
  } catch (err) {
    console.error("Get reviews error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
/* ----------------- Contact Form ----------------- */
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ error: "Name, Email, and Message are required." });
    const newContact = new Contact({ name, email, phone, message });
    await newContact.save();
    await mailer.sendMail({
      from: `"Soulliqo Contact Form" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_TO || process.env.MAIL_USER,
      subject: "New Contact Form Submission",
      html: `
        <h2>New Contact Form Submission</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone || "N/A"}</p>
        <p><b>Message:</b><br/>${message}</p>
      `,
    });
    res.status(200).json({ success: "Thank You for contacting us!" });
  } catch (error) {
    console.error("Error in /api/contact:", error);
    res.status(500).json({ error: "Server error, please try again later." });
  }
});
/* ----------------- Global Error Handling ----------------- */
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack || err);
  res.status(500).json({ message: "Something went wrong on the server." });
});
/* ----------------- Process-level Crash Protection ----------------- */
// process.on("unhandledRejection", (reason, promise) => console.error("🚨 Unhandled Rejection:", reason));
// process.on("uncaughtException", (err) => console.error("💥 Uncaught Exception:", err));
/* ----------------- Start Server ----------------- */
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));