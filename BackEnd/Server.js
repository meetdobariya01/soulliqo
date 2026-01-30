

  const express = require("express");
  const mongoose = require("mongoose");
  const session = require("express-session");
  const MongoStore = require("connect-mongo");
  const cors = require("cors");
  const helmet = require("helmet");
  const compression = require("compression");
  const rateLimit = require("express-rate-limit");
  const path = require("path");
  const nodemailer = require("nodemailer");
  require("dotenv").config();

  const connectDB = require("./Config/db");
  const { authenticate, isAdmin } = require("./Middleware/authenticate");

  connectDB();

  const Chocolate = require("../BackEnd/Models/Chocolate");
  const Box = require("../BackEnd/Models/Box");
  const Category = require("../BackEnd/Models/Category");

  const app = express();

  app.set("trust proxy", 1);
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(compression());
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true, limit: "2mb" }));

  app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  });

  app.use(
    cors({
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      credentials: true,
    })
  );

  // Serve images
app.use("/images", express.static(path.join(__dirname, "../public/images")));

app.use("/uploads", express.static(path.join(__dirname, "../public/images/uploads")));


  app.use(
    session({
      secret: process.env.SESSION_SECRET || "change_this_secret",
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        dbName: process.env.DB_NAME || "soliquo",
      }),
      cookie: {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    })
  );

  const createLimiter = (max, windowMs, message) =>
    rateLimit({ max, windowMs, message: { message } });

  app.use("/user/login", createLimiter(100, 15 * 60 * 1000, "Too many login attempts."));
  app.use("/user/signup", createLimiter(100, 15 * 60 * 1000, "Too many signup requests."));
  app.use("/user/forgot-password", createLimiter(5, 10 * 60 * 1000, "Too many OTP requests."));

  // Routes
  app.use("/user", require("./Router/auth"));
  app.use("/cart", require("./Router/cart"));
  app.use("/products", require("./Router/products"));
  app.use("/orders", require("./Router/orders"));
  app.use("/wishlist", require("./Router/wishlist"));
  app.use("/contact", require("./Router/contact"));
  app.use("/api",require("./Router/boxRoutes"));

  app.get("/ping", (_, res) => res.json({ message: "Pong" }));

  // your existing API routes here (NO CHANGES NEEDED)

  app.use((err, req, res, next) => {
    console.error("🔥 Server Error:", err.stack || err);
    res.status(err.status || 500).json({ message: err.message || "Something went wrong." });
  });

  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});



