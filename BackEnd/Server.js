const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cors = require("cors"); // KEEP THIS AS 'cors'
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const path = require("path"); 
const connectDB = require("./Config/db");

// If you installed the 'corp' package, use this:
const corp = require('corp'); 
// If you did NOT install it, remove the line above and stick to the manual fix below.

const { authenticate, isAdmin } = require("./Middleware/auth");
require("dotenv").config();
const app = express();
connectDB();

// Middlewares
app.set("trust proxy", 1);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());

// --- FIXES FOR CROSS-ORIGIN RESOURCE POLICY (CORP) ---

// Option 1: Manual Fix (Safest if you didn't install the 'corp' package)
app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
});

/* // Option 2: Using the 'corp' package (if installed) - ONLY USE ONE OPTION!
// app.use(corp({ policy: 'cross-origin' })); 
*/

// Using environment variable for CLIENT_URL
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000", credentials: true }));

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

// Correctly set static folder path for images (public folder inside BackEnd)
app.use(express.static(path.join(__dirname, 'public'))); 

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "change_this_secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI, dbName: process.env.DB_NAME || "soliquo" }),
    cookie: { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 7 * 24 * 60 * 60 * 1000 },
  })
);

// Rate Limiters
const createLimiter = (max, windowMs, message) =>
  rateLimit({ max, windowMs, message: { message } });
app.use("/user/login", createLimiter(100, 15 * 60 * 1000, "Too many requests, try again later."));
app.use("/user/signup", createLimiter(100, 15 * 60 * 1000, "Too many requests, try again later."));
app.use("/user/forgot-password", createLimiter(5, 10 * 60 * 1000, "Too many OTP requests, try again later."));
// Mailer
const nodemailer = require("nodemailer");
const mailer = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
});
// Routes
app.use("/user", require("../BackEnd/Router/auth"));
app.use("/cart", require("../BackEnd/Router/cart"));
app.use("/products", require("../BackEnd/Router/products"));
app.use("/orders", require("../BackEnd/Router/orders"));
app.use("/wishlist", require("../BackEnd/Router/wishlist"));
app.use("/contact", require("../BackEnd/Router/contact"));
app.use("/CreateBox", require("../BackEnd/Router/customBox"));  
// Ping
app.get("/ping", (_, res) => res.json({ message: "Pong" }));
// Global Error Handler
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack || err);
  res.status(err.status || 500).json({ message: err.message || "Something went wrong on the server." });
});
// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));