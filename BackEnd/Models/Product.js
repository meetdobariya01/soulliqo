const mongoose = require('mongoose');
const foodSchema = new mongoose.Schema({
  FoodName: String,
  FoodPrice: Number,
  Description: String,
  Category: String,
  Type: String,
  Photos: String,
  Unit: String,
  
  ratings: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      stars: { type: Number, min: 1, max: 5 }, // ⭐ star rating
      comment: { type: String },
      createdAt: { type: Date, default: Date.now }
    }
  ],

  averageRating: { type: Number, default: 0 },
});
module.exports = mongoose.model('Foods', foodSchema);


// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";

// dotenv.config();
// const app = express();
// app.use(express.json());

// // --------- SCHEMAS ---------
// const boxSizeSchema = new mongoose.Schema({
//   label: String,   // e.g. "Box of 12"
//   quantity: Number // e.g. 12
// });

// const collectionSchema = new mongoose.Schema({
//   name: String,             // e.g. "Signature Collection"
//   boxSizes: [boxSizeSchema]
// });

// const categorySchema = new mongoose.Schema({
//   name: String,             // e.g. "Pralines"
//   collections: [collectionSchema]
// });

// const chocolateSchema = new mongoose.Schema({
//   brand: { type: String, default: "Sweet Indulgence" },
//   categories: [categorySchema]
// });

// const Chocolate = mongoose.model("Chocolate", chocolateSchema);

// // --------- CONNECT DB & SEED ---------
// async function connectDB() {
//   await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
//   console.log("✅ MongoDB connected");
// }
// connectDB().catch(err => {
//   console.error("MongoDB connection error:", err);
//   process.exit(1);
// });

// // Seed route (call once to populate the chart structure)
// app.post("/seed", async (req, res) => {
//   try {
//     const exists = await Chocolate.findOne({ brand: "Sweet Indulgence" });
//     if (exists) return res.status(400).json({ message: "Seed already exists" });

//     await Chocolate.create({
//       brand: "Sweet Indulgence",
//       categories: [
//         {
//           name: "Make Your Own Assortment",
//           collections: [
//             {
//               name: "Personal Selection",
//               boxSizes: [
//                 { label: "Box of 16", quantity: 16 },
//                 { label: "Box of 21", quantity: 21 },
//                 { label: "Box of 24", quantity: 24 }
//               ]
//             }
//           ]
//         },
//         {
//           name: "Pralines",
//           collections: [
//             { name: "Make Your Own Assortment", boxSizes: [{ label: "Box of 12", quantity: 12 }] },
//             { name: "Signature Collection", boxSizes: [{ label: "Box of 9", quantity: 9 }, { label: "Box of 16", quantity: 16 }] },
//             { name: "Classic Collection", boxSizes: [{ label: "Box of 12", quantity: 12 }] }
//           ]
//         },
//         {
//           name: "Truffles",
//           collections: [
//             { name: "Make Your Own Assortment", boxSizes: [{ label: "Box of 12", quantity: 12 }] },
//             { name: "Signature Collection", boxSizes: [{ label: "Box of 7", quantity: 7 }] },
//             { name: "Classic Collection", boxSizes: [{ label: "Box of 16", quantity: 16 }] }
//           ]
//         },
//         {
//           name: "Bon Bon",
//           collections: [
//             {
//               name: "Make Your Own Assortment",
//               boxSizes: [
//                 { label: "Box of 9", quantity: 9 },
//                 { label: "Box of 12", quantity: 12 },
//                 { label: "Box of 16", quantity: 16 },
//                 { label: "Box of 21", quantity: 21 },
//                 { label: "Box of 24", quantity: 24 }
//               ]
//             },
//             { name: "Signature Collection", boxSizes: [{ label: "Box of 16", quantity: 16 }] },
//             { name: "Classic Collection", boxSizes: [{ label: "Box of 16", quantity: 16 }] }
//           ]
//         }
//       ]
//     });

//     res.json({ message: "Seeded chocolate categories successfully." });
//   } catch (err) {
//     console.error("Seed error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // --------- API ENDPOINTS (3-level) ---------

// // 1) Get all top-level categories
// app.get("/categories", async (req, res) => {
//   try {
//     const chocolate = await Chocolate.findOne({ brand: "Sweet Indulgence" });
//     if (!chocolate) return res.status(404).json({ message: "No categories found" });

//     const categories = chocolate.categories.map(cat => ({
//       id: cat._id,
//       name: cat.name
//     }));

//     res.json(categories);
//   } catch (err) {
//     console.error("GET /categories error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // 2) Get collections for a category (by categoryId)
// app.get("/categories/:categoryId/collections", async (req, res) => {
//   try {
//     const { categoryId } = req.params;
//     const chocolate = await Chocolate.findOne({ brand: "Sweet Indulgence" });
//     if (!chocolate) return res.status(404).json({ message: "No categories found" });

//     const category = chocolate.categories.id(categoryId);
//     if (!category) return res.status(404).json({ message: "Category not found" });

//     const collections = category.collections.map(col => ({
//       id: col._id,
//       name: col.name
//     }));

//     res.json({ category: { id: category._id, name: category.name }, collections });
//   } catch (err) {
//     console.error("GET /categories/:categoryId/collections error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // 3) Get box sizes for a collection
// app.get("/categories/:categoryId/collections/:collectionId/box-sizes", async (req, res) => {
//   try {
//     const { categoryId, collectionId } = req.params;
//     const chocolate = await Chocolate.findOne({ brand: "Sweet Indulgence" });
//     if (!chocolate) return res.status(404).json({ message: "No categories found" });

//     const category = chocolate.categories.id(categoryId);
//     if (!category) return res.status(404).json({ message: "Category not found" });

//     const collection = category.collections.id(collectionId);
//     if (!collection) return res.status(404).json({ message: "Collection not found" });

//     const boxSizes = collection.boxSizes.map(bs => ({
//       id: bs._id,
//       label: bs.label,
//       quantity: bs.quantity
//     }));

//     res.json({ category: { id: category._id, name: category.name }, collection: { id: collection._id, name: collection.name }, boxSizes });
//   } catch (err) {
//     console.error("GET /box-sizes error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // Optional: get full hierarchy (single call)
// app.get("/chocolates/full", async (req, res) => {
//   try {
//     const data = await Chocolate.findOne({ brand: "Sweet Indulgence" });
//     if (!data) return res.status(404).json({ message: "No data" });
//     res.json(data);
//   } catch (err) {
//     console.error("GET /chocolates/full error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // Start
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`🚀 Server listening on ${PORT}`));



//   const { YourName, YourEmail, PhoneNumber, Message } = req.body;
//   if (!YourName || !YourEmail || !PhoneNumber || !Message) {
//     return res.status(400).json({ message: "All fields are required." });
//   }
//   try {
//     const contact = new ContactUs({
//       YourName,
//       YourEmail,
//       PhoneNumber,
//       Message,
//     });
//     await contact.save();
//     // Set up the transporter
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.MAIL_USER,     // your Gmail address from .env
//         pass: process.env.MAIL_PASS,     // app-specific password or real password
//       },
//     });
//     // Define the email options
//     const mailOptions = {
//       from: `"Gourmet Bazar" <${process.env.MAIL_USER}>`,
//       to: YourEmail,  // sending to user or your admin email
//       subject: `Thank you for contacting us, ${YourName}`,
//       html: `
//         <h3>Hello, ${YourName}</h3>
//         <p>We received your message:</p>
//         <blockquote>${Message}</blockquote>
//         <p>We'll get back to you shortly.</p>
//         <hr />
//         <p><strong>Email:</strong> ${YourEmail}</p>
//         <p><strong>Phone Number:</strong> ${PhoneNumber}</p>
//       `,
//     };
//     // Send the email
//     await transporter.sendMail(mailOptions);
//     return res.status(200).json({ message: `Email sent to ${YourEmail}` });
//   } catch (error) {
//     console.error("Contact form error:", error);
//     return res.status(500).json({
//       error: "Server error during contact submission.",
//       details: error.message,
//     });
//   }
// });