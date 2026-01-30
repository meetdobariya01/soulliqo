const express = require("express");
const asyncHandler = require("../Middleware/asyncHandler");
const Contact = require("../Models/Contact");
const nodemailer = require("nodemailer");
const router = express.Router();
// Mailer
const mailer = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER, // your gmail
    pass: process.env.MAIL_PASS, // app password
  },
});
// Contact form
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !message)
      return res
        .status(400)
        .json({ error: "Name, Email, and Message are required." });
    const newContact = new Contact({ name, email, phone, message });
    await newContact.save();
    await mailer.sendMail({
      from: `"Soulliqo Contact Form" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_TO || process.env.MAIL_USER,
      subject: "New Contact Form Submission",
      html: `<h2>New Contact Form Submission</h2>
           <p><b>Name:</b> ${name}</p>
           <p><b>Email:</b> ${email}</p>
           <p><b>Phone:</b> ${phone || "N/A"}</p>
           <p><b>Message:</b><br/>${message}</p>`,
    });
    res.status(200).json({ success: "Thank You for contacting us!" });
  }),
);
module.exports = router;
