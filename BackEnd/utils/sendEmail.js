const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, html) => {
  // Create transporter
  const transporter = nodemailer.createTransport({
    service: "Gmail", // or use "smtp.mailtrap.io" for testing
    auth: {
      user: process.env.EMAIL_USER, // your Gmail or SMTP username
      pass: process.env.EMAIL_PASS, // app password or SMTP password
    },
  });

  // Send email
  await transporter.sendMail({
    from: `"Your Store" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
