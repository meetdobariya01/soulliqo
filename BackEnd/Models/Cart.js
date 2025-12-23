// const mongoose = require("mongoose");

// const cartSchema = new mongoose.Schema(
//   {
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     items: [
//       {
//         type: { type: String, enum: ["product", "box"], default: "product" },
//         product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, // ✅ for single products
//         box: { type: mongoose.Schema.Types.ObjectId, ref: "Box" },         // ✅ for custom boxes
//         name: String,
//         price: { type: Number, default: 0 },
//         image: { type: String },
//         quantity: { type: Number, default: 1 },
//         products: [
//           {
//             chocolate: { type: mongoose.Schema.Types.ObjectId, ref: "Chocolate" },
//             quantity: { type: Number, default: 1 },
//           },
//         ],
//       },
//     ],
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Cart", cartSchema);


const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        type: { type: String, enum: ["product", "box"], default: "product" },

        // for single products
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },

        // for custom boxes
        box: { type: mongoose.Schema.Types.ObjectId, ref: "Box" },
        name: String,
        image: String,

        // price and quantity
        price: { type: Number, default: 0 },
        quantity: { type: Number, default: 1 },

        // for chocolates inside a custom box
        products: [
          {
            chocolate: { type: mongoose.Schema.Types.ObjectId, ref: "Chocolate" },
            quantity: { type: Number, default: 1 },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
