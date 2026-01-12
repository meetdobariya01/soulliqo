const nodemailer = require("nodemailer");

/**
 * Sends an email using Hostinger SMTP settings.
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject line
 * @param {string} html - Email body in HTML format
 */
const sendEmail = async (to, subject, html) => {
  // 1. Create transporter configured for Hostinger
  // Hostinger uses smtp.hostinger.com and port 465 for SSL
  const transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com", 
    port: 465,                  
    secure: true,               // Use true for port 465
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS, 
    },
    // Optional: Increases reliability on some VPS environments
    tls: {
      rejectUnauthorized: false
    }
  });

  // 2. Send the email
  try {
    const info = await transporter.sendMail({
      from: `"Soulliqo" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log("✅ Email sent successfully: %s", info.messageId);
  } catch (error) {
    console.error("❌ Email error in sendEmail.js:", error.message);
    // Re-throw the error so your auth routes can handle the failure
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

module.exports = sendEmail;