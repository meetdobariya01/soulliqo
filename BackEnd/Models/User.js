const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    mobile: { type: String, unique: true, sparse: true },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    otp: { type: String }, // for forgot password
    otpExpires: { type: Date },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }], // merged field
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
