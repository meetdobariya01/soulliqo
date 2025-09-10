require("dotenv").config(".env");
const express = require("express");
const http = require("http");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const connectDB = require("./Config/db");
// Models (make sure filenames match your filesystem)
const User = require("./Models/User");
const Contact = require("./Models/Contact");
const Chocolate = require("./Models/Chocolate");
   // keep spelling as in your project
const Product = require("./Models/Product");              // fixed: Product (was Food)
const Order = require("./Models/Order.Traking");         // keep your filename if that's what exists        // keep spelling as in your project
const Cart = require("./Models/Cart");
const session = require("express-session");
const passport = require("./Config/passport");
const MongoStore = require("connect-mongo");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const app = express();
connectDB();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
/* ---------- Basic security & parsing middleware ---------- */
app.set("trust proxy", 1);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(cors({
  origin: [process.env.CLIENT_URL || "http://localhost:3000"],
  credentials: true,
}));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
/* ---------------- Sessions (only if using Passport sessions) ---------------- */
app.use(session({
  secret: process.env.SESSION_SECRET || "change_this_secret",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    dbName: process.env.DB_NAME || "soliquo",  // optional
  }),
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
}));
app.use(passport.initialize());
app.use(passport.session());
/* ---------------- Rate limiting ---------------- */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  message: { message: "Too many requests, try again later." }
});
const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: { message: "Too many OTP requests, try again later." }
});
app.use("/user/login", authLimiter);
app.use("/user/signup", authLimiter);
app.use("/user/forgot-password", otpLimiter);
/* ---------------- Shared mailer ---------------- */
const mailer = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
}); 
/* ---------------- JWT authenticate middleware ---------------- */
const authenticate = (req, res, next) => {
  try {
    const header = req.header("Authorization");
    if (!header) return res.status(401).json({ message: "Missing Authorization header" });
    const token = header.startsWith("Bearer ") ? header.slice(7) : header;
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET not set");
      return res.status(500).json({ message: "Server configuration error" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role, iat, exp }
    next();
  } catch (err) {
    console.error("JWT verify error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};  
/* ------------------ Auth Routes ------------------ */
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
app.get("/ping", (req, res) => {
  res.json({ message: "Pong" });
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
// Forgot Password - generate OTP
app.post("/user/forgot-password", otpLimiter, async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({message: "User not found"});
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
/* ------------------ Wishlist Routes (no route collisions) ------------------ */
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
/* ------------------ Cart Routes ------------------ */
// Add to cart (user or authenticated)
app.post("/user/add-to-cart", async (req, res) => {
  const { userId, productId } = req.body;
  if (!userId || !productId) return res.status(400).json({ message: "User ID and Product ID are required" });
  try {
    const user = await User.findById(userId);
    const product = await Product.findById(productId);
    if (!user || !product) return res.status(404).json({ message: "User or Product not found" });
    if (!Array.isArray(user.cart)) user.cart = [];
    if (!user.cart.includes(product._id)) {
      user.cart.push(product._id);
      await user.save();
    }
    res.json({ message: "Product added to cart", cart: user.cart });
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// Get authenticated user's cart (preferred)
app.get("/cart", authenticate, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate("items.foodId");
    if (!cart || !cart.items || cart.items.length === 0) {
      return res.json({ message: "Cart is empty.", cart: { items: [] }, totalPrice: 0 });
    }
    const totalPrice = cart.items.reduce((sum, item) => {
      return sum + ((item.foodId?.FoodPrice || 0) * (item.quantity || 1));
    }, 0);
    res.json({ cart, totalPrice });
  } catch (err) {
    console.error("Fetch cart error:", err);
    res.status(500).json({ message: "Server error fetching cart." });
  }
});
// Remove item from cart (authenticated)
app.delete("/cart/remove/:foodId", authenticate, async (req, res) => {
  try {
    const { foodId } = req.params;
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found for this user." });
    const initialCount = cart.items.length;
    cart.items = cart.items.filter(i => i.foodId.toString() !== foodId);
    if (cart.items.length === initialCount) return res.status(404).json({ message: "Food item not found in cart." });
    await cart.save();
    res.json({ message: "Item removed from cart successfully.", cart });
  } catch (err) {
    console.error("Remove cart item error:", err);
    res.status(500).json({ message: "Server error removing item from cart." });
  }
});
// Create cart (authenticated)
app.post("/create-cart", authenticate, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
      await cart.save();
    }
    res.json({ cartId: cart._id, message: "Cart created or already exists." });
  } catch (err) {
    console.error("Create cart error:", err);
    res.status(500).json({ message: "Server error creating cart." });
  }
});
/* ------------------ Foods / Categories ------------------ */
app.get("/foods/item/:id", async (req, res) => {
  try {
    const food = await Product.findById(req.params.id);
    if (!food) return res.status(404).json({ message: "Food not found" });
    res.json(food);
  } catch (err) {
    console.error("Get food error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
app.get("/foods/:Category", async (req, res) => {
  try {
    const cat = req.params.Category;
    const foods = cat === "All" ? await Product.find().lean() : await Product.find({ Category: cat }).lean();
    if (!foods || foods.length === 0) return res.status(404).json({ message: `No food found for category: ${cat}` });
    res.json(foods);
  } catch (err) {
    console.error("Foods by category error:", err);
    res.status(500).json({ message: "Server error fetching foods by category." });
  }
});
/* ------------------ Orders ------------------ */
// Get authenticated user's orders
app.get("/user/orders", authenticate, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).populate("items.foodId").sort({ createdAt: -1 });
    if (!orders || orders.length === 0) return res.status(404).json({ message: "No orders found." });
    res.json({ orders });
  } catch (err) {
    console.error("Fetch orders error:", err);
    res.status(500).json({ message: "Server error fetching orders." });
  }
});
// Previous orders (completed/delivered/cancelled)
app.get("/user/orders/previous", authenticate, async (req, res) => {
  try {
    const previousOrders = await Order.find({
      userId: req.user.id,
      status: { $in: ["Completed", "Delivered", "Cancelled"] }
    }).populate("items.foodId").sort({ createdAt: -1 });
    if (!previousOrders || previousOrders.length === 0) return res.status(404).json({ message: "No previous orders found." });
    res.json({ previousOrders });
  } catch (err) {
    console.error("Fetch previous orders error:", err);
    res.status(500).json({ message: "Server error fetching previous orders." });
  }
});
// Place order (authenticated)
app.post("/place-order/:cartId", authenticate, async (req, res) => {
  try {
    const { cartId } = req.params;
    const { houseNumber, buildingName, societyName, road, landmark, city, pincode } = req.body;
    if (!city || !pincode || !houseNumber) return res.status(400).json({ message: "Missing essential delivery address details." });
    const cart = await Cart.findById(cartId).populate("items.foodId");
    if (!cart || !cart.items || cart.items.length === 0) return res.status(404).json({ message: "Cart not found or empty." });
    const subtotal = cart.items.reduce((sum, item) => sum + ((item.foodId?.FoodPrice || 0) * (item.quantity || 1)), 0);
    const cgst = subtotal * 0.025;
    const sgst = subtotal * 0.025;
    const other = subtotal * 0.02;
    const finalAmount = subtotal + cgst + sgst + other;
    const order = new Order({
      cartId: cart._id,
      userId: req.user.id,
      items: cart.items,
      subtotal,
      cgst,
      sgst,
      totalAmount: finalAmount,
      address: { houseNumber, buildingName, societyName, road, landmark, city, pincode },
      status: "Pending",
    });
    await order.save();
    const orderItemsForEmail = order.items.map(i => ({
      name: i.foodId?.FoodName || "Unknown Food",
      price: i.foodId?.FoodPrice || 0,
      quantity: i.quantity || 1
    }));
    const itemLines = orderItemsForEmail.map(it => `<li>${it.name} x ${it.quantity} = ₹${(it.price * it.quantity).toFixed(2)}</li>`).join("");
    cart.items = [];
    await cart.save();
    const user = await User.findById(req.user.id);
    if (user && user.email) {
      const emailHtml = ` 
        <p>Hello ${user.firstName || "Customer"},</p>
        <p>Thank you for your order! Here's a summary:</p>
        <h3>🧾 Order Summary (Order ID: ${order._id})</h3>
        <ul>${itemLines}</ul>
        <hr/>
        <p>Subtotal: ₹${subtotal.toFixed(2)}</p>
        <p>CGST (2.5%): ₹${cgst.toFixed(2)}</p>
        <p>SGST (2.5%): ₹${sgst.toFixed(2)}</p>
        <p>Other Charges (2%): ₹${other.toFixed(2)}</p>
        <h3>Total Amount: ₹${finalAmount.toFixed(2)}</h3>
        <p><strong>📍 Delivery to:</strong><br/>${houseNumber}, ${buildingName || ""} ${societyName || ""} ${road || ""} ${landmark || ""}, ${city} - ${pincode}</p>
        <p>Thanks for ordering!</p>
      `;
      await mailer.sendMail({
        from: `"Gourmet Bazar" <${process.env.MAIL_USER}>`,
        to: user.email,
        subject: `🧾 Your Order Receipt - #${order._id}`,
        html: emailHtml,
      });
      console.log(`Order email sent to ${user.email}`);
    }
    res.status(201).json({ message: "Order placed successfully.", order });
  } catch (err) {
    console.error("Place order error:", err);
    res.status(500).json({ message: "Server error placing order.", error: err.message });
  }
});
/* ------------------ Contact Us ------------------ */
/* ------------------ Ratings & Reviews ------------------ */
app.post("/products/:productId/rating", authenticate, async (req, res) => {
  try {
    const { stars, comment } = req.body;
    const { productId } = req.params;
    if (!stars || stars < 1 || stars > 5) return res.status(400).json({ message: "Stars must be between 1 and 5." });
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found." });
    const existing = product.ratings.find(r => r.userId.toString() === req.user.id);
    if (existing) {
      existing.stars = stars;
      existing.comment = comment;
      existing.createdAt = Date.now();
    } else {
      product.ratings.push({ userId: req.user.id, stars, comment });
    }
    product.averageRating = product.ratings.reduce((s, r) => s + r.stars, 0) / product.ratings.length;
    await product.save();
    res.json({ message: "Rating submitted.", averageRating: product.averageRating.toFixed(1), ratings: product.ratings });
  } catch (err) {
    console.error("Rating error:", err);
    res.status(500).json({ message: "Server error submitting rating." });
  }
});
app.get("/products/:productId/reviews", async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).populate("ratings.userId", "firstName lastName email");
    if (!product) return res.status(404).json({ message: "Product not found." });
    res.json({ averageRating: (product.averageRating || 0).toFixed(1), totalReviews: product.ratings.length, reviews: product.ratings });
  } catch (err) {
    console.error("Reviews fetch error:", err);
    res.status(500).json({ message: "Server error fetching reviews." });
  }
});
/* ------------------ Google Auth (passport) ------------------ */
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
// Google Callback
app.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, "jwt_secret", { expiresIn: "1d" });
    // Redirect back to frontend with token + userId
    res.redirect(`http://localhost:3000/afterlogin?token=${token}&userId=${req.user._id}`);
  }
);
/* ------------------ Global error handler & process handlers ------------------ */
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error" });
});
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  // optionally gracefully shutdown here
});
async function sendOrderEmail(to, orderId, items = []) {
  const itemLines = items.map(
    i => `<li>${i.name} x ${i.quantity} = ₹${(i.price * i.quantity).toFixed(2)}</li>`
  ).join("");
  const emailHtml = `
    <h2>✅ Order Confirmation</h2>
    <p>Thank you for your order!</p>
    <p><b>Order ID:</b> ${orderId}</p>
    <ul>${itemLines}</ul>
    <p>We’ll notify you once your order is shipped.</p>
  `;
  await mailer.sendMail({
    from: `"Your Shop" <${process.env.MAIL_USER}>`,
    to,
    subject: `🧾 Order Confirmation - #${orderId}`,
    html: emailHtml,
  });
}
app.post("/order", async (req, res) => {
  const { userId, items } = req.body;
  try {
    // Save order
    const order = new Order({ userId, items });
    await order.save();
    // Get user
    const user = await User.findById(userId);
    // Send email
    await sendOrderEmail(user.email, order._id);
    res.status(201).json({ 
      message: "Order placed successfully, confirmation mail sent!",
      orderId: order._id 
    });
  } catch (err) {
    console.error("Order error:", err);
    res.status(500).json({ message: "Error placing order" });
  }
});
// ---------------- Global Error Handling ----------------
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack || err);
  res.status(500).json({ message: "Something went wrong on the server." });
});
// ---------------- Process-level Crash Protection ----------------
process.on("unhandledRejection", (reason, promise) => {
  console.error("🚨 Unhandled Rejection:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("💥 Uncaught Exception:", err);
});
app.post("/seed", async (req, res) => {
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
app.get("/categories", async (req, res) => {
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
app.get("/categories/:categoryId/collections", async (req, res) => {
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
app.get("/categories/:categoryId/collections/:collectionId/box-sizes", async (req, res) => {
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
app.get("/full", async (req, res) => {
  try {
    const data = await Chocolate.findOne({ brand: "Sweet Indulgence" });
    if (!data) return res.status(404).json({ message: "No data" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, Email, and Message are required." });
    }

    // Save to Mongo
    const newContact = new Contact({ name, email, phone, message });
    await newContact.save();

    // Send mail using global mailer
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
/* ------------------ Start server ------------------ */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});