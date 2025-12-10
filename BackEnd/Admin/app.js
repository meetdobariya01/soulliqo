// app.js
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
require("dotenv").config({ path: "./.env" });
const connectDB = require("./Config/db");
const app = express();
// Middleware
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// ✅ Allow frontend access
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3001",
    credentials: true,
  })
);
// ✅ Sessions stored in MongoDB
app.use(
  session({
    secret: process.env.SESSION_SECRET || "admin_secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      dbName: process.env.DB_NAME || "soliquo",
    }),
    cookie: {
      httpOnly: true,
      sameSite: "none",
      secure: false,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);
// ✅ Serve uploaded images publicly
app.use("/uploads", express.static("uploads"));
// ROUTES
app.use("/admin/auth", require("./Router/adminAuth"));
app.use("/admin/categories", require("./Router/category"));
app.use("/admin/boxes", require("./Router/box"));
app.use("/admin/chocolates", require("./Router/chocolate"));
app.use("/admin/orders", require("./Router/order"));
app.use("/admin/products", require("./Router/productRoutes"));
app.use("/admin/dashboard", require("./Router/stats"));
app.use("/admin/customers", require("./Router/customer"));
// PING

app.get("/ping", (_, res) => res.json({ message: "Admin Pong" }));
const PORT = process.env.PORT || 7000;
// ✅ Connect to MongoDB and start server
connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`🧑‍💼 Admin server running on port ${PORT}`)
  );
});