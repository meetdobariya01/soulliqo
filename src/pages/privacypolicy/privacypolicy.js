import React from "react";
import { motion } from "framer-motion";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const Privacypolicy = () => {
  return (
    <div>
      {/* Header can be added here if needed */}
      <Header />

      <div className="terms-bg py-5">
        <div className="container">
          <motion.div
            className="text-center mb-5"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="fw-bold text-dark">Privacy Policy</h1>
            <p className="text-muted">Last updated: November 2025</p>
          </motion.div>

          <motion.div
            className="card shadow-lg border-0 p-4 rounded-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            <motion.section
              className="mb-4"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 150 }}
            >
              <h3 className="fw-semibold text-choco">Introduction</h3>
              <p>
                At <b>Soulliqo</b>, we respect your privacy and are committed to
                protecting your personal data. This policy outlines how we
                collect, use, and safeguard your information.
              </p>
            </motion.section>

            <motion.section
              className="mb-4"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 150 }}
            >
              <h3 className="fw-semibold text-choco">Information We Collect</h3>
              <ul>
                <li>
                  <b>Personal Information:</b> Name, email, phone,
                  billing/shipping address.
                </li>
                <li>
                  <b>Payment Data:</b> Processed securely by payment partners
                  (we don’t store full card details).
                </li>
                <li>
                  <b>Usage Data:</b> Pages visited, browser type, and device
                  information to improve our website experience.
                </li>
              </ul>
            </motion.section>

            <motion.section
              className="mb-4"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 150 }}
            >
              <h3 className="fw-semibold text-choco">
                How We Use Your Information
              </h3>
              <ul>
                <li>To process and deliver your orders.</li>
                <li>
                  To send order confirmations, shipping updates, and customer
                  support communication.
                </li>
                <li>
                  To improve our services and tailor marketing based on user
                  preferences.
                </li>
                <li>
                  To comply with legal obligations and prevent fraudulent
                  transactions.
                </li>
              </ul>
            </motion.section>

            <motion.section
              className="mb-4"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 150 }}
            >
              <h3 className="fw-semibold text-choco">Data Protection</h3>
              <p>
                We implement industry-standard security measures including
                encryption and firewalls. However, no online transmission is
                100% secure, and we cannot guarantee absolute safety.
              </p>
            </motion.section>

            <motion.section
              className="mb-4"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 150 }}
            >
              <h3 className="fw-semibold text-choco">Cookies</h3>
              <p>
                We use cookies to enhance user experience, remember cart items,
                and track website performance. You can manage or disable cookies
                in your browser settings.
              </p>
            </motion.section>

            <motion.section
              className="mb-4"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 150 }}
            >
              <h3 className="fw-semibold text-choco">Third-Party Services</h3>
              <p>
                We may use trusted third-party tools for payment, delivery,
                analytics, or marketing (e.g., Razorpay, Google Analytics). Each
                provider follows its own privacy policy.
              </p>
            </motion.section>

            <motion.section
              className="mb-4"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 150 }}
            >
              <h3 className="fw-semibold text-choco">Your Rights</h3>
              <ul>
                <li>Access and review your stored data.</li>
                <li>
                  Request corrections or deletion of personal information.
                </li>
                <li>
                  Opt-out of promotional emails anytime by clicking
                  <b> “Unsubscribe.”</b>
                </li>
              </ul>
            </motion.section>

            <motion.section
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 150 }}
            >
              <h3 className="fw-semibold text-choco">Contact Us</h3>
              <p>
                For privacy-related queries, email{" "}
                <a href="mailto:soulliqo@gmail.com">soulliqo@gmail.com</a>
              </p>
            </motion.section>
          </motion.div>
        </div>
      </div>

      {/* You can add Footer here if needed */}
      <Footer />
    </div>
  );
};

export default Privacypolicy;
