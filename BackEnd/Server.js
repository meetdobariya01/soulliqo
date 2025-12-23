// // ============================
// //  DEPENDENCIES & CONFIG
// // ============================
// const express = require("express");
// const mongoose = require("mongoose");
// const session = require("express-session");
// const MongoStore = require("connect-mongo");
// const cors = require("cors");
// const helmet = require("helmet");
// const compression = require("compression");
// const rateLimit = require("express-rate-limit");
// const path = require("path");
// const nodemailer = require("nodemailer");
// require("dotenv").config();

// const connectDB = require("./Config/db");
// const { authenticate, isAdmin } = require("./Middleware/authenticate");

// // Connect to MongoDB
// connectDB();

// // ============================
// //  MODELS
// // ============================
// const Chocolate = require("../BackEnd/Models/Chocolate");
// const Box = require("../BackEnd/Models/Box");
// const Category = require("../BackEnd/Models/Category");

// // ============================
// //  APP INIT
// // ============================
// const app = express();

// // ============================
// //  MIDDLEWARE
// // ============================
// app.set("trust proxy", 1);
// app.use(helmet({ contentSecurityPolicy: false }));
// app.use(compression());
// app.use(express.json({ limit: "2mb" }));
// app.use(express.urlencoded({ extended: true, limit: "2mb" }));

// // Fix CORP headers
// app.use((req, res, next) => {
//   res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
//   next();
// });

// app.use(
//   cors({
//     origin: process.env.CLIENT_URL || "http://localhost:3000",
//     credentials: true,
//   })
// );

// // Serve static files
// // app.use(express.static(path.join(__dirname, "public")));
// // app.use("/images", express.static("public/images"));
// // Serve images from actual React public folder
// app.use(
//   "/images",
//   express.static("D:/Job/soulliqo-clean/soulliqo/public/images")
// );
// app.use(
//   "/uploads",
//   express.static(path.join(__dirname, "../BackEnd/Admin/uploads"))
// );
// // ============================
// //  SESSION CONFIG
// // ============================
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET || "change_this_secret",
//     resave: false,
//     saveUninitialized: false,
//     store: MongoStore.create({
//       mongoUrl: process.env.MONGO_URI,
//       dbName: process.env.DB_NAME || "soliquo",
//     }),
//     cookie: {
//       httpOnly: true,
//       sameSite: "none",
//       secure: true,
//       maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
//     },
//   })
// );

// // ============================
// //  RATE LIMITERS
// // ============================
// const createLimiter = (max, windowMs, message) =>
//   rateLimit({ max, windowMs, message: { message } });

// app.use("/user/login", createLimiter(100, 15 * 60 * 1000, "Too many login attempts."));
// app.use("/user/signup", createLimiter(100, 15 * 60 * 1000, "Too many signup requests."));
// app.use("/user/forgot-password", createLimiter(5, 10 * 60 * 1000, "Too many OTP requests."));

// // ============================
// //  NODEMAILER SETUP
// // ============================
// const mailer = nodemailer.createTransport({
//   service: "gmail",
//   auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
// });

// // ============================
// //  ROUTES
// // ============================
// app.use("/user", require("./Router/auth"));
// app.use("/cart", require("./Router/cart"));
// app.use("/products", require("./Router/products"));
// app.use("/orders", require("./Router/orders"));
// app.use("/wishlist", require("./Router/wishlist"));
// app.use("/contact", require("./Router/contact"));

// // Ping test route
// app.get("/ping", (_, res) => res.json({ message: "Pong" }));

// // ============================
// //  STORE API ROUTES (UPDATED)
// // ============================

// // GET all categories
// app.get("/api/store/categories", async (req, res) => {
//   try {
//     const categories = await Category.find().select("COLLECTION description").lean();

//     const formatted = categories.map((cat) => ({
//       _id: cat._id,
//       name: (cat.COLLECTION || "").trim(),
//       description: cat.description || "",
//       image: cat.image || "./images/category-placeholder.png",
//     }));

//     res.json(formatted);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // GET boxes by category

// // app.get("/api/store/collections/:collectionId/boxes", async (req, res) => {
// //   try {
// //     const { collectionId } = req.params;
// //     const { size } = req.query;

// //     if (!mongoose.Types.ObjectId.isValid(collectionId)) {
// //       return res.status(400).json({ message: "Invalid category ID" });
// //     }

// //     const category = await Category.findById(collectionId).select("COLLECTION description image");
// //     if (!category) return res.status(404).json({ message: "Category not found" });

// //     const categoryName = (category.COLLECTION || "").trim();

// //     const boxes = await Box.find({
// //       COLLECTION: new RegExp(`^\\s*${categoryName}\\s*$`, "i"),
// //     }).select(
// //       "boxName size price COLLECTION BoxCategories totalLimit typeLimits description image additionalInformation"
// //     );

// //     if (!boxes.length) {
// //       return res.status(404).json({ message: "No boxes found for this category" });
// //     }

// //     // If size not provided, return available sizes
// //     if (!size) {
// //       const uniqueSizes = [...new Set(boxes.map((b) => b.size))].sort((a, b) => a - b);
// //       return res.json({
// //         category: {
// //           id: category._id,
// //           name: categoryName,
// //           description: category.description || "",
// //           image: category.image || "./images/category-placeholder.png",
// //         },
// //         availableSizes: uniqueSizes,
// //       });
// //     }

// //     // Filter by box size
// //     const filteredBoxes = boxes.filter((b) => b.size === Number(size));
// //     if (!filteredBoxes.length) {
// //       return res.status(404).json({ message: `No boxes found for size ${size}` });
// //     }

// //     const formatted = filteredBoxes.map((box) => ({
// //       _id: box._id,
// //       name: box.boxName || "",
// //       size: box.size,
// //       price: box.price,
// //       description: box.description || "",
// //       image: box.image || "./images/product-grid.png",
// //       additionalInformation: box.additionalInformation || "",
// //       boxCategories: box.BoxCategories || [],
// //       totalLimit: box.totalLimit || box.size,
// //       typeLimits: box.typeLimits || {},
// //     }));

// //     res.json({
// //       category: {
// //         id: category._id,
// //         name: categoryName,
// //         description: category.description || "",
// //         image: category.image || "./images/category-placeholder.png",
// //       },
// //       size: Number(size),
// //       boxes: formatted,
// //     });
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // });

// // GET chocolates by category + box

// app.get("/api/store/collections/:collectionId/boxes", async (req, res) => {
//   try {
//     const { collectionId } = req.params;
//     const { size } = req.query;

//     if (!mongoose.Types.ObjectId.isValid(collectionId)) {
//       return res.status(400).json({ message: "Invalid category ID" });
//     }

//     const category = await Category.findById(collectionId).select("COLLECTION description image");
//     if (!category) return res.status(404).json({ message: "Category not found" });

//     const categoryName = (category.COLLECTION || "").trim();

//     const boxes = await Box.find({
//       COLLECTION: new RegExp(`^\\s*${categoryName}\\s*$`, "i"),
//     }).select("boxName size price description image BoxCategories totalLimit typeLimits additionalInformation");

//     if (!boxes.length) {
//       return res.status(404).json({ message: "No boxes found for this category" });
//     }

//     // ✅ Normalize image URLs (auto-prepend server URL if missing)
//  const getFullImageUrl = (img) => {
//   if (!img) return `${process.env.SERVER_URL || "http://localhost:5000"}/images/product-grid.png`;
//   if (img.startsWith("http")) return img;
//   const cleanPath = img.replace(/^\/?/, ""); // remove leading slash
//   return `${process.env.SERVER_URL || "http://localhost:5000"}${cleanPath.startsWith("images") ? "/" : "/images/"}${cleanPath}`;
// };

//     // ✅ Build size-to-image map
//     const sizeMap = {};
//     boxes.forEach((b) => {
//       const img = getFullImageUrl(b.image);
//       if (!sizeMap[b.size]) sizeMap[b.size] = img;
//     });

//     // ✅ Return available sizes
//     if (!size) {
//       const uniqueSizes = Object.keys(sizeMap).map(Number).sort((a, b) => a - b);
//       return res.json({
//         category: {
//           id: category._id,
//           name: categoryName,
//           description: category.description || "",
//           image: getFullImageUrl(category.image),
//         },
//         availableSizes: uniqueSizes.map((s) => ({
//           size: s,
//           image: sizeMap[s],
//         })),
//       });
//     }

//     // ✅ Return boxes for selected size
//     const filteredBoxes = boxes.filter((b) => b.size === Number(size));
//     if (!filteredBoxes.length) {
//       return res.status(404).json({ message: `No boxes found for size ${size}` });
//     }

//     const formatted = filteredBoxes.map((box) => ({
//       _id: box._id,
//       name: box.boxName || "",
//       size: box.size,
//       price: box.price,
//       description: box.description || "",
//       image: getFullImageUrl(box.image),
//       additionalInformation: box.additionalInformation || "",
//       boxCategories: box.BoxCategories || [],
//       totalLimit: box.totalLimit || box.size,
//       typeLimits: box.typeLimits || {},
//     }));

//     res.json({
//       category: {
//         id: category._id,
//         name: categoryName,
//         description: category.description || "",
//         image: getFullImageUrl(category.image),
//       },
//       size: Number(size),
//       boxes: formatted,
//     });
//   } catch (err) {
//     console.error("❌ Box API Error:", err);
//     res.status(500).json({ message: err.message });
//   }
// });



// app.get("/api/store/chocolates/:categoryId/:boxId", async (req, res) => {
//   try {
//     const { categoryId, boxId } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(categoryId) || !mongoose.Types.ObjectId.isValid(boxId)) {
//       return res.status(400).json({ message: "Invalid category or box ID" });
//     }

//     const category = await Category.findById(categoryId).select("COLLECTION");
//     const box = await Box.findById(boxId).select("boxName size price COLLECTION totalLimit typeLimits");

//     if (!category || !box)
//       return res.status(404).json({ message: "Box or category not found" });

//     const boxCollection = (box.COLLECTION || "").trim();
//     const categoryName = (category.COLLECTION || "").trim();

//     if (boxCollection.toLowerCase() !== categoryName.toLowerCase()) {
//       return res.status(400).json({ message: "Box does not belong to this category" });
//     }

//     const chocolates = await Chocolate.find({
//       COLLECTION: new RegExp(`^\\s*${boxCollection}\\s*$`, "i"),
//     }).select("chocolateName chocolateType COLLECTION _id SKU_CODE price BoxCategories description image");

//     if (!chocolates.length)
//       return res.status(404).json({ message: "No chocolates found for this collection" });

//     const formatted = chocolates.map((choc) => ({
//       _id: choc._id,
//       name: choc.chocolateName || "",
//       type: choc.chocolateType || "",
//       sku: choc.SKU_CODE || "",
//       description: choc.description || "",
//       price: choc.price,
//       boxCategories: choc.BoxCategories || [],
//       image: choc.image || "./images/product-grid.png",
//       box: {
//         _id: box._id,
//         name: box.boxName || "",
//         size: box.size,
//         price: box.price,
//         totalLimit: box.totalLimit || box.size,
//         typeLimits: box.typeLimits || {},
//       },
//       category: { _id: category._id, name: categoryName },
//     }));

//     res.json(formatted);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });
// // GET all boxes + chocolates by category
// app.get("/api/store/chocolates/:categoryId", async (req, res) => {
//   try {
//     const { categoryId } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(categoryId)) {
//       return res.status(400).json({ message: "Invalid category ID" });
//     }

//     const category = await Category.findById(categoryId).select("COLLECTION description image");
//     if (!category) return res.status(404).json({ message: "Category not found" });

//     const categoryName = (category.COLLECTION || "").trim();

//     // 🔹 Get all boxes under this category
//     const boxes = await Box.find({
//       COLLECTION: new RegExp(`^\\s*${categoryName}\\s*$`, "i"),
//     }).select(
//       "boxName size price COLLECTION totalLimit typeLimits description image additionalInformation"
//     );

//     if (!boxes.length) {
//       return res.status(404).json({ message: "No boxes found for this category" });
//     }

//     // 🔹 Fetch chocolates for each box
//     const result = [];
//     for (const box of boxes) {
//       const chocolates = await Chocolate.find({
//         COLLECTION: new RegExp(`^\\s*${categoryName}\\s*$`, "i"),
//       }).select("chocolateName chocolateType COLLECTION _id SKU_CODE price BoxCategories description image");

//       result.push({
//         box: {
//           _id: box._id,
//           name: box.boxName || "",
//           size: box.size,
//           price: box.price,
//           totalLimit: box.totalLimit || box.size,
//           typeLimits: box.typeLimits || {},
//           description: box.description || "",
//           image: box.image || "./images/product-grid.png",
//         },
//         chocolates: chocolates.map((choc) => ({
//           _id: choc._id,
//           name: choc.chocolateName || "",
//           type: choc.chocolateType || "",
//           sku: choc.SKU_CODE || "",
//           description: choc.description || "",
//           price: choc.price,
//           boxCategories: choc.BoxCategories || [],
//           image: choc.image || "./images/product-grid.png",
//         })),
//       });
//     }

//     res.json({
//       category: {
//         id: category._id,
//         name: categoryName,
//         description: category.description || "",
//         image: category.image || "./images/category-placeholder.png",
//       },
//       boxes: result,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });
// app.get("/api/store/boxes/:id", async (req, res) => {
//   try {
//     const box = await Box.findById(req.params.id);

//     if (!box) {
//       return res.status(404).json({ message: "Box not found" });
//     }

//     res.json(box);
//   } catch (error) {
//     console.error("Box fetch error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });
// // ============================
// //  GLOBAL ERROR HANDLER
// // ============================
// app.use((err, req, res, next) => {
//   console.error("🔥 Server Error:", err.stack || err);
//   res.status(err.status || 500).json({ message: err.message || "Something went wrong." });
// });

// // ============================
// //  START SERVER
// // ============================
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));




  // ============================
  //  YOUR EXISTING CODE STARTS
  // ============================

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

app.use("/uploads", express.static(path.join(__dirname, "./Admin/uploads")));


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



